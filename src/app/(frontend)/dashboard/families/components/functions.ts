import { client } from '@/lib/payload-client'
import { graphqlRequest, gql } from '@/lib/graphql-client'
import { InvitesSchema, InvitesSchemaType } from '@/schemas/invite'
import { randomBytes } from 'crypto'
import { addDays } from 'date-fns'
import { User, Family as PayloadFamily } from '@/payload-types'
import { Family, FamilyReturn, UpdateFamilyResponse } from '@/types/family'
import { Invite, InviteReturn } from '@/types/invite'
import { sendInviteEmail } from '../../actions'
import { getFamilyInvites } from '@/hooks/use-family-invites'
import { getUser } from '@/hooks/use-auth'
import { getFamily } from '@/hooks/use-family'

type InviteMembersProps = {
  values: InvitesSchemaType
  family: PayloadFamily
  inviter: User
}

const CREATE_INVITE_MUTATION = gql`
  mutation createInvite($email: String!, $family: String!, $token: String!, $tokenExpiry: String!, $inviter: String!) {
    createInvite(data: { email: $email, family: $family, token: $token, tokenExpiry: $tokenExpiry, inviter: $inviter }) {
      ${InviteReturn}
    }
  }
`

const UDPATE_FAMILY_MANAGERS_MUTATION = gql`
  mutation updateFamilyManagers($familyId: String!, $managers: [String!]) {
    updateFamily(id: $familyId, data: { managers: $managers }) {
      ${FamilyReturn}
    }
  }
`

export async function inviteMembers({ values, family, inviter }: InviteMembersProps) {
  const strippedInvites = values.invites?.filter((invite) => invite.value) || []
  const validatedData = InvitesSchema.parse({ ...values, invites: strippedInvites })

  // 1. Get all the invites for the family
  const allInvites = await getFamilyInvites(family.id)

  // 2. Filter to list of invites that are being invited again
  const invitesToUpdate = allInvites.filter((invite) => {
    // if the invite already has a user attached, they don't need to be updated or invited.
    if (invite.user) return false
    return validatedData.invites?.some((i) => i.value === invite.email)
  })

  // 3. Filter to list of invites that are new
  const invitesToCreate =
    validatedData.invites?.filter((invite) => !allInvites.some((i) => i.email === invite.value)) ||
    []
  // 4. If there are no invites to create, throw an error
  if (!invitesToCreate?.length && !invitesToUpdate?.length) {
    throw new Error('All these people have already joined the family.')
  }
  // 5. Create the invites for list #2
  const createdInvites: Invite[] = await Promise.all(
    invitesToCreate.map(async (invite) => {
      return await createInvite({ email: invite.value, family, inviter })
    }),
  )
  // 6. Update existing invites with new token and expiry. If already approved, don't send an email.
  invitesToUpdate.map(async (invite) => {
    return await updateInvite({ id: invite.id })
  })

  const updatedFamily = await getFamily(family.id)

  // 7. Send the invites
  await Promise.all(
    createdInvites?.map(async (invite) => {
      await sendInviteEmail(invite, updatedFamily)
      // sendInviteNotification(invite)
    }),
  )
  await Promise.all(
    invitesToUpdate.map(async (invite) => {
      await sendInviteEmail(invite, updatedFamily)
      // sendInviteNotification(invite)
    }),
  )
}

type CreateInviteProps = {
  email: string
  family: PayloadFamily
  inviter: User
}

type CreateInviteResponse = {
  createInvite: Invite
}

const createInvite = async ({ email, family, inviter }: CreateInviteProps) => {
  const data = await graphqlRequest<CreateInviteResponse>(CREATE_INVITE_MUTATION, {
    email,
    family: family.id,
    inviter: inviter.id,
    token: randomBytes(20).toString('hex'),
    tokenExpiry: addDays(new Date(), 30).toISOString(),
  })
  return data.createInvite
}

type UpdateInviteProps = {
  id: string
}

type UpdateInviteResponse = {
  updateInvite: Invite
}

const updateInvite = async ({ id }: UpdateInviteProps) => {
  const data = await graphqlRequest<UpdateInviteResponse>(
    gql`
      mutation updateInvite($id: String!, $token: String!, $tokenExpiry: String!) {
        updateInvite(id: $id, data: { token: $token, tokenExpiry: $tokenExpiry }) {
          ${InviteReturn}
        }
      }
    `,
    {
      id,
      token: randomBytes(20).toString('hex'),
      tokenExpiry: addDays(new Date(), 30).toISOString(),
    },
  )
  return data.updateInvite
}

export async function cancelInvite(inviteId: string) {
  try {
    await client.delete({
      collection: 'invite',
      id: inviteId,
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to cancel invite')
  }
}

export async function promoteMember(family: Family, memberId: string) {
  if (family.managers.some((manager) => manager.id === memberId)) {
    throw new Error('Member is already a manager')
  }
  if (!family.members.some((member) => member.id === memberId)) {
    throw new Error('Member is not a member of the family')
  }
  const managers = [...family.managers.map((manager) => manager.id), memberId]
  const data = await graphqlRequest<UpdateFamilyResponse>(UDPATE_FAMILY_MANAGERS_MUTATION, {
    familyId: family.id,
    managers,
  })
  return data.updateFamily
}

export async function demoteMember(family: Family, memberId: string) {
  if (!family.managers.some((manager) => manager.id === memberId)) {
    throw new Error('Member is not a manager')
  }
  if (!family.members.some((member) => member.id === memberId)) {
    throw new Error('Member is not a member of the family')
  }
  const user = await getUser()

  if (memberId === user?.id) {
    throw new Error('You cannot demote yourself')
  }
  if (family.managers.length === 1) {
    throw new Error('You cannot demote the last manager from the family')
  }

  const managers = family.managers
    .filter((manager) => manager.id !== memberId)
    .map((manager) => manager.id)
  const data = await graphqlRequest<UpdateFamilyResponse>(UDPATE_FAMILY_MANAGERS_MUTATION, {
    familyId: family.id,
    managers,
  })
  return data.updateFamily
}

type RemoveMemberResponse = {
  deleteInvite: Invite
  updateFamily: Family
}

const REMOVE_MEMBER_MUTATION = gql`
  mutation removeMember($familyId: String!, $inviteId: String!, $members: [String!]) {
    deleteInvite(id: $inviteId) {
      ${InviteReturn}
    }
    updateFamily(id: $familyId, data: { members: $members }) {
      ${FamilyReturn}
    }

  }
`
export async function removeMember(family: Family, memberId: string) {
  const members = family.members
    .filter((member) => member.id !== memberId)
    .map((member) => member.id)
  const invite = family.invites.docs.find((invite) => invite.user?.id === memberId)
  const data = await graphqlRequest<UpdateFamilyResponse>(REMOVE_MEMBER_MUTATION, {
    familyId: family.id,
    inviteId: invite?.id,
    members,
  })
  return data.updateFamily
}
