import { Access, CollectionConfig } from 'payload'
import { checkRole } from './access/checkRole'

export const Favorite: CollectionConfig = {
  slug: 'favorite',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'favorite',
      type: 'relationship',
      relationTo: ['family', 'event', 'list'],
      hasMany: false,
    },
  ],
  access: {
    create: ({ req: { user } }) => {
      if (!user) {
        return false
      }
      return true
    },
    read: ({ req: { user } }) => {
      if (checkRole(['super-admin'], user)) {
        return true
      }

      if (!user) {
        return false
      }
      return {
        user: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (checkRole(['super-admin'], user)) {
        return true
      }
      if (!user) {
        return false
      }
      return {
        user: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (checkRole(['super-admin'], user)) {
        return true
      }
      if (!user) {
        return false
      }
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
}
