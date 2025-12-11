import { Controller, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'

export default function TimeField({ name }: { name: string }) {
  const form = useFormContext()

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const date = field.value
          ? typeof field.value === 'string'
            ? new Date(field.value)
            : field.value
          : new Date()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12

        return (
          <Field className="flex flex-col">
            <FieldLabel htmlFor={name}>Time</FieldLabel>

            <div className="flex gap-2">
              <Select
                value={displayHours.toString()}
                onValueChange={(value) => {
                  const newDate = new Date(date)
                  const hour = parseInt(value, 10)
                  newDate.setHours(
                    period === 'PM' ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
                  )
                  field.onChange(newDate.toISOString())
                }}
              >
                <SelectTrigger className="w-[100px]" tabIndex={1}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center">:</span>
              <Select
                value={minutes.toString().padStart(2, '0')}
                onValueChange={(value) => {
                  const newDate = new Date(date)
                  newDate.setMinutes(parseInt(value, 10))
                  field.onChange(newDate.toISOString())
                }}
              >
                <SelectTrigger className="w-[100px]" tabIndex={1}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="h-52">
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={period}
                onValueChange={(value) => {
                  const newDate = new Date(date)
                  const currentHour = newDate.getHours()
                  if (value === 'PM' && currentHour < 12) {
                    newDate.setHours(currentHour + 12)
                  } else if (value === 'AM' && currentHour >= 12) {
                    newDate.setHours(currentHour - 12)
                  }
                  field.onChange(newDate.toISOString())
                }}
              >
                <SelectTrigger className="w-[100px]" tabIndex={1}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
