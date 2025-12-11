'use client'

import Link from 'next/link'
import { useState } from 'react'

import { formatCurrency, formatDate } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Event as PayloadEvent } from '@/payload-types'
import { useEvent } from '@/hooks/use-event'
import { useAuth } from '@/hooks/use-auth'
import MyAssignment from '../../components/MyAssignment'

type Props = {
  event: PayloadEvent
  isManager: boolean
}
export default function SecretSantaTab({ event: initialEvent, isManager }: Props) {
  const { data: event } = useEvent(initialEvent.id)
  const { user } = useAuth()
  const userAssignment = event?.assignments?.docs?.find(
    (assignment) =>
      assignment.giver.user?.id === user?.id || assignment.giver.email === user?.email,
  )
  const [revealed, setRevealed] = useState(false)
  return (
    <TabsContent value="secretsanta" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Secret Santa</CardTitle>
          <CardDescription>Gift exchange details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Exchange Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  {event?.secretSantaBudget && (
                    <>
                      <span className="text-muted-foreground">Budget:</span>
                      <span>{formatCurrency(event?.secretSantaBudget)}</span>
                    </>
                  )}
                </div>
                {event?.date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exchange Date:</span>
                    <span>{formatDate(event?.date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participants:</span>
                  <span>{event?.assignments?.docs?.length}</span>
                </div>
              </div>
            </div>
            <div className="@container">{event && <MyAssignment event={initialEvent} />}</div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {event?.assignments?.docs?.map((assignment) => (
                <Badge key={assignment.id} variant="outline" className="flex items-center gap-1">
                  {assignment.receiver.user?.name || assignment.receiver.email || undefined}
                  {/* <span className="text-xs text-muted-foreground ml-1">({assignment.recipient.family})</span> */}
                </Badge>
              ))}
            </div>
          </div>
          {isManager && (
            <div className="pt-4 border-t">
              <Link
                href={`/dashboard/events/${event?.id}/secret-santa`}
                className={buttonVariants()}
              >
                Manage Secret Santa
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
