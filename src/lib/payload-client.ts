import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from '../payload-types'

export const client = new PayloadSDK<Config>({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
})
