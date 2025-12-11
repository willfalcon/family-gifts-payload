import { useQuery } from '@tanstack/react-query'
import { gql, graphqlRequest } from '@/lib/graphql-client'
import { List, ListReturn } from '@/types/list'

const GET_USER_LISTS_QUERY = gql`
  query getUserLists($id: String!) {
    User(id: $id) {
      lists(count: true) {
        totalDocs
        docs {
          ${ListReturn}
        }
      }
    }
  }
`

type GetUserListsResponse = {
  User: {
    lists: {
      totalDocs: number
      docs: List[]
    }
  }
}

export async function getUserLists(userId: string) {
  const data = await graphqlRequest<GetUserListsResponse>(GET_USER_LISTS_QUERY, {
    id: userId,
  })
  return data.User.lists
}

export function useUserLists(userId: string) {
  const query = useQuery({
    queryKey: ['user-lists', { id: userId }],
    queryFn: async (): Promise<{ totalDocs: number; docs: List[] }> => {
      return await getUserLists(userId)
    },
  })

  return query
}
