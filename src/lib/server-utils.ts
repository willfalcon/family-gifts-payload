'use server'

import { getPayload as getPayloadLocalApi } from 'payload'
import { headers as getHeaders } from 'next/headers.js'
import config from '@/payload.config'
import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import { Family } from '@/payload-types'

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

export async function getEvents({ redirectTo }: { redirectTo?: string | undefined } = {}) {
  const user = await getUser()
  if (!user) {
    redirect(`/sign-in?redirectTo=${redirectTo || '/dashboard/events'}`)
  }
  const payload = await getPayload()

  // Get today's date at start of day (00:00:00)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const events = await payload.find({
    collection: 'event',
    where: {
      or: [
        {
          date: {
            greater_than_equal: todayISO,
          },
        },
        {
          endDate: {
            greater_than_equal: todayISO,
          },
        },
      ],
    },
    overrideAccess: false,
    user,
  })

  return events.docs
}

export const getEvent = cache(async (id: string) => {
  const user = await getUser()

  if (!user) {
    redirect(`/sign-in?redirectTo=/dashboard/events/${id}`)
  }
  const payload = await getPayload()
  try {
    const event = await payload.findByID({
      collection: 'event',
      id,
      overrideAccess: false,
      user,
    })
    return event
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      notFound()
    }
    throw error
  }
})

export async function getFamily(id: Family['id']): Promise<Family> {
  const payload = await getPayload()
  const user = await getUser()
  try {
    const family = await payload.findByID({
      collection: 'family',
      id,
      overrideAccess: false,
      user,
      depth: 2,
    })

    return family
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      notFound()
    }
    throw error
  }
}

export async function getMember(id: string) {
  const user = await getUser()
  if (!user) {
    redirect(`/sign-in?redirectTo=/dashboard/members/${id}`)
  }
  const payload = await getPayload()
  try {
    const member = await payload.findByID({
      collection: 'users',
      id,
      overrideAccess: false,
      user,
      depth: 2,
    })
    if (!member) {
      notFound()
    }
    return member
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      notFound()
    }
    throw error
  }
}

export async function getMembers() {
  const user = await getUser()
  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/members')
  }
  const payload = await getPayload()
  const members = await payload.find({
    collection: 'users',
    overrideAccess: false,
    user,
  })
  return members.docs
}

export async function getLists(id?: string) {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/wish-lists')
  }

  const payload = await getPayload()

  const queryId = id ? id : user.id
  const lists = await payload.find({
    collection: 'list',
    where: {
      user: {
        equals: queryId,
      },
    },
    overrideAccess: false,
    user,
  })
  return lists.docs
}
