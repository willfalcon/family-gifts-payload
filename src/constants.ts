import {
  PurchaseFilter,
  SortBy,
  SortDirection,
} from './app/(frontend)/dashboard/wish-lists/[id]/components/store'

export const TOOLTIP_DELAY_DURATION = 1000

export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const

export const PURCHASE_FILTERS: {
  ALL: PurchaseFilter
  PURCHASED: PurchaseFilter
  UNPURCHASED: PurchaseFilter
} = {
  ALL: 'all',
  PURCHASED: 'purchased',
  UNPURCHASED: 'unpurchased',
}

export const SORT_BY: {
  NAME: SortBy
  PRIORITY: SortBy
  PRICE: SortBy
} = {
  NAME: 'name',
  PRIORITY: 'priority',
  PRICE: 'price',
}

export const SORT_DIRECTION: {
  ASC: SortDirection
  DESC: SortDirection
} = {
  ASC: 'asc',
  DESC: 'desc',
}
