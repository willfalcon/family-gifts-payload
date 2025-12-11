import { graphqlRequest, gql } from '@/lib/graphql-client'
import { List, ListReturn } from '@/types/list'
import { List as PayloadList } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { Item, ItemReturn } from '@/types/item'
import { getEvent } from './use-event'

type Props = {
  event: string
}

type GetListsResponse = {
  Lists: List[]
}

export async function getLists({ event: eventId }: Props) {
  if (eventId) {
    const event = await getEvent(eventId)
    const users = event.invites.docs.map((invite) => invite.user.id)
    const data = await graphqlRequest<GetListsResponse>(
      gql`
        query getLists($users: [String!]) {
          Lists(where: { user: { in: $users } }) {
            ${ListReturn}
          }
        }
      `,
      { users },
    )
    return data.Lists
  }
}

export function useLists({ event }: Props) {
  return useQuery({
    queryKey: ['lists', { event }],
    queryFn: async () => {
      return await getLists({ event })
    },
  })
}
