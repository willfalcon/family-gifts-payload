// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Family } from './collections/Family'
import { Event } from './collections/Event'
import { Invite } from './collections/Invite'
import { List } from './collections/List'
import { Item } from './collections/Item'
import { Assignment } from './collections/Assignment'
import { Exclusion } from './collections/Exclusion'
import { Favorite } from './collections/Favorite'
import { Message } from './collections/Message'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Family, Event, Invite, List, Item, Assignment, Exclusion, Favorite, Message],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    idType: 'uuid',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  email: resendAdapter({
    defaultFromAddress: 'noreply@family-gifts.hawks.house',
    defaultFromName: 'Family Gifts',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
