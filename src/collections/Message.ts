import { CollectionConfig, Where } from 'payload'
import { checkRole } from './access/checkRole'

export const Message: CollectionConfig = {
  slug: 'message',
  indexes: [
    {
      fields: ['family'],
    },
    {
      fields: ['event'],
    },
    {
      fields: ['sender'],
    },
    {
      fields: ['recipient'],
    },
    {
      fields: ['assignment'],
    },
    {
      fields: ['createdAt'],
    },
    // Composite index for common query patterns
    {
      fields: ['family', 'createdAt'],
    },
    {
      fields: ['event', 'createdAt'],
    },
    {
      fields: ['sender', 'recipient'],
    },
  ],
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'family',
      type: 'relationship',
      relationTo: 'family',
      required: false,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
      required: false,
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'assignment',
      type: 'relationship',
      relationTo: 'assignment',
      required: false,
    },
  ],
  access: {
    create: ({ req: { user } }) => {
      // Must be logged in to create messages
      return !!user
    },
    read: async ({ req: { user, payload } }) => {
      // If no user is logged in, deny access
      if (!user) {
        return false
      }

      // Super admins can read all messages
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Users can read messages from:
      // 1. Families they are members of
      // 2. Events they are invited to
      // 3. Direct messages where they are sender or recipient
      // 4. Anonymous messages in assignments where they are giver or receiver

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

      const familyIds = userFamilies.docs.map((f) => f.id)

      // Get user's event invites
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

      const eventIds = userInvites.docs
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

      // Also include events where user is creator
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

      const createdEventIds = createdEvents.docs.map((e) => e.id)
      const allEventIds = [...new Set([...eventIds, ...createdEventIds])]

      // Get user's assignments (where they are giver or receiver)
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
        depth: 0,
        limit: 1000,
      })

      const assignmentIds = userAssignments.docs.map((a) => a.id)

      const whereClause: Where = {
        or: [
          // Messages in user's families
          ...(familyIds.length > 0
            ? [
                {
                  family: {
                    in: familyIds,
                  },
                },
              ]
            : []),
          // Messages in user's events
          ...(allEventIds.length > 0
            ? [
                {
                  event: {
                    in: allEventIds,
                  },
                },
              ]
            : []),
          // Direct messages where user is sender
          {
            sender: {
              equals: user.id,
            },
            recipient: {
              exists: true,
            },
            assignment: {
              exists: false,
            },
          },
          // Direct messages where user is recipient
          {
            recipient: {
              equals: user.id,
            },
            assignment: {
              exists: false,
            },
          },
          // Anonymous messages in assignments where user is giver or receiver
          ...(assignmentIds.length > 0
            ? [
                {
                  assignment: {
                    in: assignmentIds,
                  },
                },
              ]
            : []),
        ],
      } as Where

      return whereClause
    },
    update: ({ req: { user } }) => {
      // Only allow users to update their own messages
      if (!user) {
        return false
      }
      if (checkRole(['super-admin'], user)) {
        return true
      }
      return {
        sender: {
          equals: user.id,
        },
      } as Where
    },
    delete: ({ req: { user } }) => {
      // Only allow users to delete their own messages
      if (!user) {
        return false
      }
      if (checkRole(['super-admin'], user)) {
        return true
      }
      return {
        sender: {
          equals: user.id,
        },
      } as Where
    },
  },
  timestamps: true,
}
