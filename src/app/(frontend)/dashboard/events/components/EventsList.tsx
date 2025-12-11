'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, CalendarDays, ChevronRight, Gift, Plus, Search, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Event as PayloadEvent } from '@/payload-types'
import EventCard from '@/components/EventCard'

type Props = {
  upcomingEvents: PayloadEvent[]
}

export default function EventsList({ upcomingEvents }: Props) {
  // const query = useQuery({
  //   queryKey: ['events'],
  //   queryFn: () => getPastEvents(),
  // });

  const [searchTerm, setSearchTerm] = useState('')
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming"> */}
      <List events={upcomingEvents} searchTerm={searchTerm} />
      {/* </TabsContent> */}
      {/* <TabsContent value="past">{query.data && <List events={query.data} searchTerm={searchTerm} />}</TabsContent> */}
      {/* </Tabs> */}
    </>
  )
}

function List({ events, searchTerm }: { events: PayloadEvent[]; searchTerm: string }) {
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {!!filteredEvents.length &&
        filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}

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
    </div>
  )
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'gathering':
      return <Users className="h-4 w-4" />
    case 'party':
      return <CalendarDays className="h-4 w-4" />
    case 'secretSanta':
      return <Gift className="h-4 w-4" />
  }
}
