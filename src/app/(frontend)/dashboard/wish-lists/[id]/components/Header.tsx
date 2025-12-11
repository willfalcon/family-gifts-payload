'use client'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

// import AnonymousMessageDialog from '@/components/Messages/AnonymousMessageDialog';
import { ShareButton } from '@/components/ShareButton'
import Title from '@/components/Title'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import Viewer from '@/components/ui/rich-text/viewer'

import { List } from '@/types/list'
import NewItem from './NewItem'
import ViewModeToggle from './ViewModeToggle'
import Favorite from '@/components/Favorite'
import ListFilter from './ListFilter'
import { User } from '@/types/user'

type Props = {
  list: List
  isOwner: boolean
}

export default function WishListHeader({ list, isOwner }: Props) {
  // let visibleTo: string[] = [];
  // list.visibleToFamilies.map((family) => {
  //   visibleTo.push(family.name);
  // });
  // list.visibleToEvents.map((event) => {
  //   visibleTo.push(event.name);
  // });

  const purchasers =
    !isOwner &&
    Array.from(
      new Set(
        list.items
          .filter((item) => item.purchasedBy?.length)
          .flatMap((item) => item.purchasedBy?.map((p) => p?.id)),
      ),
    )
      .map((id) => {
        const purchaser = list.items.flatMap((item) => item.purchasedBy).find((p) => p?.id === id)
        return purchaser
      })
      .filter((purchaser): purchaser is User => purchaser !== undefined)

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title>{list.name}</Title>
            <Favorite list={list} />
          </div>
          {list.description && (
            <Viewer
              content={list.description}
              className="text-muted-foreground"
              immediatelyRender={false}
            />
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">By {list.user.name}</span>
            {/* {visibleTo.map((visible) => (
              <Fragment key={visible}>
                <span className="text-muted-foreground">•</span>
                <Badge variant="outline">{visible}</Badge>
              </Fragment>
            ))} */}
          </div>
        </div>
        <div className="flex gap-2">
          {list.public && <ShareButton />}
          {/* {!isOwner && me?.id && <AnonymousMessageDialog user={me.id} dmId={list.user.id} />} */}
          {isOwner && (
            <>
              <NewItem listId={list.id} />
              <Link
                href={`/dashboard/wish-lists/${list.id}/edit`}
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </>
          )}
        </div>
        <ViewModeToggle />
        <ListFilter isOwner={isOwner} purchasers={purchasers} />
      </div>
    </div>
  )
}
