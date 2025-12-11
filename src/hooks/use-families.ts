import { graphqlRequest, gql } from '@/lib/graphql-client'
import { Family, FamilyReturn } from '@/types/family'
import { useQuery } from '@tanstack/react-query'

type GetFamiliesResponse = {
  Families: {
    docs: Family[]
  }
}

const GET_FAMILIES_QUERY = gql`
  query getFamilies {
    Families {
      docs {
        ${FamilyReturn}
      }
    }
  }
`
export async function getFamilies() {
  const data = await graphqlRequest<GetFamiliesResponse>(GET_FAMILIES_QUERY)
  return data.Families.docs || []
}

export function useFamilies() {
  const query = useQuery({
    queryKey: ['families'],
    queryFn: () => {
      return getFamilies()
    },
  })
  return query
}
