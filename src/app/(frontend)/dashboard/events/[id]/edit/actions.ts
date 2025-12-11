'use server'

import { getPayload, getUser } from '@/lib/server-utils'
import { EventSchemaType } from '@/schemas/event'
import { Event as PayloadEvent } from '@/payload-types'
import { getEvent } from '@/hooks/use-event'
import { createInvitesFromAttendees } from '../../new/actions'

export async function updateEvent(initialEvent: PayloadEvent, data: EventSchemaType) {
  const payload = await getPayload()
  const user = await getUser()

  const event = await getEvent(initialEvent.id)

  const { attendees, externalInvites, family, ...rest } = data

  const updatedEvent = await payload.update({
    collection: 'event',
    id: event.id,
    data: {
      ...rest,
      info: JSON.parse(JSON.stringify(data.info || {})),
    },
    overrideAccess: false,
    user,
  })

  const newAttendees = data.attendees.filter(
    (attendee) => !event.invites.docs.some((invite) => invite.user?.id === attendee),
  )

  await createInvitesFromAttendees(newAttendees, updatedEvent)

  return updatedEvent
}
