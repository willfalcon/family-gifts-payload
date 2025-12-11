import { gql, graphqlRequest } from '@/lib/graphql-client'
import { Invite, InviteReturn } from '@/types/invite'

type UpdateInviteResponse = {
  updateInvite: Invite
}

export async function updateInviteResponse(id: string, response: Invite['eventResponse']) {
  const invite = await graphqlRequest<UpdateInviteResponse>(
    gql`
      mutation updateInvite($id: String!, $response: InviteUpdate_eventResponse_MutationInput!) {
        updateInvite(id: $id, data: { eventResponse: $response }) {
          ${InviteReturn}
        }
      }
    `,
    { id, response },
  )
  return invite.updateInvite
}
