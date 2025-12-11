import { CollectionConfig } from 'payload'
import { checkRole } from './access/checkRole'
import type { Where } from 'payload'
import { listOwner } from './access/listOwner'

export const List: CollectionConfig = {
  slug: 'list',
  indexes: [
    {
      fields: ['user'],
    },
    {
      fields: ['public'],
    },
    // Note: visibleToFamilies and visibleToUsers are hasMany relationships
    // stored in junction tables, so they can't be indexed on the main table.
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'json',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'item',
      hasMany: true,
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'visibleToFamilies',
      type: 'relationship',
      relationTo: 'family',
      hasMany: true,
    },
    {
      name: 'visibleToUsers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'shareLink',
      type: 'text',
      required: false,
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

      // Super admins can read all lists
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Query lists that are visible to families where the user is a member
      // First, find all families where the user is a member
      const userFamilies = await payload.find({
        collection: 'family',
        where: {
          members: {
            contains: user.id,
          },
        },
        limit: 1000,
      })

      const userFamilyIds = userFamilies.docs.map((f) => f.id)

      // Then find lists that are visible to any of those families
      // Only query if the user is a member of at least one family
      const visibleListIds =
        userFamilyIds.length > 0
          ? (
              await payload.find({
                collection: 'list',
                where: {
                  visibleToFamilies: {
                    in: userFamilyIds,
                  },
                },
                limit: 1000,
              })
            ).docs.map((l) => l.id)
          : []

      // Regular users can only read lists if the list is their list, the list is public,
      // or if the list is visible to a family they're a member of
      const whereClause: Where = {
        or: [
          {
            user: {
              equals: user.id,
            },
          },
          {
            public: {
              equals: true,
            },
          },
          ...(visibleListIds.length > 0
            ? [
                {
                  id: {
                    in: visibleListIds,
                  },
                },
              ]
            : []),
          {
            visibleToUsers: {
              contains: user.id,
            },
          },
        ],
      } as Where

      return whereClause
    },
    update: listOwner,
    delete: listOwner,
  },
}
