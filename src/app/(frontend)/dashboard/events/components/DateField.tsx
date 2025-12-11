import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'

export default function DateField({ name }: { name: string }) {
  const form = useFormContext()
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <Field className="flex flex-col">
            <FieldLabel htmlFor={name} className="block">
              Date
            </FieldLabel>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'flex w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                    tabIndex={1}
                  >
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-68 p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString() : undefined)
                    }}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
