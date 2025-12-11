import { redirect } from 'next/navigation'

import Title, { SubTitle } from '@/components/Title'
import { getEvent } from '../page'
import { getUser } from '@/lib/server-utils'
import UpdateEvent from './UpdateEvent'
import SetBreadcrumbs from '@/components/SetBreadcrumbs'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const event = await getEvent(id)
  return {
    title: `Edit ${event?.name}`,
    description: `Edit ${event?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  }
}

export default async function EditEventPage({ params }: Props) {
  const user = await getUser()

  const { id } = await params
  const event = await getEvent(id)

  const isManager = event?.managers?.some((manager) =>
    typeof manager === 'string' ? manager === user?.id : manager.id === user?.id,
  )
  if (!isManager) {
    throw new Error('You are not authorized to edit this event')
  }

  return (
    <div>
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Events', href: '/dashboard/events' },
          { name: event?.name, href: `/dashboard/events/${event?.id}` },
          { name: 'Edit', href: `/dashboard/events/${event?.id}/edit` },
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Title>Edit Event</Title>
          <SubTitle>Update event details and participants</SubTitle>
        </div>

        <UpdateEvent event={event} />
      </div>
    </div>
  )
}
