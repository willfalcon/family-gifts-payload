import { TabsContent } from '@/components/ui/tabs'
import { Event as PayloadEvent } from '@/payload-types'
import WishListCard from '@/components/WishListCard'
import { getPayload } from '@/lib/server-utils'

type Props = {
  event: PayloadEvent
}

export default async function WishListsTab({ event: initialEvent }: Props) {
  const users =
    initialEvent.invites?.docs?.map((invite) => {
      if (typeof invite !== 'string') {
        if (invite.user && typeof invite.user !== 'string') {
          return invite.user.id
        }
        return invite.user
      }
      return null
    }) || []

  const payload = await getPayload()

  const lists = await payload.find({
    collection: 'list',
    where: {
      user: {
        in: users,
      },
    },
  })

  return (
    <TabsContent value="wishlists" className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.docs.map((list) => (
          <WishListCard key={list.id} list={list} />
        ))}
      </div>
    </TabsContent>
  )
}
