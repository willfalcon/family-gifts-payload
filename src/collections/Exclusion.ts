import { CollectionConfig, Where } from 'payload'
import { checkRole } from './access/checkRole'

export const Exclusion: CollectionConfig = {
  slug: 'exclusion',
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
    },
    {
      name: 'from',
      type: 'relationship',
      relationTo: 'invite',
    },
    {
      name: 'to',
      type: 'relationship',
      relationTo: 'invite',
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

      // Super admins can read all exclusions
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

      // Users can read exclusions if the exclusion's event is in their accessible events
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

      // If no accessible events, return false (no exclusions accessible)
      if (accessibleEventIds.length === 0) {
        return false
      }

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
