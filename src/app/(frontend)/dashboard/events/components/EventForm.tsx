import { Loader2 } from 'lucide-react'
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'

import RichTextField from '@/components/RichTextField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { EventSchemaType } from '@/schemas/event'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import DateField from './DateField'
import TimeField from './TimeField'
import PrimaryFamily from './PrimaryFamily'
import MemberSelect from './MemberSelect'
import MorePeople from './MorePeople'
import MemberSearch from './MemberSearch'

type EventFormProps = {
  form: UseFormReturn<EventSchemaType>
  onSubmit: (data: EventSchemaType) => Promise<void>
  submitText: string
  pending?: boolean
  disabled?: boolean
}

// TODO: Add location map features

export default function EventForm({
  form,
  onSubmit,
  submitText,
  pending,
  disabled,
}: EventFormProps) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-4', (pending || disabled) && 'opacity-60 pointer-events-none')}
      >
        <Card>
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
                    <Input {...field} tabIndex={1} id="name" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
            <RichTextField name="info" disabled={disabled} label="Event Description" />
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
                    <Input {...field} tabIndex={1} id="location" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendees</CardTitle>
            <CardDescription>Select people to invite to this event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PrimaryFamily />
            <MemberSelect />
            <MorePeople />
            <MemberSearch />
          </CardContent>
        </Card>

        <Button type="submit" disabled={pending || disabled}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </form>
    </FormProvider>
  )
}
