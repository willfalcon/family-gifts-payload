import { useQuery } from '@tanstack/react-query'
import { gql, graphqlRequest } from '@/lib/graphql-client'
import { FamilyMember } from '@/types/family'
import { UserReturn } from '@/types/user'

const GET_FAMILY_MEMBERS_QUERY = gql`
  query getFamilyMembers($id: String!, $idJson: JSON!) {
    Family(id: $id) {
      members {
        ${UserReturn}
        lists(where: { visibleToFamilies: { in: [$idJson] } }, count: true) {
          totalDocs
        }
      }
    }
  }
`

type GetMembersResponse = {
  Family: {
    members: FamilyMember[]
  }
}

export async function getFamilyMembers(familyId: string) {
  const data = await graphqlRequest<GetMembersResponse>(GET_FAMILY_MEMBERS_QUERY, {
    id: familyId,
    idJson: familyId, // Pass the ID as JSON (GraphQL will accept string as JSON)
  })
  return data.Family.members
}

export function useFamilyMembers(familyId: string) {
  const query = useQuery({
    queryKey: ['family-members', { id: familyId }],
    queryFn: async (): Promise<FamilyMember[]> => {
      return await getFamilyMembers(familyId)
    },
  })

  return query
}
