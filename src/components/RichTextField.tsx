import { Controller, FieldPath, useFormContext, UseFormReturn } from 'react-hook-form'

import Editor from './ui/rich-text/editor'
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field'
import { fieldAffectsData } from 'payload/shared'

type Props<T extends Record<string, any>> = {
  name: FieldPath<T>
  label?: string
  description?: string
  className?: string
  form?: UseFormReturn<T>
  disabled?: boolean
}

export default function RichTextField<T extends Record<string, any>>({
  name,
  label,
  description,
  className,
  form: passedForm,
  disabled = false,
}: Props<T>) {
  const form = useFormContext<T>()
  const formToUse = passedForm || form

  if (!formToUse) {
    throw new Error('RichTextField must be used within a FormProvider or passed the form prop')
  }

  return (
    <Controller
      name={name}
      control={formToUse.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label ?? name}</FieldLabel>
          {!disabled && (
            <Editor content={field.value} onChange={field.onChange} immediatelyRender={false} />
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError />
        </Field>
      )}
    />
  )
}
