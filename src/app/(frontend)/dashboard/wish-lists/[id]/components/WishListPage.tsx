'use client'

import { List } from '@/payload-types'
import { useList } from '@/hooks/use-list'
import { useAuth } from '@/hooks/use-auth'
import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import WishListHeader from './Header'
import WishListItem from './Item'
import { useListItemsStore } from './store'
import { useEffect } from 'react'

type Props = {
  list: List
}

export default function WishListPage({ list: initialList }: Props) {
  const { user } = useAuth()
  const { data: list } = useList(initialList.id)
  const items = useListItemsStore((s) => s.items)
  const setItemStore = useListItemsStore((s) => s.setItemStore)
  const isOwner = list?.user.id === user?.id
  useEffect(() => {
    if (list?.items) {
      setItemStore(list.items)
    }
  }, [list?.items, setItemStore])
  /**
   * TODO: add sorting and filtering
   *
   * Sort by priority
   * Filter by purchased
   * Filter by not purchased
   * Filter by name (search?)
   * Filter by link
   * Filter by purchasedBy
   */

  const setBreadcrumbs = useBreadcrumbs()
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Wish Lists', href: '/dashboard/wish-lists' },
    { name: list?.name || '', href: `/dashboard/wish-lists/${list?.id}` },
  ])
  return (
    list && (
      <div className="container mx-auto px-4 py-8">
        <WishListHeader list={list} isOwner={isOwner} />

        {items?.map((item) => (
          <WishListItem key={item.id} item={item} isOwner={isOwner} />
        ))}
      </div>
    )
  )
}
