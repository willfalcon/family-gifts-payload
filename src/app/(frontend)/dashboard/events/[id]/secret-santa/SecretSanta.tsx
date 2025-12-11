'use client'

import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Event as PayloadEvent } from '@/payload-types'
import { useSecretSantaStore } from './store'
import { useEvent } from '@/hooks/use-event'
import Setup from './Setup'
import Participants from './Participants'
import Exclusions from './Exclusions'
import { updateSecretSanta, useSecretSantaNotification } from './functions'
import { Event } from '@/types/event'
import Review from './Review'
import GenerateError from './GenerateError'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import NotificationAlert from './NotificationAlert'

type Props = {
  event: PayloadEvent
}

export default function SecretSanta({ event: initialEvent }: Props) {
  const { data: event } = useEvent(initialEvent.id)

  const { initializeStore, budget, assignments, exclusions, participants, error, setError } =
    useSecretSantaStore()

  useEffect(() => {
    if (event) {
      initializeStore(event)
    }
  }, [event])

  const mutation = useMutation({
    mutationFn: async (event: Event) => {
      await updateSecretSanta(event, participants, assignments, exclusions, budget)
    },
    onSuccess: () => {
      toast.success('Secret Santa assignments updated successfully')
    },
    onError: () => {
      toast.error('Failed to update Secret Santa assignments')
    },
  })

  return (
    event && (
      <>
        <NotificationAlert eventId={event.id} />
        <Tabs defaultValue="setup" className={cn(mutation.isPending && 'opacity-50')}>
          <TabsList>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
            <TabsTrigger value="review">Review & Send</TabsTrigger>
          </TabsList>
          <TabsContent value="setup" className="space-y-6">
            {event && <Setup event={event} />}
          </TabsContent>
          <TabsContent value="participants" className="space-y-6">
            {event && <Participants event={event} />}
          </TabsContent>
          <TabsContent value="exclusions" className="space-y-6">
            {event && <Exclusions />}
          </TabsContent>
          <TabsContent value="review" className="space-y-6">
            {event && <Review event={event} />}
          </TabsContent>
          <GenerateError />
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={() => mutation.mutate(event)} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </>
    )
  )
}
