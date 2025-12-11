import { create } from 'zustand'

import { Item } from '@/types/item'
import { PRIORITIES, PURCHASE_FILTERS, SORT_BY, SORT_DIRECTION } from '@/constants'

export type SortBy = 'name' | 'priority' | 'price'
export type PurchaseFilter = 'all' | 'purchased' | 'unpurchased'
export type SortDirection = 'asc' | 'desc'

interface ListItemsStore {
  itemStore: Item[]
  setItemStore: (itemStore: Item[]) => void
  items: Item[]
  sortAndFilter: () => void
  sortDirection: SortDirection
  setSortDirection: (sortDirection: SortDirection) => void
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  priorityFilter: Set<string>
  setPriorityFilter: (priorityFilter: Set<string>) => void
  purchaseFilter: PurchaseFilter
  setPurchaseFilter: (purchaseFilter: PurchaseFilter) => void
  purchasedByFilter: Set<string>
  setPurchasedByFilter: (filter: Set<string>) => void
  reset: () => void
}

const initialPriorityFilter = new Set<string>()
const initialPurchasedByFilter = new Set<string>()

export const useListItemsStore = create<ListItemsStore>((set, get) => ({
  itemStore: [],
  setItemStore: (itemStore: Item[]) => {
    set({ itemStore })
    get().sortAndFilter()
  },
  items: [],
  sortAndFilter: () => {
    const { itemStore, sortBy, sortDirection, priorityFilter, purchaseFilter, purchasedByFilter } =
      get()
    console.log(purchaseFilter)
    console.log(itemStore)
    const sortedAndFilteredItems = itemStore
      .filter((item) => {
        if (priorityFilter.size > 0) {
          // if (!item.priority) return false
          if (!priorityFilter.has(item.priority || '')) return false
        }
        if (purchaseFilter === PURCHASE_FILTERS.PURCHASED && !item.purchasedBy?.length) return false
        if (purchaseFilter === PURCHASE_FILTERS.UNPURCHASED && item.purchasedBy?.length)
          return false

        // Purchase status filter
        if (purchasedByFilter.size > 0) {
          const itemPurchasedBy = new Set(item.purchasedBy?.map((p) => p.id) || [])
          const hasSelectedPurchaser = Array.from(purchasedByFilter).some((id) =>
            itemPurchasedBy.has(id),
          )
          if (!hasSelectedPurchaser) return false
        }

        return true
      })
      .sort((a, b) => {
        let comparison = 0
        if (sortBy === SORT_BY.PRIORITY) {
          const priorityOrder = {
            [PRIORITIES.HIGH]: 0,
            [PRIORITIES.MEDIUM]: 1,
            [PRIORITIES.LOW]: 2,
          }
          const aPriority = a.priority as keyof typeof priorityOrder | undefined
          const bPriority = b.priority as keyof typeof priorityOrder | undefined
          const aOrder =
            aPriority !== undefined && aPriority in priorityOrder ? priorityOrder[aPriority] : 3
          const bOrder =
            bPriority !== undefined && bPriority in priorityOrder ? priorityOrder[bPriority] : 3
          comparison = aOrder - bOrder
        } else if (sortBy === SORT_BY.PRICE) {
          const priceA = Number.parseFloat((a.price || '').replace('$', ''))
          const priceB = Number.parseFloat((b.price || '').replace('$', ''))
          comparison = priceA - priceB
        } else {
          comparison = a.name.localeCompare(b.name)
        }
        return sortDirection === SORT_DIRECTION.ASC ? comparison : -comparison
      })
    set({ items: sortedAndFilteredItems })
  },
  sortDirection: SORT_DIRECTION.ASC,
  setSortDirection: (sortDirection) => {
    set({ sortDirection })
    get().sortAndFilter()
  },
  sortBy: SORT_BY.NAME,
  setSortBy: (sortBy) => {
    set({ sortBy })
    get().sortAndFilter()
  },
  priorityFilter: initialPriorityFilter,
  setPriorityFilter: (priorityFilter) => {
    set({ priorityFilter })
    get().sortAndFilter()
  },
  purchaseFilter: PURCHASE_FILTERS.ALL,
  setPurchaseFilter: (purchaseFilter) => {
    set({ purchaseFilter })
    get().sortAndFilter()
  },
  purchasedByFilter: initialPurchasedByFilter,
  setPurchasedByFilter: (purchasedByFilter) => {
    set({ purchasedByFilter })
    get().sortAndFilter()
  },
  reset: () =>
    set({
      sortBy: SORT_BY.NAME,
      priorityFilter: new Set<string>(),
      purchaseFilter: PURCHASE_FILTERS.ALL,
      purchasedByFilter: new Set<string>(),
    }),
}))
