import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFamilies } from '@/hooks/use-families'
import { Controller, useFormContext } from 'react-hook-form'

export default function PrimaryFamily() {
  const { data: families, isLoading: familiesLoading } = useFamilies()
  const form = useFormContext()
  return (
    <div className="grid gap-2">
      <Controller
        control={form.control}
        name="family"
        render={({ field, fieldState }) => {
          return (
            <Field>
              <FieldLabel htmlFor="family">Primary Family (Optional)</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="family">
                  <SelectValue placeholder="Select a family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No primary family</SelectItem>
                  {families?.map((family) => (
                    <SelectItem key={family.id} value={family.id}>
                      {family.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                The family primarily associated with this event. Leave empty for individual
                gatherings.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )
        }}
      />
    </div>
  )
}
