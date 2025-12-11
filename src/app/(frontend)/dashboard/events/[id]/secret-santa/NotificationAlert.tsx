'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon } from 'lucide-react'
import { useSecretSantaNotification } from './functions'
import { useEvent } from '@/hooks/use-event'

export default function NotificationAlert({ eventId }: { eventId: string }) {
  const notificationMutation = useSecretSantaNotification()
  const { data: event } = useEvent(eventId)
  return (
    event &&
    !event?.secretSantaNotificationsSent &&
    event?.assignments?.docs?.length > 0 && (
      <Alert className="mb-6">
        <AlertCircleIcon className="size-4" />
        <AlertTitle>Notifications not sent</AlertTitle>
        <AlertDescription>
          Assignments have been generated but notifications haven't been sent yet. Click the button
          below to send notifications.
          <div className="mt-2">
            <Button
              size="sm"
              onClick={() => notificationMutation.mutate(event)}
              disabled={notificationMutation.isPending}
            >
              Send Notifications
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  )
}
