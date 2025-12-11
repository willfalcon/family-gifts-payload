// import { getUser } from '@/app/actions'
// import { auth } from '@/auth'
import Title, { SubTitle } from '@/components/Title'
import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'
import NewList from './NewList'
import { getUser } from '@/lib/server-utils'

export const metadata = {
  title: 'New Wish List',
  description: 'Create a new wish list to share with your family and friends.',
}

export default async function NewWishlistPage() {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in/redirectTo=/dashboard/wish-lists/new')
  }

  const shareLinkId = randomBytes(4).toString('hex')

  return (
    <div className="container">
      <div className="mb-6">
        <Title>Create New Wish List</Title>
        <SubTitle>Add items you'd like to receive as gifts.</SubTitle>
      </div>

      <NewList user={user} shareLinkId={shareLinkId} />
    </div>
  )
}
