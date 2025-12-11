import { NextRequest, NextResponse } from 'next/server'
import { getPayload, getUser } from '@/lib/server-utils'
import {
  pusherServer,
  getFamilyChannel,
  getEventChannel,
  getDirectMessageChannel,
  getAnonymousChannel,
} from '@/lib/pusher-server'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const familyId = searchParams.get('family')
    const eventId = searchParams.get('event')
    const userId = searchParams.get('user')
    const assignmentId = searchParams.get('assignment')

    if (!familyId && !eventId && !userId && !assignmentId) {
      return NextResponse.json(
        { error: 'Either family, event, user, or assignment parameter is required' },
        { status: 400 },
      )
    }

    const payload = await getPayload()

    // Build where clause
    const where: any = {}
    if (familyId) {
      where.family = { equals: familyId }
    } else if (eventId) {
      where.event = { equals: eventId }
    } else if (userId) {
      // Direct messages: user can see messages where they are sender or recipient with the other user
      where.or = [
        {
          sender: { equals: user.id },
          recipient: { equals: userId },
          assignment: { exists: false },
        },
        {
          sender: { equals: userId },
          recipient: { equals: user.id },
          assignment: { exists: false },
        },
      ]
    } else if (assignmentId) {
      // Anonymous messages for assignment
      where.assignment = { equals: assignmentId }
    }

    const result = await payload.find({
      collection: 'message',
      where,
      sort: 'createdAt',
      depth: 1, // Reduced depth - only populate sender, not full nested relations
      limit: 100, // Limit to last 100 messages
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, familyId, eventId, userId, assignmentId } = body

    if (!content || (!familyId && !eventId && !userId && !assignmentId)) {
      return NextResponse.json(
        { error: 'Content and either familyId, eventId, userId, or assignmentId are required' },
        { status: 400 },
      )
    }

    // Ensure only one target is specified
    const targetCount = [familyId, eventId, userId, assignmentId].filter(Boolean).length
    if (targetCount !== 1) {
      return NextResponse.json(
        { error: 'Must specify exactly one of: familyId, eventId, userId, or assignmentId' },
        { status: 400 },
      )
    }

    const payload = await getPayload()

    // Verify user has access to the family or event
    if (familyId) {
      const family = await payload.findByID({
        collection: 'family',
        id: familyId,
      })

      if (
        !family.members?.some(
          (member) => (typeof member === 'string' ? member : member.id) === user.id,
        )
      ) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    if (eventId) {
      const event = await payload.findByID({
        collection: 'event',
        id: eventId,
      })

      // Check if user is creator
      const isCreator =
        (typeof event.creator === 'string' ? event.creator : event.creator?.id) === user.id

      // Check if user has an invite
      const invites = await payload.find({
        collection: 'invite',
        where: {
          event: {
            equals: eventId,
          },
          user: {
            equals: user.id,
          },
        },
        limit: 1,
      })

      if (!isCreator && invites.docs.length === 0) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    if (userId) {
      // Verify user can message this user (they should be in same families or events)
      // For now, we'll allow messaging any user they can see (relatedUsers access)
      // You can add more restrictions if needed
      if (userId === user.id) {
        return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 })
      }

      // Verify recipient exists and user has access to see them
      try {
        const recipient = await payload.findByID({
          collection: 'users',
          id: userId,
        })
        // If we can read the user, we can message them
      } catch (error) {
        return NextResponse.json({ error: 'Recipient not found or access denied' }, { status: 403 })
      }
    }

    if (assignmentId) {
      // Verify user is part of this assignment (giver or receiver)
      const assignment = await payload.findByID({
        collection: 'assignment',
        id: assignmentId,
      })

      // Get user's invite for this event
      const eventId = typeof assignment.event === 'string' ? assignment.event : assignment.event?.id
      if (!eventId) {
        return NextResponse.json({ error: 'Invalid assignment' }, { status: 400 })
      }

      const userInvites = await payload.find({
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

      if (userInvites.docs.length === 0) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      const userInviteId = userInvites.docs[0].id

      // Check if user is giver or receiver
      const giverId = typeof assignment.giver === 'string' ? assignment.giver : assignment.giver?.id
      const receiverId =
        typeof assignment.receiver === 'string' ? assignment.receiver : assignment.receiver?.id

      if (giverId !== userInviteId && receiverId !== userInviteId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Create the message
    const message = await payload.create({
      collection: 'message',
      data: {
        content,
        sender: user.id,
        ...(familyId ? { family: familyId } : {}),
        ...(eventId ? { event: eventId } : {}),
        ...(userId ? { recipient: userId } : {}),
        ...(assignmentId ? { assignment: assignmentId } : {}),
      },
    })

    // Populate sender for the real-time event
    const populatedMessage = await payload.findByID({
      collection: 'message',
      id: message.id,
      depth: assignmentId ? 1 : 3, // Less depth for anonymous messages
    })

    // Create a slimmed-down version for Pusher
    const slimMessage = {
      id: populatedMessage.id,
      content: populatedMessage.content,
      createdAt: populatedMessage.createdAt,
      updatedAt: populatedMessage.updatedAt,
      sender:
        assignmentId && typeof populatedMessage.sender !== 'string'
          ? {
              // For anonymous messages, only send minimal sender info
              id: populatedMessage.sender.id,
              name: null, // Hide name for anonymous
              email: '', // Hide email for anonymous
            }
          : typeof populatedMessage.sender === 'string'
            ? populatedMessage.sender
            : {
                id: populatedMessage.sender.id,
                name: populatedMessage.sender.name || null,
                email: populatedMessage.sender.email || '',
                avatar:
                  populatedMessage.sender.avatar &&
                  typeof populatedMessage.sender.avatar !== 'string'
                    ? {
                        url: populatedMessage.sender.avatar.url || null,
                        sizes: populatedMessage.sender.avatar.sizes?.thumbnail
                          ? {
                              thumbnail: {
                                url: populatedMessage.sender.avatar.sizes.thumbnail.url || null,
                              },
                            }
                          : undefined,
                      }
                    : undefined,
              },
      family:
        typeof populatedMessage.family === 'string'
          ? populatedMessage.family
          : populatedMessage.family?.id,
      event:
        typeof populatedMessage.event === 'string'
          ? populatedMessage.event
          : populatedMessage.event?.id,
      recipient:
        typeof populatedMessage.recipient === 'string'
          ? populatedMessage.recipient
          : populatedMessage.recipient?.id,
      assignment:
        typeof populatedMessage.assignment === 'string'
          ? populatedMessage.assignment
          : populatedMessage.assignment?.id,
    }

    // Trigger Pusher event
    let channel: string
    if (familyId) {
      channel = getFamilyChannel(familyId)
    } else if (eventId) {
      channel = getEventChannel(eventId)
    } else if (userId) {
      channel = getDirectMessageChannel(user.id, userId)
    } else if (assignmentId) {
      channel = getAnonymousChannel(assignmentId)
    } else {
      throw new Error('No valid channel target')
    }

    await pusherServer.trigger(channel, 'new-message', {
      message: slimMessage,
    })

    return NextResponse.json({ message: populatedMessage }, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
