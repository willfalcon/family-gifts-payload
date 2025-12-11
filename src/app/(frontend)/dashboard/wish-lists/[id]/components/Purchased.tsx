'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Info } from 'lucide-react'
// import { useSession } from 'next-auth/react';

// import { ItemFromGetList } from '@/lib/queries/items';
// import { getPurchasedBy, markAsPurchased } from '../actions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useViewMode from '@/hooks/use-view-mode'
import { Item } from '@/types/item'
import { useAuth } from '@/hooks/use-auth'
import { markAsPurchased } from '../actions'

type Props = {
  item: Item
}

export default function Purchased({ item }: Props) {
  const { user } = useAuth()
  const [viewMode] = useViewMode()

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ action, itemId }: { action: 'mark' | 'unmark'; itemId: string }) =>
      markAsPurchased(action, itemId),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(['item', { id: item.id }], updatedItem)
    },
  })

  const currentUserPurchased = item.purchasedBy?.some((purchaser) => purchaser.id === user?.id)
  const otherPurchasers = item.purchasedBy?.filter((purchaser) => purchaser.id !== user?.id)

  if (mutation.isPending) {
    return <Skeleton className="h-6 w-[150px]" />
  }

  return viewMode === 'compact' ? (
    <Checkbox
      checked={currentUserPurchased}
      onCheckedChange={(checked) => {
        if (checked) {
          mutation.mutate({ action: 'mark', itemId: item.id })
        } else {
          mutation.mutate({ action: 'unmark', itemId: item.id })
        }
      }}
      className="shrink-0"
    />
  ) : (
    <div className="flex flex-col gap-2 w-full md:w-auto md:items-end">
      {/* Purchase status indicator */}
      {!!item.purchasedBy?.length && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <div className="flex -space-x-2">
            {item.purchasedBy.slice(0, 3).map((purchaser) => (
              <Avatar key={purchaser.id} className="size-6 border-2 border-background">
                {/* <AvatarImage src={purchaser.image || undefined} alt={purchaser.name || ''} /> */}
                <AvatarFallback>{purchaser.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {item.purchasedBy.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{item.purchasedBy.length - 3}
              </div>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6 rounded-full p-0">
                <Info className="size-4" />
                <span className="sr-only">View purchasers</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-2">
                <h4 className="font-medium">Purchased by:</h4>
                <div className="space-y-1">
                  {item.purchasedBy.map((purchaser) => (
                    <div key={purchaser.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          {/* <AvatarImage src={purchaser.image || undefined} alt={purchaser.name || undefined} /> */}
                          <AvatarFallback>{purchaser.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{purchaser.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {item.purchasedBy.length > 1 && (
                  <div className="pt-2 border-t text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="size-4" />
                    <span>Multiple people have purchased this item</span>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Purchase checkbox */}
      {mutation.isPending ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`purchased-${item.id}`}
            checked={item.purchasedBy?.some((purchaser) => purchaser.id === user?.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                mutation.mutate({ action: 'mark', itemId: item.id })
              } else {
                mutation.mutate({ action: 'unmark', itemId: item.id })
              }
            }}
          />
          <label
            htmlFor={`purchased-${item.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {currentUserPurchased
              ? 'Marked as purchased by you'
              : item.purchasedBy?.length
                ? 'I also purchased this'
                : 'Mark as purchased'}
          </label>
        </div>
      )}

      {/* Warning if others have purchased */}
      {!currentUserPurchased && otherPurchasers && otherPurchasers.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>
                  Already purchased by {otherPurchasers.length}{' '}
                  {otherPurchasers.length === 1 ? 'person' : 'people'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Someone else has already purchased this item. You may want to coordinate with them.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
