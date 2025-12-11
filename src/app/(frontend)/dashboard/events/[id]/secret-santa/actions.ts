'use server'

import secretSantaNotification from '@/email/secretSanta'
import { getPayload } from '@/lib/server-utils'
import { Event } from '@/types/event'
import { Invite } from '@/types/invite'
import { Resend } from 'resend'

export async function sendSecretSantaNotifications(event: Event) {
  await Promise.all(
    event.assignments.docs.map(async (assignment) => {
      const giver = assignment.giver
      const receiver = assignment.receiver
      if (!giver || !receiver) {
        return
      }
      await sendAssignmentEmail(event, giver, receiver)
    }),
  )

  const payload = await getPayload()

  const updatedEvent = await payload.update({
    collection: 'event',
    id: event.id,
    data: {
      secretSantaNotificationsSent: true,
    },
  })
  return updatedEvent
}

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendAssignmentEmail(event: Event, giver: Invite, receiver: Invite) {
  const { data, error } = await resend.emails.send({
    from: `Secret Santa <${process.env.FROM_EMAIL_ADDRESS}>`,
    to: [giver.user?.email || giver.email || ''],
    subject: `You have a secret santa assignment!`,
    react: secretSantaNotification({ receiver, event }),
  })
  if (error) {
    console.error('sendAssignmentEmail:', error)
    throw new Error(`Couldn't send email.`)
  }
  return data
}
