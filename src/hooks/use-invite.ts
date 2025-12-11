import { useQuery } from '@tanstack/react-query'
import { gql, graphqlRequest } from '@/lib/graphql-client'
import { Invite, InviteReturn } from '@/types/invite'
import { Invite as PayloadInvite } from '@/payload-types'

type GetInviteResponse = {
  Invite: Invite
}

export async function getInvite(inviteId: string) {
  const invite = await graphqlRequest<GetInviteResponse>(
    gql`
      query getInvite($id: String!) {
        Invite(id: $id) {
          ${InviteReturn}
        }
      }
    `,
    { id: inviteId },
  )
  return invite.Invite
}

export function useInvite(invite: string | PayloadInvite) {
  const inviteId = typeof invite === 'string' ? invite : invite.id
  return useQuery({
    queryKey: ['invite', { id: inviteId }],
    queryFn: async () => {
      return await getInvite(inviteId)
    },
  })
}
