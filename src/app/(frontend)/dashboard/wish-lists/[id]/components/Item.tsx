'use client'

import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { capitalize, formatCurrency } from '@/lib/utils'
import useViewMode from '@/hooks/use-view-mode'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Viewer from '@/components/ui/rich-text/viewer'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Item } from '@/types/item'
import { useItem } from '@/hooks/use-list'
import DeleteItem from './DeleteItem'
import EditItem from './EditItem'
import Purchased from './Purchased'

type Props = {
  item: Item
  isOwner: boolean
}
export default function WishListItem({ item: initialItem, isOwner }: Props) {
  const { data: item, isLoading } = useItem(initialItem.id)

  const [viewMode] = useViewMode()

  if (isLoading || !item) {
    return <ItemSkeleton />
  }

  if (viewMode === 'compact') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors">
        {!isOwner && <Purchased item={item} />}

        {/* Item name - takes up most space */}
        <div className="min-w-0">
          <span className="font-medium truncate">{item.name}</span>
        </div>

        {/* Priority indicator - compact badge */}
        {item.priority && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={
                  item.priority === 'high'
                    ? 'destructive'
                    : item.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                }
                className="text-xs px-2 py-0 shrink-0 mr-auto"
              >
                {item.priority.charAt(0)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {item.priority === 'high'
                ? 'High Priority'
                : item.priority === 'medium'
                  ? 'Medium Priority'
                  : 'Low Priority'}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Price */}
        {item.price && (
          <span className="font-medium text-sm shrink-0 min-w-[60px] text-right">
            {formatCurrency(item.price)}
          </span>
        )}

        {/* Purchase status indicator - compact */}
        {!isOwner && item.purchasedBy && item.purchasedBy.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex -space-x-1">
              {item.purchasedBy.slice(0, 2).map((purchaser) => (
                <Avatar key={purchaser.id} className="h-5 w-5 border border-background">
                  <AvatarImage
                    src={purchaser.avatar?.url || '/placeholder.svg'}
                    alt={purchaser.name || ''}
                  />
                  <AvatarFallback className="text-xs">{purchaser.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {item.purchasedBy.length > 2 && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-background">
                  +{item.purchasedBy.length - 2}
                </div>
              )}
            </div>
          </div>
        )}

        {/* External link - compact icon button */}
        {item.link && (
          <Button variant="ghost" size="icon" className="size-7 shrink-0 mr-auto" asChild>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3" />
              <span className="sr-only">View item</span>
            </a>
          </Button>
        )}
        <div className="ml-auto">
          {/* {isOwner && <EditItem categories={categories} item={item} />} */}
          {isOwner && <EditItem item={item} />}
          {isOwner && <DeleteItem item={item} />}
        </div>
      </div>
    )
  }
  return (
    item && (
      <Card key={item.id} className="overflow-hidden mb-4">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-48 relative">
              <Image
                src={item.image?.sizes?.thumbnail?.url || 'https://placehold.co/300'}
                alt={item.name}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-xl">{item.name}</h3>
                  {item.notes && (
                    <Viewer
                      content={item.notes}
                      className="text-muted-foreground"
                      immediatelyRender={false}
                    />
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {item.price && (
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                    )}
                    {item.priority && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge
                          variant={
                            item.priority === 'high'
                              ? 'destructive'
                              : item.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {capitalize(item.priority)} Priority
                        </Badge>
                      </>
                    )}
                  </div>
                  {/* {item.categories && item.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.categories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )} */}
                </div>
                <div className="flex items-start  md:items-end gap-2">
                  {item.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Item
                      </a>
                    </Button>
                  )}
                  {!isOwner && <Purchased item={item} />}
                  {/* {isOwner && <EditItem categories={categories} item={item} />} */}
                  {isOwner && <EditItem item={item} />}
                  {isOwner && <DeleteItem item={item} />}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  )
}

function ItemSkeleton() {
  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-48 h-48 relative">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
                <Skeleton className="w-full h-4" />
              </div>
              <div className="flex items-start  md:items-end gap-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
