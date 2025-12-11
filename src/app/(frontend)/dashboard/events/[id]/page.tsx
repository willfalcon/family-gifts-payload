import { notFound, redirect } from 'next/navigation'

// import FloatingMessages from '@/components/Messages/FloatingMessages'
// import MessagesSidebar from '@/components/Messages/MessagesSidebar'
import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cache } from 'react'
import { User } from '@/payload-types'
import { getPayload, getUser } from '@/lib/server-utils'
import EventHeader from './components/EventHeader'
import DetailsTab from './components/DetailsTab'
import ParticipantsTab from './components/ParticipantsTab'
import WishListsTab from '../components/WishListsTab'
import EventAttendance from '../components/EventAttendance'
import SetupSecretSanta from '../components/SetupSecretSanta'
import MyAssignment from '../components/MyAssignment'
import SecretSantaTab from './components/SecretSantaTab'
import NotificationAlert from './secret-santa/NotificationAlert'

// import MyAssignment from './components/MyAssignment'
// import SecretSantaTab from './components/SecretSantaTab'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export const getEvent = cache(async (id: string) => {
  const user = await getUser()

  if (!user) {
    redirect(`/sign-in?redirectTo=/dashboard/events/${id}`)
  }
  const payload = await getPayload()
  try {
    const event = await payload.findByID({
      collection: 'event',
      id,
      overrideAccess: false,
      user,
    })
    return event
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not Found')) {
      notFound()
    }
    throw error
  }
})

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const event = await getEvent(id)
  return {
    title: `${event?.name}`,
    description: `Manage ${event?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  }
}
export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEvent(id)
  const user = await getUser()

  const isManager =
    event.managers?.some((manager) =>
      typeof manager === 'string' ? manager === user?.id : manager.id === user?.id,
    ) || false

  const invite = event.invites?.docs?.find((invite) =>
    typeof invite === 'string'
      ? invite === user?.id
      : typeof invite.user === 'string'
        ? invite.user === user?.id
        : invite.user?.id === user?.id,
  )

  // if (!invite && !isManager) {
  //   redirect('/dashboard/events')
  // }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="space-y-4 p-8 pt-6 relative w-full">
        <SetBreadcrumbs
          items={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Events', href: '/dashboard/events' },
            { name: event.name, href: `/dashboard/events/${event.id}` },
          ]}
        />

        <EventHeader event={event} isManager={isManager} />
        <NotificationAlert eventId={event.id} />
        {invite && <EventAttendance invite={invite} />}
        <MyAssignment event={event} />
        {isManager && event.assignments?.docs?.length === 0 && (
          <SetupSecretSanta eventId={event.id} />
        )}
        <Tabs defaultValue="details" className="space-y-6">
          <div className="max-w-full overflow-x-auto">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
              {(!!event.assignments?.docs?.length || isManager) && (
                <TabsTrigger value="secretsanta">Secret Santa</TabsTrigger>
              )}
            </TabsList>
          </div>
          <DetailsTab event={event} />
          <ParticipantsTab event={event} isManager={isManager} />
          <WishListsTab event={event} />
          {(!!event.assignments?.docs?.length || isManager) && (
            <SecretSantaTab event={event} isManager={isManager} />
          )}
        </Tabs>

        {/* <FloatingMessages /> */}
      </div>
      {/* <MessagesSidebar eventId={id} session={session} /> */}
    </SidebarProvider>
  )
}
