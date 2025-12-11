import { CollectionConfig, Where } from 'payload'
import { checkRole } from './access/checkRole'

export const Event: CollectionConfig = {
  slug: 'event',
  indexes: [
    {
      fields: ['creator'],
    },
    // Note: managers is a hasMany relationship stored in a junction table,
    // so it can't be indexed on the main table.
    {
      fields: ['family'],
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'time',
      type: 'date',
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'endTime',
      type: 'date',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'info',
      type: 'json',
    },
    {
      name: 'family',
      type: 'relationship',
      relationTo: 'family',
      required: false,
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'managers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'invites',
      type: 'join',
      collection: 'invite',
      on: 'event',
    },
    {
      name: 'secretSantaBudget',
      type: 'text',
    },
    {
      name: 'secretSantaParticipants',
      type: 'relationship',
      relationTo: 'invite',
      hasMany: true,
    },
    {
      name: 'assignments',
      type: 'join',
      collection: 'assignment',
      on: 'event',
    },
    {
      name: 'exclusions',
      type: 'join',
      collection: 'exclusion',
      on: 'event',
    },
    {
      name: 'secretSantaNotificationsSent',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'favorite',
      type: 'join',
      collection: 'favorite',
      on: 'favorite',
    },
  ],
  access: {
    create: () => true,
    read: async ({ req: { user, payload } }) => {
      // If no user is logged in, deny access
      if (!user) {
        return false
      }

      // Super admins can read all events
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Query events that have invites for this user
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

      // Users can read events if they are the creator or if they have an invite
      const whereClause: Where = {
        or: [
          {
            creator: {
              equals: user.id,
            },
          },
          ...(invitedEventIds.length > 0
            ? [
                {
                  id: {
                    in: invitedEventIds,
                  },
                },
              ]
            : []),
        ],
      } as Where

      return whereClause
    },
    update: ({ req: { user } }) => {
      if (!user) {
        return false
      }

      // Super admins can update all events
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Only creators and managers can update events
      return {
        or: [
          {
            managers: {
              contains: user.id,
            },
          },
          {
            creator: {
              equals: user.id,
            },
          },
        ],
      } as Where
    },
    delete: ({ req: { user } }) => {
      if (!user) {
        return false
      }

      // Super admins can delete all events
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Only creators and managers can delete events
      return {
        or: [
          {
            managers: {
              contains: user.id,
            },
          },
          {
            creator: {
              equals: user.id,
            },
          },
        ],
      } as Where
    },
  },
}
