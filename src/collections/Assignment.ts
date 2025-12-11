import { CollectionConfig, Where } from 'payload'
import { checkRole } from './access/checkRole'

export const Assignment: CollectionConfig = {
  slug: 'assignment',
  indexes: [
    {
      fields: ['event'],
    },
    {
      fields: ['giver'],
    },
    {
      fields: ['receiver'],
    },
  ],
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
      required: true,
    },
    {
      name: 'giver',
      type: 'relationship',
      relationTo: 'invite',
      required: true,
    },
    {
      name: 'receiver',
      type: 'relationship',
      relationTo: 'invite',
      required: true,
    },
  ],
  access: {
    create: ({ req: { user }, data }) => {
      if (!user) {
        return false
      }
      if (checkRole(['super-admin'], user)) {
        return true
      }
      if (data?.event.creator.equals(user.id)) {
        return true
      }
      if (data?.event.managers.contains(user.id)) {
        return true
      }
      return false
    },
    read: async ({ req: { user, payload } }) => {
      // If no user is logged in, deny access
      if (!user) {
        return false
      }

      // Super admins can read all assignments
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Query invites for this user
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

      const userInviteIds = userInvites.docs.map((invite) => invite.id)

      // Query events where user is creator or manager
      const userEvents = await payload.find({
        collection: 'event',
        where: {
          or: [
            {
              creator: {
                equals: user.id,
              },
            },
            {
              managers: {
                contains: user.id,
              },
            },
          ],
        },
        depth: 0,
        limit: 1000,
      })

      const managedEventIds = userEvents.docs.map((event) => event.id)

      // Build where clause conditions
      const conditions: Where[] = []

      // Creators/managers can read all assignments in their events
      if (managedEventIds.length > 0) {
        conditions.push({
          event: {
            in: managedEventIds,
          },
        })
      }

      // Regular members can only read assignments where they are the giver
      // (not where they are the receiver - receivers should not see who they're receiving from)
      if (userInviteIds.length > 0) {
        conditions.push({
          giver: {
            in: userInviteIds,
          },
        })
      }

      // If no conditions, return false (no assignments accessible)
      if (conditions.length === 0) {
        return false
      }

      const whereClause: Where = {
        or: conditions,
      } as Where

      return whereClause
    },
    update: async ({ req: { user, payload } }) => {
      // If no user is logged in, deny access
      if (!user) {
        return false
      }

      // Super admins can update all assignments
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Query events where user is creator or manager
      const userEvents = await payload.find({
        collection: 'event',
        where: {
          or: [
            {
              creator: {
                equals: user.id,
              },
            },
            {
              managers: {
                contains: user.id,
              },
            },
          ],
        },
        depth: 0,
        limit: 1000,
      })

      const accessibleEventIds = userEvents.docs.map((event) => event.id)

      // Users can update assignments if the assignment's event is in their accessible events
      const whereClause: Where = {
        or: [
          ...(accessibleEventIds.length > 0
            ? [
                {
                  event: {
                    in: accessibleEventIds,
                  },
                },
              ]
            : []),
        ],
      } as Where

      // If no accessible events, return false (no assignments accessible)
      if (accessibleEventIds.length === 0) {
        return false
      }

      return whereClause
    },
    delete: async ({ req: { user, payload } }) => {
      // If no user is logged in, deny access
      if (!user) {
        return false
      }

      // Super admins can delete all assignments
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Query events where user is creator or manager
      const userEvents = await payload.find({
        collection: 'event',
        where: {
          or: [
            {
              creator: {
                equals: user.id,
              },
            },
            {
              managers: {
                contains: user.id,
              },
            },
          ],
        },
        depth: 0,
        limit: 1000,
      })

      const accessibleEventIds = userEvents.docs.map((event) => event.id)

      // Users can delete assignments if the assignment's event is in their accessible events
      const whereClause: Where = {
        or: [
          ...(accessibleEventIds.length > 0
            ? [
                {
                  event: {
                    in: accessibleEventIds,
                  },
                },
              ]
            : []),
        ],
      } as Where

      // If no accessible events, return false (no assignments accessible)
      if (accessibleEventIds.length === 0) {
        return false
      }

      return whereClause
    },
  },
}
