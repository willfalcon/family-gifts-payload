import { graphqlRequest, gql } from '@/lib/graphql-client'
import { Favorite, FavoriteReturn } from '@/types/favorites'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import {
  Family as PayloadFamily,
  List as PayloadList,
  Event as PayloadEvent,
} from '@/payload-types'
import { getEvent } from './use-event'
import { getList } from './use-list'
import { getFamily } from './use-family'
import { List } from '@/types/list'

const DELETE_FAVORITE_MUTATION = gql`
  mutation deleteFavorite($id: String!) {
    deleteFavorite(id: $id) {
      id
    }
  }
`

const ADD_FAVORITE_MUTATION = gql`
  mutation addFavorite(
    $id: JSON!
    $userId: String!
    $relationTo: Favorite_FavoriteRelationshipInputRelationTo!
  ) {
    createFavorite(data: { user: $userId, favorite: { relationTo: $relationTo, value: $id } }) {
      id
    }
  }
`

export async function toggleFavorite(favorite: string | null, props: Props, userId: string) {
  if (!userId) {
    throw new Error('User not found')
  }
  const id = props.event?.id || props.family?.id || props.list?.id
  if (favorite) {
    await graphqlRequest(DELETE_FAVORITE_MUTATION, { id: favorite })
  } else {
    // Determine the relation type based on which prop is present
    let relationTo: 'event' | 'family' | 'list'
    if (props.event) {
      relationTo = 'event'
    } else if (props.family) {
      relationTo = 'family'
    } else if (props.list) {
      relationTo = 'list'
    } else {
      throw new Error('No event, family, or list provided')
    }
    await graphqlRequest(ADD_FAVORITE_MUTATION, { id, userId, relationTo })
  }
}

export function useToggleFavorite(props: Props) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (favorite: string | null) => toggleFavorite(favorite, props, user?.id ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'favorite',
          {
            id: props.event?.id || props.family?.id || props.list?.id,
          },
        ],
      })
    },
  })
}

type Props = { event?: PayloadEvent; family?: PayloadFamily; list?: PayloadList | List }

export async function getFavorite({ event, family, list }: Props) {
  if (event) {
    const eventRes = await getEvent(event.id)
    console.log(eventRes)
    return eventRes.favorite.docs.length ? eventRes.favorite.docs[0].id : null
  }
  if (family) {
    const familyRes = await getFamily(family.id)
    return familyRes.favorite.docs.length ? familyRes.favorite.docs[0].id : null
  }
  if (list) {
    const listRes = await getList(list.id)
    return listRes.favorite.docs.length ? listRes.favorite.docs[0].id : null
  }
  return null
}

export function useFavorite(props: Props) {
  return useQuery({
    queryKey: [
      'favorite',
      {
        id: props.event?.id || props.family?.id || props.list?.id,
      },
    ],
    queryFn: () => getFavorite(props),
  })
}

const GET_FAVORITES_QUERY = gql`
  query getFavorites {
    Favorites {
      docs {
        ${FavoriteReturn}
      }
    }
  }
`
type GetFavoritesResponse = {
  Favorites: {
    docs: Favorite[]
  }
}
async function getFavorites() {
  const response = await graphqlRequest<GetFavoritesResponse>(GET_FAVORITES_QUERY)
  return response.Favorites.docs
}
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => await getFavorites(),
  })
}
