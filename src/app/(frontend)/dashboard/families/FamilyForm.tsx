import { Loader2 } from 'lucide-react'
import { Controller, UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { FamilySchemaType } from '@/schemas/family'

import RichTextField from '@/components/RichTextField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

type FamilyFormProps = {
  form: UseFormReturn<FamilySchemaType>
  onSubmit: (data: FamilySchemaType) => void
  submitText: string
  pending: boolean
}

export default function FamilyForm({ form, onSubmit, submitText, pending }: FamilyFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Details</CardTitle>
      </CardHeader>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(pending && 'opacity-60 pointer-events-none')}
      >
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="family-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="family-name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <FieldDescription>
                    This is the name that will be displayed to members.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <RichTextField
              form={form}
              name="description"
              description="Provide a short description to help members understand the purpose of this family group."
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} tabIndex={1}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitText}
              </>
            ) : (
              submitText
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
