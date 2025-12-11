import { getFamilyMembers } from '@/hooks/use-family-members'
import { gql, graphqlRequest } from '@/lib/graphql-client'
import { Family, FamilyReturn, UpdateFamilyResponse } from '@/types/family'
import { Invite, InviteReturn } from '@/types/invite'
import { randomBytes } from 'crypto'
import { addDays } from 'date-fns'

const UPDATE_FAMILY_INVITE_LINK_MUTATION = gql`
  mutation updateFamilyInviteLink($familyId: String!, $token: String!, $tokenExpiry: String!) {
    updateFamily(id: $familyId, data: { inviteLinkToken: $token, inviteLinkExpiry: $tokenExpiry }) {
      ${FamilyReturn}
    }
  }
`

export async function generateInviteLink(familyId: Family['id']) {
  const token = randomBytes(7).toString('hex')
  const tokenExpiry = addDays(new Date(), 7)

  const data = await graphqlRequest<UpdateFamilyResponse>(UPDATE_FAMILY_INVITE_LINK_MUTATION, {
    familyId,
    token,
    tokenExpiry,
  })

  return data.updateFamily
}

const UPDATE_FAMILY_PRIVACY_MUTATION = gql`
  mutation updateFamilyPrivacy($familyId: String!, $requireApproval: Boolean!) {
    updateFamily(id: $familyId, data: { requireApproval: $requireApproval }) {
      ${FamilyReturn}
    }
  }
`

export async function updateFamilyPrivacy(
  familyId: Family['id'],
  { requireApproval }: { requireApproval: boolean },
) {
  const data = await graphqlRequest<UpdateFamilyResponse>(UPDATE_FAMILY_PRIVACY_MUTATION, {
    familyId,
    requireApproval,
  })

  return data.updateFamily
}

const APPROVE_JOIN_REQUEST_MUTATION = gql`
  mutation approveJoinRequest($inviteId: String!, $familyId: String!, $members: [String!]) {
    updateInvite(id: $inviteId, data: { needsApproval: false }) {
      ${InviteReturn}
    }
    updateFamily(id: $familyId, data: { members: $members }) {
      ${FamilyReturn}
    }
  }
`

type ApproveRejectRequestProps = {
  updateInvite: Invite
  updateFamily: Family
}

export async function approveJoinRequest(invite: Invite) {
  const members = await getFamilyMembers(invite.family.id)
  const updatedMembers = [...members.map((member) => member.id), invite.user.id]
  const data = await graphqlRequest<ApproveRejectRequestProps>(APPROVE_JOIN_REQUEST_MUTATION, {
    inviteId: invite.id,
    familyId: invite.family.id,
    members: updatedMembers,
  })

  return data
}

const REJECT_JOIN_REQUEST_MUTATION = gql`
  mutation rejectJoinRequest($inviteId: String!) {
    deleteInvite(id: $inviteId) {
      id
    }
  }
`

export async function rejectJoinRequest(inviteId: Invite['id']) {
  const data = await graphqlRequest<void>(REJECT_JOIN_REQUEST_MUTATION, {
    inviteId,
  })

  return data
}
