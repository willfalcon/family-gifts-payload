'use server'

import { getPayload, getUser } from '@/lib/server-utils'
import { EventSchemaType } from '@/schemas/event'
import { randomBytes } from 'crypto'
import { addDays } from 'date-fns'
import { Event as PayloadEvent } from '@/payload-types'

export async function createInvitesFromAttendees(attendees: string[], event: PayloadEvent) {
  if (!event || !event.id) {
    throw new Error('Event not found')
  }

  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const payload = await getPayload()

  const invites = await Promise.all(
    attendees.map(async (attendee) => {
      const attendeeUser = await payload.findByID({
        collection: 'users',
        id: attendee,
      })

      if (!attendeeUser || !attendeeUser.email) {
        throw new Error(`User ${attendee} not found or has no email`)
      }

      return await payload.create({
        collection: 'invite',
        data: {
          email: attendeeUser.email,
          user: attendee,
          event: event.id,
          token: randomBytes(20).toString('hex'),
          tokenExpiry: addDays(new Date(), 30).toISOString(),
          inviter: user.id,
        },
      })
    }),
  )

  return invites
}

export async function createEvent(data: EventSchemaType) {
  console.log(data)

  const payload = await getPayload()
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const event = await payload.create({
    collection: 'event',
    data: {
      name: data.name,
      date: data.date,
      time: data.time,
      endDate: data.endDate,
      endTime: data.endTime,
      location: data.location,
      info: JSON.parse(JSON.stringify(data.info || {})),
      creator: user.id,
      family: data.family || undefined,
      managers: [user.id],
    },
  })

  await createInvitesFromAttendees(data.attendees, event)

  return event

  // const invite = await payload.create({
  //   collection: 'invite',
  //   data: {
  //     email: user.email,
  //     token: crypto.randomUUID(),
  //     tokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  //     user: user.id,
  //     eventResponse: 'accepted',
  //   },
  // })
  // return await payload.create({
  //   collection: 'event',
  //   data: {
  //     ...data,
  //     info: JSON.parse(JSON.stringify(data.info || {})),
  //     creator: user.id,
  //     managers: [user.id],
  //     attendees: [user.id],
  //     invites: [invite.id],
  //   },
  //   // time: typeof data.time === 'string' ? new Date(data.time) : data.time,
  // })
}
