import { redirect } from 'next/navigation'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import EventsTab from './EventsTab/EventsTab'
import MembersTab from './MembersTab/MembersTab'
import FamilyHeader from '../components/FamilyHeader'
// import WishListsTab from './components/WishListsTab'

import { getFamily, getUser } from '@/lib/server-utils'

import InvitationsTab from './InvitationsTab/InvitationsTab'
import WishListsTab from './WishListsTab'
import EventsTab from './EventsTab/EventsTab'

type Props = { params: Promise<{ id: string }> }

export default async function FamilyPage({ params }: Props) {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { id } = await params
  const family = await getFamily(id)

  const isManager =
    family.managers?.some((manager) => {
      if (typeof manager === 'string') {
        return manager === user.id
      }
      return manager.id === user.id
    }) || false

  // TODO: add count badge for pending invitations/approvals

  return (
    <div className="container">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Families', href: '/dashboard/families' },
          { name: family.name, href: `/dashboard/families/${family.id}` },
        ]}
      />
      <FamilyHeader family={family} isManager={isManager} me={user} />

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
          {isManager && <TabsTrigger value="invitations">Invitations</TabsTrigger>}
        </TabsList>

        <MembersTab isManager={isManager} family={family} />
        <EventsTab family={family} />
        <WishListsTab family={family} />
        {isManager && <InvitationsTab family={family} />}
      </Tabs>
    </div>
  )
}

// export async function generateMetadata({ params }: Props) {
//   const { id } = await params
//   const family = await getFamily(id)
//   return {
//     title: `${family?.name}`,
//     description: `Manage ${family?.name} on Family Gifts`,
//     robots: {
//       index: false,
//     },
//   }
// }
