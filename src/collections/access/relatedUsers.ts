import type { Access, Where } from 'payload'
import { checkRole } from './checkRole'

export const relatedUsers: Access = async (props) => {
  const {
    req: { user, payload },
  } = props
  if (!user) {
    return false
  }
  if (checkRole(['super-admin'], user)) {
    return true
  }

  // Find all events where the current user has an invite
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
    depth: 0, // Get IDs as strings, not populated objects
    limit: 1000,
  })

  const invitedEventIds = userInvites.docs
    .map((invite) => {
      // Handle both string ID and populated Event object
      if (typeof invite.event === 'string') {
        return invite.event
      }
      if (invite.event && typeof invite.event === 'object' && 'id' in invite.event) {
        return invite.event.id
      }
      return null
    })
    .filter((id): id is string => id !== null)

  // Find all users who have invites to the same events
  let sharedEventUserIds: string[] = []
  if (invitedEventIds.length > 0) {
    const sharedEventInvites = await payload.find({
      collection: 'invite',
      where: {
        event: {
          in: invitedEventIds,
        },
        user: {
          exists: true,
        },
      },
      depth: 0,
      limit: 1000,
    })

    sharedEventUserIds = sharedEventInvites.docs
      .map((invite) => {
        // Handle both string ID and populated User object
        if (typeof invite.user === 'string') {
          return invite.user
        }
        if (invite.user && typeof invite.user === 'object' && 'id' in invite.user) {
          return invite.user.id
        }
        return null
      })
      .filter((id): id is string => id !== null)
    // Remove duplicates
    sharedEventUserIds = [...new Set(sharedEventUserIds)]
  }

  // Users can read themselves, members of the same family, or users with invites to the same events
  const whereClause: Where = {
    or: [
      {
        id: { equals: user.id },
      },
      {
        'families.members': {
          contains: user.id,
        },
      },
      ...(sharedEventUserIds.length > 0
        ? [
            {
              id: {
                in: sharedEventUserIds,
              },
            },
          ]
        : []),
    ],
  } as Where

  return whereClause
}
