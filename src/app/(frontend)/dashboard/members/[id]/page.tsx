import { notFound, redirect } from 'next/navigation'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import { SubTitle } from '@/components/Title'
import WishListCard from '@/components/WishListCard'
// import { GetList } from '@/lib/queries/items'
// import { getListsByMember } from '@/lib/queries/lists'
// import { getMember } from '@/lib/queries/members'
import MemberHeader from './MemberHeader'
import { getPayload, getUser } from '@/lib/server-utils'
import { getLists } from '../../wish-lists/page'
import WishLists from '../../wish-lists/WishLists'

type Props = { params: Promise<{ id: string }> }

export async function getMember(id: string) {
  const user = await getUser()
  if (!user) {
    redirect(`/sign-in?redirectTo=/dashboard/members/${id}`)
  }
  const payload = await getPayload()
  try {
    const member = await payload.findByID({
      collection: 'users',
      id,
      overrideAccess: false,
      user,
      depth: 2,
    })
    if (!member) {
      notFound()
    }
    return member
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      notFound()
    }
    throw error
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const member = await getMember(id)
  return {
    title: `${member?.name}`,
    description: `Manage ${member?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  }
}
export default async function MemberPage({ params }: Props) {
  const { id } = await params
  const member = await getMember(id)
  const lists = await getLists(member.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Members', href: '/dashboard/members' },
          ...(member.name ? [{ name: member.name, href: `/dashboard/members/${member.id}` }] : []),
        ]}
      />
      <MemberHeader member={member} />

      {/* <div>
        <SubTitle>Wish Lists</SubTitle>
        <div className="flex flex-wrap gap-2">
          {lists.map((list) => (
            <WishListCard key={list.id} list={list} />
          ))}
        </div>
      </div> */}
      <WishLists lists={lists} />
    </div>
  )
}
