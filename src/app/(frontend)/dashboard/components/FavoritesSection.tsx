'use client'

import EventCard from '@/components/EventCard'
import FamilyCard from '@/components/FamilyCard'
import WishListCard from '@/components/WishListCard'
import { useFavorites } from '@/hooks/use-favorites'
import { Event } from '@/types/event'
import { Family } from '@/types/family'
import { List } from '@/types/list'

export default function FavoritesSection() {
  const { data: favorites, isLoading } = useFavorites()

  if (isLoading || !favorites) {
    return null
  }

  return (
    <section className="mb-10 @container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Favorites</h2>
      </div>
      <div className="grid @lg:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {favorites.map((favorite) => {
          if (favorite.favorite.relationTo === 'family') {
            return <FamilyCard key={favorite.id} family={favorite.favorite.value as Family} />
          }
          if (favorite.favorite.relationTo === 'event') {
            return <EventCard key={favorite.id} event={favorite.favorite.value as Event} />
          }
          if (favorite.favorite.relationTo === 'list') {
            return <WishListCard key={favorite.id} list={favorite.favorite.value as List} />
          }
        })}
      </div>
    </section>
  )
}
