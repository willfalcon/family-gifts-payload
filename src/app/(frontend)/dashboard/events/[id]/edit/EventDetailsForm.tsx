import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

// import { updateEventDetails } from '@/app/dashboard/events/actions';
// import { EventDetailsSchema, type EventDetailsSchemaType } from '@/app/dashboard/events/eventSchema';
// import { EventFromGetEvent } from '@/lib/queries/events';
import { cn } from '@/lib/utils'

import RichTextField from '@/components/RichTextField'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EventDetailsSchema, EventDetailsSchemaType } from '@/schemas/event'
import { Event } from '@/types/event'
import { client } from '@/lib/payload-client'
import DateField from '../../components/DateField'
import TimeField from '../../components/TimeField'
import { FormProvider } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFamilies } from '@/hooks/use-families'

type Props = {
  event: Event
}
export default function EventDetailsForm({ event }: Props) {
  const form = useForm<EventDetailsSchemaType>({
    resolver: zodResolver(EventDetailsSchema),
    defaultValues: {
      name: event.name,
      date: event.date ?? undefined,
      time: event.time ?? undefined,
      location: event.location ?? '',
      info: JSON.parse(JSON.stringify(event.info || {})),
      family: event.family?.id ?? undefined,
    },
  })
  const { mutate, isPending } = useMutation({
    async mutationFn(data: EventDetailsSchemaType) {
      return await client.update({
        collection: 'event',
        id: event.id,
        data: {
          ...data,
          info: JSON.parse(JSON.stringify(data.info || {})),
        },
      })
    },
    onSuccess(data) {
      console.log(data)
      toast.success(`${data.name} updated!`)
    },
  })

  async function onSubmit(values: EventDetailsSchemaType) {
    await mutate(values)
  }

  const { data: families, isLoading: familiesLoading } = useFamilies()

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-4', isPending && 'opacity-60 pointer-events-none')}
      >
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Basic information about your event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="name">Event Name</FieldLabel>
                    <Input {...field} id="name" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
            <Controller
              control={form.control}
              name="family"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="familyId">Family</FieldLabel>
                    <Select {...field} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a family" />
                      </SelectTrigger>
                      <SelectContent>
                        {familiesLoading ? (
                          <SelectItem value="none">Loading...</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="none">None</SelectItem>
                            {families?.map((family) => (
                              <SelectItem key={family.id} value={family.id}>
                                {family.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
            <RichTextField name="info" />
            <div className="grid grid-cols-2 gap-4">
              <DateField name="date" />
              <TimeField name="time" />
            </div>
            <Controller
              control={form.control}
              name="location"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input {...field} id="location" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Details
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
