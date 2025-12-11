import { CollectionConfig } from 'payload'

export const Item: CollectionConfig = {
  slug: 'item',
  indexes: [
    // Note: list is a join field (virtual, not a database column), so it can't be indexed
    {
      fields: ['priority'],
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'list',
      type: 'join',
      collection: 'list',
      on: 'items',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      required: false,
    },
    {
      name: 'notes',
      type: 'json',
      required: false,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
      ],
    },
    {
      name: 'price',
      type: 'text',
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'purchasedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: false,
    },
  ],
}
