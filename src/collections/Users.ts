import type { CollectionConfig, FieldAccess } from 'payload'
import { admins } from './access/admins'
import { adminsAndUser } from './access/adminsAndUser'
import { relatedUsers } from './access/relatedUsers'
import { anyone } from './access/anyone'
import { checkRole } from './access/checkRole'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { protectRoles } from './hooks/protectRoles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  // access: {
  //   read: relatedUsers,
  //   create: anyone,
  //   update: adminsAndUser,
  //   delete: adminsAndUser,
  //   unlock: admins,
  //   admin: ({ req: { user } }) => checkRole(['admin', 'super-admin'], user),
  // },
  hooks: {
    // afterChange: [loginAfterCreate],
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'birthday',
      type: 'date',
    },
    {
      name: 'bio',
      type: 'json',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      // access: {
      //   read: admins,
      //   update: admins,
      //   create: admins,
      // },
      hooks: {
        // beforeChange: [protectRoles],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
      ],
      defaultValue: ['user'],
    },
    {
      name: 'families',
      type: 'join',
      collection: 'family',
      on: 'members',
    },
    {
      name: 'lists',
      type: 'join',
      collection: 'list',
      on: 'user',
    },
    {
      name: 'invites',
      type: 'join',
      collection: 'invite',
      on: 'user',
    },
  ],
}
