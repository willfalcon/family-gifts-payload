import { useQuery } from '@tanstack/react-query'
import { Invite, InviteReturn } from '@/types/invite'
import { gql, graphqlRequest } from '@/lib/graphql-client'

type GetInvitesResponse = {
  Family: {
    invites: {
      docs: Invite[]
    }
  }
}

const GET_FAMILY_INVITES_QUERY = gql`
  query getFamilyInvites($id: String!) {
    Family(id: $id) {
      invites {
        docs {
          ${InviteReturn}
        }
      }
    }
  }
`

export async function getFamilyInvites(familyId: string) {
  const data = await graphqlRequest<GetInvitesResponse>(GET_FAMILY_INVITES_QUERY, {
    id: familyId,
  })
  return data.Family.invites.docs
}

export function useFamilyInvites(familyId: string) {
  const query = useQuery({
    queryKey: ['family-invites', { id: familyId }],
    queryFn: async (): Promise<Invite[]> => {
      return await getFamilyInvites(familyId)
    },
  })

  return query
}
