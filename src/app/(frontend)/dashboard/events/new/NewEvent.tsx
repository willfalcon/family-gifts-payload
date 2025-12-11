'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import { EventSchema, EventSchemaType } from '@/schemas/event'

import EventForm from '../components/EventForm'
import { useAuth } from '@/hooks/use-auth'
import { createEvent } from './actions'

export default function NewEvent() {
  const setBreadcrumbs = useBreadcrumbs()
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Events', href: '/dashboard/events' },
    { name: 'New Event', href: '/dashboard/events/new' },
  ])
  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: '',
      date: undefined,
      time: undefined,
      endDate: undefined,
      endTime: undefined,
      location: '',
      info: {},
      family: undefined,
      attendees: [],
      externalInvites: [],
    },
  })

  console.log(form.formState.errors)
  // console.log(form.formState.errors)
  const { user } = useAuth()

  const router = useRouter()

  const mutation = useMutation({
    async mutationFn(data: EventSchemaType) {
      console.log(data)
      return await createEvent(data)
    },
    onSuccess(data) {
      console.log(data)
      toast.success(`${data.name} created!`)
      router.push(`/dashboard/events/${data.id}`)
    },
  })

  async function onSubmit(values: EventSchemaType) {
    await mutation.mutate(values)
  }

  return (
    <EventForm
      form={form}
      onSubmit={onSubmit}
      submitText="Create Event"
      pending={mutation.isPending}
    />
  )
}
