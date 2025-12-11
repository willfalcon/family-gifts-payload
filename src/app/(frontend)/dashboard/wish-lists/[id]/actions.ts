'use server'

import { getPayload, getUser } from '@/lib/server-utils'
import { Item } from '@/types/item'
import { map } from 'zod'

export async function markAsPurchased(action: 'mark' | 'unmark', itemId: Item['id']) {
  const user = await getUser()
  if (!user) {
    throw new Error('User not found')
  }
  const payload = await getPayload()

  const item = await payload.findByID({
    collection: 'item',
    id: itemId,
    depth: 2,
    overrideAccess: false,
    user,
  })
  if (!item) {
    throw new Error('Item not found')
  }

  const existingPurchasedBy =
    item.purchasedBy?.map((purchaser) =>
      typeof purchaser === 'string' ? purchaser : purchaser.id,
    ) || []

  const updatedItem = await payload.update({
    collection: 'item',
    id: itemId,
    data: {
      purchasedBy:
        action === 'mark'
          ? [...existingPurchasedBy, user.id]
          : existingPurchasedBy.filter((purchaser) => purchaser !== user.id),
    },
  })
  return updatedItem
}
