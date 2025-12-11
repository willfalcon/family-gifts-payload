import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'

import { ListSchemaType } from '@/schemas/list'

import RichTextField from '@/components/RichTextField'
import SubmitButton from '@/components/SubmitButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
// import CategoriesField from './CategoriesField';
import Visibility from './Visibility'

type ListFormProps = {
  form: UseFormReturn<ListSchemaType>
  onSubmit: (data: ListSchemaType) => Promise<void>
  submitText: string
  shareLinkId?: string | null
}

// TODO: Visibility setting not being applied, no events in list.

export default function ListForm({ form, onSubmit, submitText, shareLinkId }: ListFormProps) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup>
          <Card>
            <CardHeader>
              <CardTitle>List Details</CardTitle>
              <CardDescription>Provide basic information about the list.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        tabIndex={1}
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <RichTextField form={form} name="description" />
            </CardContent>
          </Card>

          <Visibility />

          {/* <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Create categories to organize your items.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesField />
          </CardContent>
        </Card> */}
          <SubmitButton>{submitText}</SubmitButton>
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
