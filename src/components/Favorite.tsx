'use client'
import { Button } from '@/components/ui/button'
import { useFavorite, useToggleFavorite } from '@/hooks/use-favorites'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import {
  Event as PayloadEvent,
  Family as PayloadFamily,
  List as PayloadList,
} from '@/payload-types'
import { Spinner } from './ui/spinner'
import { List } from '@/types/list'

type Props = {
  event?: PayloadEvent
  family?: PayloadFamily
  list?: PayloadList | List
}

export default function Favorite({ event, family, list }: Props) {
  const { data: favorite, isLoading: isLoadingFavorite } = useFavorite({ event, family, list })
  const toggleFavorite = useToggleFavorite({ event, family, list })

  return isLoadingFavorite || favorite === undefined ? (
    <Spinner />
  ) : (
    <Button
      variant="ghost"
      onClick={() => {
        toggleFavorite.mutate(favorite)
      }}
      disabled={toggleFavorite.isPending}
      className="cursor-pointer"
    >
      {toggleFavorite.isPending || isLoadingFavorite ? (
        <Spinner />
      ) : favorite ? (
        <FaHeart className="size-4 text-red-500" />
      ) : (
        <FaRegHeart className="size-4" />
      )}
    </Button>
  )
}
