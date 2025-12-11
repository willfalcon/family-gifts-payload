// import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'

// import { getList } from '@/lib/queries/items'

// import WishListPage from './components/WishListPage'
import { getPayload, getUser } from '@/lib/server-utils'
import WishListPage from './components/WishListPage'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function getList(id: string) {
  const user = await getUser()
  if (!user) {
    redirect(`/sign-in?redirectTo=/dashboard/wish-lists/${id}`)
  }
  const payload = await getPayload()
  try {
    const list = await payload.findByID({
      collection: 'list',
      id,
      overrideAccess: false,
      user,
      depth: 2,
    })
    return list
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      notFound()
    }
    throw error
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const list = await getList(id)
  return {
    title: `${list?.name}`,
    description: `Manage ${list?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  }
}

export default async function page({ params }: PageProps) {
  const { id } = await params
  const list = await getList(id)

  if (!list) {
    notFound()
  }

  return (
    <div className="container">
      <WishListPage list={list} />
    </div>
  )
}
