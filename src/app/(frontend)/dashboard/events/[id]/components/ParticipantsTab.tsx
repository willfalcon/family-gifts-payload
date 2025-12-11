'use client'
// import { auth } from '@/auth';

// import { EventFromGetEvent } from '@/lib/queries/events';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'

import { Event as PayloadEvent } from '@/payload-types'
import { useEvent } from '@/hooks/use-event'
import Participant from './Participant'

type Props = {
  event: PayloadEvent
  isManager: boolean
}

export default function ParticipantsTab({ event: initialEvent, isManager }: Props) {
  // const session = await auth();
  // const isManager = event.managers.some((manager) => manager.id === session?.user?.id);
  const { data: event } = useEvent(initialEvent.id)

  return (
    <TabsContent value="participants" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>People invited to this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event?.invites?.docs?.map((invite) => {
              return (
                <Participant key={invite.id} event={event} invite={invite} isManager={isManager} />
              )
            })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
