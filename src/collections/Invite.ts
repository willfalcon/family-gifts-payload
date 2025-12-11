import { CollectionConfig } from 'payload'
import { checkRole } from './access/checkRole'

export const Invite: CollectionConfig = {
  slug: 'invite',
  indexes: [
    {
      fields: ['user'],
    },
    {
      fields: ['event'],
    },
    {
      fields: ['family'],
    },
    {
      fields: ['token'],
    },
    // Composite index for common access control queries
    {
      fields: ['user', 'event'],
    },
  ],
  fields: [
    {
      name: 'email',
      type: 'email',
      required: false,
    },
    {
      name: 'token',
      type: 'text',
      required: true,
    },
    {
      name: 'tokenExpiry',
      type: 'date',
      required: true,
    },
    {
      name: 'eventResponse',
      type: 'select',
      options: [
        {
          label: 'Declined',
          value: 'declined',
        },
        {
          label: 'Maybe',
          value: 'maybe',
        },
        {
          label: 'Accepted',
          value: 'accepted',
        },
      ],
    },
    {
      name: 'needsApproval',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'approvalRejected',
      type: 'checkbox',
      defaultValue: false,
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'inviter',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
