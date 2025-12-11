'use server'

import { client } from '@/lib/payload-client'
import { Event } from '@/types/event'
import { getPayload, getUser } from '@/lib/server-utils'

export async function addManager(event: Event, userId: string) {
  const payload = await getPayload()
  const user = await getUser()

  const managers = [...event.managers.map((manager) => manager.id), userId]

  await payload.update({
    collection: 'event',
    id: event.id,
    data: {
      managers,
    },
    overrideAccess: false,
    user,
  })
}

export async function removeManager(event: Event, userId: string) {
  const payload = await getPayload()
  const user = await getUser()

  if (event.managers.length === 1) {
    throw new Error('You cannot remove the last manager from an event')
  }

  const managers = event.managers
    .filter((manager) => manager.id !== userId)
    .map((manager) => manager.id)

  await payload.update({
    collection: 'event',
    id: event.id,
    data: {
      managers,
    },
    overrideAccess: false,
    user,
  })
}
