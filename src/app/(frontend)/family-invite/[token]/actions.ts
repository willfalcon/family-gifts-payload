'use server'

import { getPayload, getUser } from '@/lib/server-utils'
import { randomBytes } from 'crypto'
import { addDays } from 'date-fns'

export async function joinFamily(familyId: string) {
  const user = await getUser()

  if (!user) {
    throw new Error('You must be logged in to do this.')
  }

  const payload = await getPayload()

  // const family = await getFamily(familyId)
  const family = await payload.findByID({
    collection: 'family',
    id: familyId,
    depth: 2,
  })
  if (!family || !family.inviteLinkToken) {
    throw new Error('Family not found')
  }

  if (
    family.members?.some((member) =>
      typeof member === 'string' ? member === user?.id : member.id === user?.id,
    )
  ) {
    throw new Error('You are already a member of this family.')
  }

  if (
    family.requireApproval &&
    family.invites?.docs?.some(
      (invite) => typeof invite !== 'string' && invite.email! === user?.email,
    )
  ) {
    throw new Error(
      'You are already waiting to join this family. A family manager will need to approve your request.',
    )
  }

  await payload.create({
    collection: 'invite',
    data: {
      email: user?.email,
      family: familyId,
      user: user?.id,
      needsApproval: family.requireApproval,
      token: randomBytes(20).toString('hex'),
      tokenExpiry: addDays(new Date(), 30).toISOString(),
    },
  })

  const members = family.requireApproval
    ? family.members?.map((member) => (typeof member === 'string' ? member : member.id)) || []
    : [
        ...(family.members?.map((member) => (typeof member === 'string' ? member : member.id)) ||
          []),
        user?.id,
      ]
  //   const UPDATE_FAMILY_MUTATION = gql`
  //   mutation updateFamily($id: String!, $members: [String!], $invites: [String!]) {
  //     updateFamily(id: $id, data: { members: $members, invites: $invites }) {
  //       ${FamilyReturn}
  //     }
  //   }
  // `

  await payload.update({
    collection: 'family',
    id: familyId,
    data: {
      members,
    },
  })
}
