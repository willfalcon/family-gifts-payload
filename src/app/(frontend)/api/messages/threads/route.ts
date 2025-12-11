import { NextRequest, NextResponse } from 'next/server'
import { getPayload, getUser } from '@/lib/server-utils'

export interface Thread {
  type: 'family' | 'event' | 'direct' | 'anonymous'
  id: string
  name: string
  lastMessage?: {
    content: string
    sender: {
      id: string
      name?: string | null
      email: string
    }
    createdAt: string
  }
  lastMessageAt?: string
  participant?: {
    id: string
    name?: string | null
    email: string
    avatar?: {
      url?: string | null
      sizes?: {
        thumbnail?: {
          url?: string | null
        }
      }
    }
  }
  event?: {
    id: string
    name: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload()
    const threads: Thread[] = []

    // Get user's families
    const userFamilies = await payload.find({
      collection: 'family',
      where: {
        members: {
          contains: user.id,
        },
      },
      depth: 0,
      limit: 1000,
    })

    // Batch fetch last messages for all families at once
    const familyIds = userFamilies.docs.map((f) => f.id)
    const familyLastMessages =
      familyIds.length > 0
        ? await payload.find({
            collection: 'message',
            where: {
              family: {
                in: familyIds,
              },
            },
            depth: 1,
            limit: 1000, // Fetch enough messages to ensure we get recent ones
          })
        : { docs: [] }

    // Sort messages by createdAt descending (most recent first)
    familyLastMessages.docs.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Group messages by family and get the most recent for each
    const familyMessagesMap = new Map<string, (typeof familyLastMessages.docs)[0]>()
    for (const message of familyLastMessages.docs) {
      const familyId = typeof message.family === 'string' ? message.family : message.family?.id
      if (
        familyId &&
        (!familyMessagesMap.has(familyId) ||
          message.createdAt > (familyMessagesMap.get(familyId)?.createdAt || ''))
      ) {
        familyMessagesMap.set(familyId, message)
      }
    }

    // Build family threads
    for (const family of userFamilies.docs) {
      const lastMessage = familyMessagesMap.get(family.id)

      threads.push({
        type: 'family',
        id: family.id,
        name: family.name,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              sender: {
                id:
                  typeof lastMessage.sender === 'string'
                    ? lastMessage.sender
                    : lastMessage.sender?.id || '',
                name:
                  typeof lastMessage.sender === 'string' ? null : lastMessage.sender?.name || null,
                email:
                  typeof lastMessage.sender === 'string' ? '' : lastMessage.sender?.email || '',
              },
              createdAt: lastMessage.createdAt,
            }
          : undefined,
        lastMessageAt: lastMessage?.createdAt,
      })
    }

    // Get user's events (invited or created)
    const userInvites = await payload.find({
      collection: 'invite',
      where: {
        user: {
          equals: user.id,
        },
        event: {
          exists: true,
        },
      },
      depth: 0,
      limit: 1000,
    })

    const invitedEventIds = userInvites.docs
      .map((invite) => {
        if (typeof invite.event === 'string') {
          return invite.event
        }
        if (invite.event && typeof invite.event === 'object' && 'id' in invite.event) {
          return invite.event.id
        }
        return null
      })
      .filter((id): id is string => id !== null)

    const createdEvents = await payload.find({
      collection: 'event',
      where: {
        creator: {
          equals: user.id,
        },
      },
      depth: 0,
      limit: 1000,
    })

    const allEventIds = [...new Set([...invitedEventIds, ...createdEvents.docs.map((e) => e.id)])]

    // Batch fetch events and their last messages
    const eventsMap = new Map<string, { id: string; name: string }>()
    if (allEventIds.length > 0) {
      const events = await payload.find({
        collection: 'event',
        where: {
          id: {
            in: allEventIds,
          },
        },
        depth: 0,
        limit: 1000,
      })
      for (const event of events.docs) {
        eventsMap.set(event.id, { id: event.id, name: event.name })
      }

      // Batch fetch last messages for all events
      const eventLastMessages = await payload.find({
        collection: 'message',
        where: {
          event: {
            in: allEventIds,
          },
        },
        depth: 1,
        limit: 1000, // Fetch enough messages to ensure we get recent ones
      })

      // Sort messages by createdAt descending (most recent first)
      eventLastMessages.docs.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      // Group messages by event and get the most recent for each
      const eventMessagesMap = new Map<string, (typeof eventLastMessages.docs)[0]>()
      for (const message of eventLastMessages.docs) {
        const eventId = typeof message.event === 'string' ? message.event : message.event?.id
        if (
          eventId &&
          (!eventMessagesMap.has(eventId) ||
            message.createdAt > (eventMessagesMap.get(eventId)?.createdAt || ''))
        ) {
          eventMessagesMap.set(eventId, message)
        }
      }

      // Build event threads
      for (const eventId of allEventIds) {
        const event = eventsMap.get(eventId)
        if (!event) continue

        const lastMessage = eventMessagesMap.get(eventId)

        threads.push({
          type: 'event',
          id: event.id,
          name: event.name,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                sender: {
                  id:
                    typeof lastMessage.sender === 'string'
                      ? lastMessage.sender
                      : lastMessage.sender?.id || '',
                  name:
                    typeof lastMessage.sender === 'string'
                      ? null
                      : lastMessage.sender?.name || null,
                  email:
                    typeof lastMessage.sender === 'string' ? '' : lastMessage.sender?.email || '',
                },
                createdAt: lastMessage.createdAt,
              }
            : undefined,
          lastMessageAt: lastMessage?.createdAt,
        })
      }
    }

    // Get direct message threads
    // Find all messages where user is sender or recipient
    const directMessages = await payload.find({
      collection: 'message',
      where: {
        or: [
          {
            sender: {
              equals: user.id,
            },
            recipient: {
              exists: true,
            },
          },
          {
            recipient: {
              equals: user.id,
            },
          },
        ],
        family: {
          exists: false,
        },
        event: {
          exists: false,
        },
      },
      depth: 2,
      limit: 1000,
    })

    // Group by other user ID
    const dmThreads = new Map<string, Thread>()

    for (const message of directMessages.docs) {
      const senderId =
        typeof message.sender === 'string' ? message.sender : message.sender?.id || ''
      const recipientId =
        typeof message.recipient === 'string' ? message.recipient : message.recipient?.id || ''

      // Determine the other user in the conversation
      const otherUserId = senderId === user.id ? recipientId : senderId
      if (!otherUserId || otherUserId === user.id) continue

      const threadKey = otherUserId

      // Get or create thread
      if (!dmThreads.has(threadKey)) {
        const otherUser =
          senderId === user.id
            ? typeof message.recipient === 'string'
              ? null
              : message.recipient
            : typeof message.sender === 'string'
              ? null
              : message.sender

        if (!otherUser) {
          // Fetch user if not populated
          try {
            const fetchedUser = await payload.findByID({
              collection: 'users',
              id: otherUserId,
              depth: 1,
            })
            dmThreads.set(threadKey, {
              type: 'direct',
              id: otherUserId,
              name: fetchedUser.name || fetchedUser.email,
              participant: {
                id: fetchedUser.id,
                name: fetchedUser.name || null,
                email: fetchedUser.email,
                avatar: fetchedUser.avatar
                  ? typeof fetchedUser.avatar === 'string'
                    ? undefined
                    : {
                        url: fetchedUser.avatar.url || null,
                        sizes: fetchedUser.avatar.sizes
                          ? {
                              thumbnail: {
                                url: fetchedUser.avatar.sizes.thumbnail?.url || null,
                              },
                            }
                          : undefined,
                      }
                  : undefined,
              },
            })
          } catch {
            continue
          }
        } else {
          dmThreads.set(threadKey, {
            type: 'direct',
            id: otherUserId,
            name: otherUser.name || otherUser.email,
            participant: {
              id: otherUser.id,
              name: otherUser.name || null,
              email: otherUser.email,
              avatar: otherUser.avatar
                ? typeof otherUser.avatar === 'string'
                  ? undefined
                  : {
                      url: otherUser.avatar.url || null,
                      sizes: otherUser.avatar.sizes
                        ? {
                            thumbnail: {
                              url: otherUser.avatar.sizes.thumbnail?.url || null,
                            },
                          }
                        : undefined,
                    }
                : undefined,
            },
          })
        }
      }

      const thread = dmThreads.get(threadKey)!
      // Update last message if this one is newer
      if (!thread.lastMessageAt || message.createdAt > thread.lastMessageAt) {
        thread.lastMessage = {
          content: message.content,
          sender: {
            id: senderId,
            name: typeof message.sender === 'string' ? null : message.sender?.name || null,
            email: typeof message.sender === 'string' ? '' : message.sender?.email || '',
          },
          createdAt: message.createdAt,
        }
        thread.lastMessageAt = message.createdAt
      }
    }

    // Add all DM threads to the list
    threads.push(...Array.from(dmThreads.values()))

    // Get anonymous threads (assignments)
    const userAssignments = await payload.find({
      collection: 'assignment',
      where: {
        or: [
          {
            'giver.user': {
              equals: user.id,
            },
          },
          {
            'receiver.user': {
              equals: user.id,
            },
          },
        ],
      },
      depth: 2,
      limit: 1000,
    })

    // Batch fetch last messages for all assignments
    const assignmentIds = userAssignments.docs.map((a) => a.id)
    const assignmentLastMessages =
      assignmentIds.length > 0
        ? await payload.find({
            collection: 'message',
            where: {
              assignment: {
                in: assignmentIds,
              },
            },
            depth: 1,
            limit: 1000, // Fetch enough messages to ensure we get recent ones
          })
        : { docs: [] }

    // Sort messages by createdAt descending (most recent first)
    if (assignmentLastMessages.docs.length > 0) {
      assignmentLastMessages.docs.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    }

    // Group messages by assignment and get the most recent for each
    const assignmentMessagesMap = new Map<string, (typeof assignmentLastMessages.docs)[0]>()
    for (const message of assignmentLastMessages.docs) {
      const assignmentId =
        typeof message.assignment === 'string' ? message.assignment : message.assignment?.id
      if (
        assignmentId &&
        (!assignmentMessagesMap.has(assignmentId) ||
          message.createdAt > (assignmentMessagesMap.get(assignmentId)?.createdAt || ''))
      ) {
        assignmentMessagesMap.set(assignmentId, message)
      }
    }

    // Get last message for each assignment
    for (const assignment of userAssignments.docs) {
      const lastMessage = assignmentMessagesMap.get(assignment.id)

      // Only add thread if there's at least one message
      if (!lastMessage) {
        continue
      }

      // Get event info
      const event =
        typeof assignment.event === 'string'
          ? await payload.findByID({ collection: 'event', id: assignment.event, depth: 0 })
          : assignment.event

      // Determine the other participant (for display name)
      const giverInvite =
        typeof assignment.giver === 'string'
          ? await payload.findByID({ collection: 'invite', id: assignment.giver, depth: 1 })
          : assignment.giver
      const receiverInvite =
        typeof assignment.receiver === 'string'
          ? await payload.findByID({ collection: 'invite', id: assignment.receiver, depth: 1 })
          : assignment.receiver

      const giverUser = giverInvite?.user
        ? typeof giverInvite.user === 'string'
          ? await payload.findByID({ collection: 'users', id: giverInvite.user, depth: 0 })
          : giverInvite.user
        : null
      const receiverUser = receiverInvite?.user
        ? typeof receiverInvite.user === 'string'
          ? await payload.findByID({ collection: 'users', id: receiverInvite.user, depth: 0 })
          : receiverInvite.user
        : null

      // Determine if user is giver or receiver
      // Get user's invite for this event
      const eventId = typeof event === 'string' ? event : event?.id
      const userEventInvites = eventId
        ? await payload.find({
            collection: 'invite',
            where: {
              user: {
                equals: user.id,
              },
              event: {
                equals: eventId,
              },
            },
            limit: 1,
          })
        : { docs: [] }

      const userInviteId = userEventInvites.docs[0]?.id
      const isGiver = giverInvite?.id === userInviteId
      const otherUser = isGiver ? receiverUser : giverUser

      threads.push({
        type: 'anonymous',
        id: assignment.id,
        name: `Secret Santa: ${otherUser?.name || otherUser?.email || 'Unknown'}`,
        event: event
          ? {
              id: typeof event === 'string' ? event : event.id,
              name: typeof event === 'string' ? '' : event.name,
            }
          : undefined,
        lastMessage: {
          content: lastMessage.content,
          sender: {
            id: 'anonymous',
            name: 'Anonymous',
            email: '',
          },
          createdAt: lastMessage.createdAt,
        },
        lastMessageAt: lastMessage.createdAt,
      })
    }

    // Sort all threads by lastMessageAt (most recent first)
    // Threads without messages go to the end
    threads.sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
      if (aTime === 0 && bTime === 0) return 0 // Both have no messages, maintain order
      if (aTime === 0) return 1 // a has no messages, put it last
      if (bTime === 0) return -1 // b has no messages, put it last
      return bTime - aTime // Both have messages, sort by time
    })

    return NextResponse.json({ threads })
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
