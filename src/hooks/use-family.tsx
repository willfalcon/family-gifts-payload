import { useQuery } from '@tanstack/react-query'
import { graphqlRequest, gql } from '@/lib/graphql-client'
import { Family, FamilyReturn } from '@/types/family'

type GetFamilyResponse = {
  Family: Family
}

export async function getFamily(familyId: string) {
  const data = await graphqlRequest<GetFamilyResponse>(
    gql`
          query getFamily($id: String!) {
            Family(id: $id) {
              ${FamilyReturn}
            }
          }
        `,
    {
      id: familyId,
    },
  )
  return data.Family
}

export function useFamily(familyId: string) {
  const query = useQuery({
    queryKey: ['family', { id: familyId }],
    queryFn: async (): Promise<Family> => {
      return await getFamily(familyId)
    },
  })

  return query
}
