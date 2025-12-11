import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      {
        name: 'medium',
        width: 300,
        height: 300,
        position: 'center',
      },
      {
        name: 'thumbnail',
        width: 32,
        height: 32,
        position: 'center',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
