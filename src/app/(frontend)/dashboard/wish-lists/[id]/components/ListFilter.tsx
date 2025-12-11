import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useListItemsStore } from './store'
import { PRIORITIES, PURCHASE_FILTERS, SORT_BY, SORT_DIRECTION } from '@/constants'
import { User } from '@/types/user'

export default function ListFilter({
  isOwner,
  purchasers,
}: {
  isOwner: boolean
  purchasers: User[] | false
}) {
  const {
    sortBy,
    setSortBy,
    priorityFilter,
    setPriorityFilter,
    purchaseFilter,
    setPurchaseFilter,
    sortDirection,
    setSortDirection,
    purchasedByFilter,
    setPurchasedByFilter,
  } = useListItemsStore()
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <SlidersHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <div className="flex items-center gap-2">
          <DropdownMenuCheckboxItem
            checked={sortBy === SORT_BY.NAME}
            onCheckedChange={() => setSortBy(SORT_BY.NAME)}
            onSelect={(e) => e.preventDefault()}
            className="grow"
          >
            Name (A-Z)
          </DropdownMenuCheckboxItem>
          {sortBy === SORT_BY.NAME && (
            <Button
              onClick={() =>
                setSortDirection(
                  sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
                )
              }
              variant="ghost"
              size="icon"
              title={
                sortDirection === SORT_DIRECTION.ASC ? 'Reverse sort order' : 'Normal sort order'
              }
            >
              {sortDirection === SORT_DIRECTION.ASC ? '↑' : '↓'}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenuCheckboxItem
            checked={sortBy === SORT_BY.PRIORITY}
            onCheckedChange={() => setSortBy(SORT_BY.PRIORITY)}
            onSelect={(e) => e.preventDefault()}
            className="grow"
          >
            Priority (High to Low)
          </DropdownMenuCheckboxItem>
          {sortBy === SORT_BY.PRIORITY && (
            <Button
              onClick={() =>
                setSortDirection(
                  sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
                )
              }
              variant="ghost"
              size="icon"
              title={
                sortDirection === SORT_DIRECTION.ASC ? 'Reverse sort order' : 'Normal sort order'
              }
            >
              {sortDirection === SORT_DIRECTION.ASC ? '↑' : '↓'}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenuCheckboxItem
            checked={sortBy === SORT_BY.PRICE}
            onCheckedChange={() => setSortBy(SORT_BY.PRICE)}
            onSelect={(e) => e.preventDefault()}
            className="grow"
          >
            Price (Low to High)
          </DropdownMenuCheckboxItem>
          {sortBy === SORT_BY.PRICE && (
            <Button
              onClick={() =>
                setSortDirection(
                  sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
                )
              }
              variant="ghost"
              size="icon"
              title={
                sortDirection === SORT_DIRECTION.ASC ? 'Reverse sort order' : 'Normal sort order'
              }
            >
              {sortDirection === SORT_DIRECTION.ASC ? '↑' : '↓'}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {/* Priority Filter Section */}
        <DropdownMenuLabel>Priority</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={priorityFilter.has(PRIORITIES.HIGH)}
          onCheckedChange={(checked) => {
            const newFilter = new Set(priorityFilter)
            if (checked) {
              newFilter.add(PRIORITIES.HIGH)
            } else {
              newFilter.delete(PRIORITIES.HIGH)
            }
            setPriorityFilter(newFilter)
          }}
          onSelect={(e) => e.preventDefault()}
        >
          High Priority
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priorityFilter.has(PRIORITIES.MEDIUM)}
          onCheckedChange={(checked) => {
            const newFilter = new Set(priorityFilter)
            if (checked) {
              newFilter.add(PRIORITIES.MEDIUM)
            } else {
              newFilter.delete(PRIORITIES.MEDIUM)
            }
            setPriorityFilter(newFilter)
          }}
          onSelect={(e) => e.preventDefault()}
        >
          Medium Priority
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priorityFilter.has(PRIORITIES.LOW)}
          onCheckedChange={(checked) => {
            const newFilter = new Set(priorityFilter)
            if (checked) {
              newFilter.add(PRIORITIES.LOW)
            } else {
              newFilter.delete(PRIORITIES.LOW)
            }
            setPriorityFilter(newFilter)
          }}
          onSelect={(e) => e.preventDefault()}
        >
          Low Priority
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        {!isOwner && (
          <>
            <DropdownMenuLabel>Purchase Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={purchaseFilter === PURCHASE_FILTERS.ALL}
              onCheckedChange={() => setPurchaseFilter(PURCHASE_FILTERS.ALL)}
              onSelect={(e) => e.preventDefault()}
            >
              All Items
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={purchaseFilter === PURCHASE_FILTERS.PURCHASED}
              onCheckedChange={() => setPurchaseFilter(PURCHASE_FILTERS.PURCHASED)}
              onSelect={(e) => e.preventDefault()}
            >
              Purchased
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={purchaseFilter === PURCHASE_FILTERS.UNPURCHASED}
              onCheckedChange={() => setPurchaseFilter(PURCHASE_FILTERS.UNPURCHASED)}
              onSelect={(e) => e.preventDefault()}
            >
              Not Purchased
            </DropdownMenuCheckboxItem>
          </>
        )}
        {purchasers && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Purchased By</DropdownMenuLabel>
            {purchasers.map((purchaser) => (
              <DropdownMenuCheckboxItem
                key={purchaser.id}
                checked={purchasedByFilter.has(purchaser.id)}
                onCheckedChange={(checked) => {
                  const newFilter = new Set(purchasedByFilter)
                  if (checked) {
                    newFilter.add(purchaser.id)
                  } else {
                    newFilter.delete(purchaser.id)
                  }
                  setPurchasedByFilter(newFilter)
                }}
                onSelect={(e) => e.preventDefault()}
              >
                {purchaser.name}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
