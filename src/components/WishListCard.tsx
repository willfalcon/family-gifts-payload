'use client'

import { useQuery } from '@tanstack/react-query'
import { JSONContent } from '@tiptap/react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

// import { getList } from '@/app/actions'

// import { useMe } from '@/hooks/use-me'
// import { GetList } from '@/lib/queries/items'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { buttonVariants } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import Viewer from './ui/rich-text/viewer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { List as PayloadList } from '@/payload-types'
import { useAuth } from '@/hooks/use-auth'
import { useList } from '@/hooks/use-list'
import { List } from '@/types/list'

type Props = {
  list: PayloadList | List
  includeUser?: boolean
}

export default function WishListCard({ list: initialList, includeUser = false }: Props) {
  const { user } = useAuth()

  const { data: list, isLoading } = useList(initialList.id)

  if (isLoading || !list) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const isOwner = list.user.id === user?.id

  return (
    <Card>
      <CardHeader className="flex items-center flex-row gap-2 pb-2">
        {includeUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="shadow-inner hover:shadow-lg transition-all duration-200">
                  <AvatarImage src={list.user.avatar?.url ?? undefined} />
                  <AvatarFallback>{list.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{list.user.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex flex-col">
          <CardTitle className="text-2xl leading-none">{list.name}</CardTitle>
          <CardDescription>{list.user.name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* {list.description && (
          <p className="text-sm text-muted-foreground leading-none mb-4">{list.description}</p>
        )} */}
        {list.description && (
          <Viewer
            content={list.description as JSONContent}
            immediatelyRender={false}
            className="text-sm text-muted-foreground leading-none mb-4"
            excerpt
          />
        )}
        <div className="flex items-center justify-between text-sm">
          <span>{list.items.length} items</span>
          <span className="text-muted-foreground">
            Last updated{' '}
            {formatDistanceToNow(new Date(list.updatedAt ?? list.createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isOwner && (
          <Link
            href={`/dashboard/wish-lists/${list.id}/edit`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Edit
          </Link>
        )}
        <Link href={`/dashboard/wish-lists/${list.id}`} className={buttonVariants({ size: 'sm' })}>
          View
        </Link>
      </CardFooter>
    </Card>
  )
}
