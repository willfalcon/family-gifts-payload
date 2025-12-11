'use server'

import { Resend } from 'resend'
import { Family } from '@/types/family'
import { Invite } from '@/types/invite'
import InviteEmailTemplate from '@/email/invite'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail(invite: Invite, family: Family) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Invite <${process.env.FROM_EMAIL_ADDRESS}>`,
      to: [invite.email!],
      subject: 'Join the family',
      react: InviteEmailTemplate(invite, family),
    })
    if (error) {
      console.error('sendInviteEmail:', error)
      throw new Error(`Couldn't send email.`)
    }
    return data
  } catch (error) {
    console.error('sendInviteEmail:', error)
    throw new Error(`Something went wrong sending email.`)
  }
}
