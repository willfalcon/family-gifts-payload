// import { auth } from '@/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// import { getUserLists } from '@/lib/queries/lists'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title, { SubTitle } from '@/components/Title'
import { buttonVariants } from '@/components/ui/button'
import { getPayload, getUser } from '@/lib/server-utils'
import WishLists from './WishLists'

export const metadata = {
  title: 'Wish Lists',
}

export async function getLists(id?: string) {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/wish-lists')
  }

  const payload = await getPayload()

  const queryId = id ? id : user.id
  const lists = await payload.find({
    collection: 'list',
    where: {
      user: {
        equals: queryId,
      },
    },
    overrideAccess: false,
    user,
  })
  return lists.docs
}

export default async function WishListsPage() {
  const lists = await getLists()

  return (
    <div className="container">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Wish Lists</Title>
          <SubTitle>Manage your wish lists and view lists shared with you.</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/wish-lists/new" className={buttonVariants({ variant: 'outline' })}>
            Create List
          </Link>
        </div>
      </div>
      <WishLists lists={lists || []} />
    </div>
  )
}
