import { gql } from 'graphql-request'
import { graphqlRequest } from '@/lib/graphql-client'
import { User, UserReturn } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

const GET_USERS_QUERY = gql`
  query Users($userIds: [String!]) {
    Users(where: { id: { in: $userIds } }) {
      docs {
        ${UserReturn}
        lists(count: true) {
          totalDocs
        }
      }
    }
  }
`

const SEARCH_USERS_QUERY = gql`
  query Users($query: String!) {
    Users(where: { name: { like: $query } }) {
      docs {
        ${UserReturn}
        lists(count: true) {
          totalDocs
        }
      }
    }
  }
`

type GetUsersResponse = {
  Users: {
    docs: (User & { lists: { totalDocs: number } })[]
  }
}

type Props = {
  userIds?: string[]
  query?: string
}
export async function getUsers(props: Props) {
  const { userIds, query } = props
  if (userIds && userIds.length > 0) {
    const data = await graphqlRequest<GetUsersResponse>(GET_USERS_QUERY, {
      userIds,
    })
    return data.Users.docs || []
  } else if (query) {
    const data = await graphqlRequest<GetUsersResponse>(SEARCH_USERS_QUERY, {
      query,
    })
    return data.Users.docs || []
  } else {
    return []
  }
}

export function useUsers(props: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['users', { userIds: props.userIds || [], query: props.query || '' }],
    queryFn: () => {
      return getUsers(props)
    },
  })
  return { data, isLoading }
}
