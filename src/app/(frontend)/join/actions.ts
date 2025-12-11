'use server'

import { getPayload, getUser } from '@/lib/server-utils'
import { Family, Invite } from '@/payload-types'

export async function joinFamily(invite: Invite) {
  const user = await getUser()

  if (!user) {
    throw new Error('You must be logged in to do this.')
  }
  if (user.email !== invite.email) {
    throw new Error('You are not the invitee.')
  }
  if (invite.tokenExpiry && new Date(invite.tokenExpiry) < new Date()) {
    throw new Error('This invite has expired. Ask the family manager to send you a new one.')
  }
  if (!invite.family) {
    throw new Error(`FamilyId not attached to invite.`)
  }

  const payload = await getPayload()
  try {
    const family = invite.family as Family
    await payload.update({
      collection: 'family',
      id: (invite.family as Family).id,
      data: {
        members: [...(family.members || []), user?.id],
      },
    })

    if (!invite.user) {
      await payload.update({
        collection: 'invite',
        id: invite.id,
        data: {
          user: user?.id,
        },
      })
    }

    return {
      user,
      family,
      event: null,
    }

    // if (updatedUser) {
    //   // Add the user to the family channel
    //   const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

    //   await client.mutation(api.channels.addChannelUser, {
    //     family: invite.familyId,
    //     user: updatedUser.id!,
    //   })

    //   // Delete the invite
    //   await prisma.invite.delete({
    //     where: {
    //       id: invite.id,
    //     },
    //   })

    //   return { familyId: invite.familyId, userName: updatedUser.name }
    // }
  } catch (err) {
    console.error(err)
    throw new Error('Something went wrong. 🤷‍♂️')
  }
}
