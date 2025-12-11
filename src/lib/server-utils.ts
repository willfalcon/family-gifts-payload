'use server'

import { getPayload as getPayloadLocalApi } from 'payload'
import { headers as getHeaders } from 'next/headers.js'
import config from '@/payload.config'
import { cache } from 'react'

// Cache the payload instance per request
export const getPayload = cache(async () => {
  const payloadConfig = await config
  const payload = await getPayloadLocalApi({ config: payloadConfig })
  return payload
})

export const getUser = cache(async () => {
  const headers = await getHeaders()
  const payload = await getPayload()
  const { user } = await payload.auth({ headers })
  return user
})
