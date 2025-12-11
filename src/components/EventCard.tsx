import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Event as PayloadEvent } from '@/payload-types'
import type { Event } from '@/types/event'
import Link from 'next/link'

type Props = {
  event: PayloadEvent | Event
}

export default function EventCard({ event }: Props) {
  return (
    <Card key={event.id} className="flex flex-col">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {/* {!!event.assignments.length && (
                <Badge className="mb-2" variant="outline">
                  Secret Santa
                </Badge>
              )} */}
        {event.date && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {formatDate(event.date)}
          </div>
        )}
        {/* <p className="mt-2 text-sm text-muted-foreground">{event._count.visibleLists} wish lists associated</p> */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
          href={`/dashboard/events/${event.id}`}
        >
          View Details
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
