import { useInfiniteQuery } from '@tanstack/react-query'
import { Calendar, ChevronDown, ChevronRight, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'

import EventCard from '@/components/EventCard'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getEvents } from '@/lib/server-utils'

export default async function EventsSection() {
  const events = await getEvents({ redirectTo: '/dashboard/events' })

  return (
    <section className="mb-10 w-full @container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>

        <Link href="/dashboard/events" className={buttonVariants({ variant: 'outline' })}>
          See All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 @lg:grid-cols-2 @3xl:grid-cols-3">
        {events.map((event) => {
          return <EventCard key={event.id} event={event} />
        })}
        {events.length === 0 && (
          <Card className="border-dashed flex flex-col items-center justify-center p-8">
            <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="font-medium text-center mb-2">Plan an Event</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create an event and invite people
            </p>

            <Link href="/dashboard/events/new" className={buttonVariants()}>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Card>
        )}
      </div>
    </section>
  )
}
