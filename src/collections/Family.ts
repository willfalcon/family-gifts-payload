import { Access, CollectionConfig } from 'payload'
import { checkRole } from './access/checkRole'

const familyManagers: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  if (checkRole(['super-admin'], user)) {
    return true
  }
  return {
    managers: {
      contains: user.id,
    },
  }
}

export const Family: CollectionConfig = {
  slug: 'family',
  indexes: [
    // Note: members and managers are hasMany relationships stored in junction tables,
    // so they can't be indexed on the main table. Only single relationships can be indexed.
    {
      fields: ['createdBy'],
    },
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
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'allowInvites',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'managers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'invites',
      type: 'join',
      collection: 'invite',
      on: 'family',
      hasMany: true,
    },
    {
      name: 'inviteLinkToken',
      type: 'text',
    },
    {
      name: 'inviteLinkExpiry',
      type: 'date',
    },
    {
      name: 'requireApproval',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'events',
      type: 'join',
      collection: 'event',
      on: 'family',
      hasMany: true,
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
    read: ({ req: { user } }) => {
      // If no user is logged in, deny access
      if (!user) {
        return false
      }

      // Super admins can read all families
      if (checkRole(['super-admin'], user)) {
        return true
      }

      // Regular users can only read families where they are in the members array
      return {
        members: {
          contains: user.id,
        },
      }
    },
    update: familyManagers,
    delete: familyManagers,
  },
}
