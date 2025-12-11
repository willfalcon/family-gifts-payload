import { redirect } from 'next/navigation'

import Title, { SubTitle } from '@/components/Title'
import { getUser } from '@/lib/server-utils'
import NewEvent from './NewEvent'

export const metadata = {
  title: 'New Event',
  description: 'Create a new gift-giving event',
}

export default async function NewEventPage() {
  const user = await getUser()
  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/events/new')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Title>Create New Event</Title>
        <SubTitle>Set up a new gift-giving occasion</SubTitle>
      </div>

      <NewEvent />
    </div>
  )
}
