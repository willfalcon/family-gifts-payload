'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import { EventSchema, EventSchemaType } from '@/schemas/event'

import EventForm from '../../components/EventForm'
import { useAuth } from '@/hooks/use-auth'
import { updateEvent } from './functions'
import { Event as PayloadEvent } from '@/payload-types'
import { useEvent } from '@/hooks/use-event'
import { useEffect } from 'react'

export default function UpdateEvent({ event: initialEvent }: { event: PayloadEvent }) {
  const { data: event, isLoading: eventLoading } = useEvent(initialEvent.id)

  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: '',
      date: undefined,
      time: undefined,
      endDate: undefined,
      endTime: undefined,
      location: '',
      info: undefined,
      family: initialEvent.family
        ? typeof initialEvent.family === 'string'
          ? initialEvent.family
          : initialEvent.family.id
        : undefined,
      attendees: [],
      externalInvites: [],
    },
  })

  useEffect(() => {
    if (event) {
      const attendees = event.invites.docs
        .filter((invite) => invite.user)
        .map((invite) => invite.user.id)
      const externalInvites = event.invites.docs
        .filter((invite) => !invite.user)
        .map((invite) => invite.email)

      form.reset({
        name: event.name,
        date: event.date ?? undefined,
        time: event.time ?? undefined,
        endDate: event.endDate ?? undefined,
        endTime: event.endTime ?? undefined,
        location: event.location ?? '',
        info: event.info,
        attendees: attendees ?? [],
        externalInvites: externalInvites ?? [],
      })
    }
  }, [event])
  console.log(form.formState.errors)
  // console.log(form.formState.errors)
  const { user } = useAuth()

  const router = useRouter()

  const mutation = useMutation({
    async mutationFn(data: EventSchemaType) {
      // console.log(data)
      return await updateEvent(initialEvent, data)
    },
    onSuccess(data) {
      console.log(data)
      toast.success(`${data.name} updated!`)
      router.push(`/dashboard/events/${data.id}`)
    },
    onError(error) {
      console.error(error)
      toast.error(error.message)
    },
  })

  async function onSubmit(values: EventSchemaType) {
    console.log(values)
    await mutation.mutate(values)
  }

  return (
    <EventForm
      form={form}
      onSubmit={onSubmit}
      submitText="Update Event"
      pending={mutation.isPending}
      disabled={mutation.isPending || eventLoading}
    />
  )
}
