import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title, { SubTitle } from '@/components/Title'
import { buttonVariants } from '@/components/ui/button'
import EventsList from './components/EventsList'
import { getPayload, getUser } from '@/lib/server-utils'

export const metadata = {
  title: 'Events',
  description: 'Manage your gift-giving events',
}

export async function getEvents({ redirectTo }: { redirectTo?: string | undefined } = {}) {
  const user = await getUser()
  if (!user) {
    redirect(`/sign-in?redirectTo=${redirectTo || '/dashboard/events'}`)
  }
  const payload = await getPayload()

  // Get today's date at start of day (00:00:00)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const events = await payload.find({
    collection: 'event',
    where: {
      or: [
        {
          date: {
            greater_than_equal: todayISO,
          },
        },
        {
          endDate: {
            greater_than_equal: todayISO,
          },
        },
      ],
    },
    overrideAccess: false,
    user,
  })

  return events.docs
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Events', href: '/dashboard/events' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Events</Title>
          <SubTitle>Manage your gift-giving events</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/events/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </div>
      </div>
      <EventsList upcomingEvents={events} />
    </div>
  )
}
