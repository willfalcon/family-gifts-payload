import { Form, UseFormReturn, Controller, FormProvider } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { ItemSchemaType } from '@/schemas/item'

// import CurrencyField from '@/components/CurrencyField'
// import ImageField from '@/components/ImageField'
import RichTextField from '@/components/RichTextField'
import SubmitButton from '@/components/SubmitButton'

import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { RadioTabs, RadioTabsItem } from '@/components/RadioTabs'
import ImageField from '@/components/ImageField'

type ItemFormProps = {
  form: UseFormReturn<ItemSchemaType>
  onSubmit: (data: ItemSchemaType) => Promise<void>
  text: string
  // categories: string[]
  className?: string
}

export default function ItemForm({
  form,
  onSubmit,
  text,
  // categories,
  className = '',
}: ItemFormProps) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className, 'space-y-4')}>
        <FieldGroup>
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
                    autoComplete="off"
                    tabIndex={1}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel htmlFor="priority">Priority</FieldLabel>
                  <RadioTabs onValueChange={field.onChange} value={field.value || undefined}>
                    <RadioTabsItem
                      value="low"
                      className="data-[state=checked]:text-green-700 data-[state=checked]:border-green-200 hover:text-green-700 flex-1 data-[state=checked]:bg-green-50 dark:data-[state=checked]:bg-green-950/30"
                    >
                      Low
                    </RadioTabsItem>
                    <RadioTabsItem
                      value="medium"
                      className="data-[state=checked]:text-amber-700 data-[state=checked]:border-amber-200 hover:text-amber-700 flex-1 data-[state=checked]:bg-amber-50 dark:data-[state=checked]:bg-amber-950/30"
                    >
                      Medium
                    </RadioTabsItem>
                    <RadioTabsItem
                      value="high"
                      className="data-[state=checked]:text-rose-700 data-[state=checked]:border-rose-200 hover:text-rose-700 flex-1 data-[state=checked]:bg-rose-50 dark:data-[state=checked]:bg-rose-950/30"
                    >
                      High
                    </RadioTabsItem>
                  </RadioTabs>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />

          <Controller
            name="link"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel htmlFor="link">Link</FieldLabel>
                  <Input
                    {...field}
                    id="link"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    tabIndex={1}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />

          <ImageField
            name="image"
            label="Image"
            description="Image of the item. Amazon images are automatically detected."
            previewField="imageUrl"
            tabIndex={1}
          />

          {/* <FormField
          control={form.control}
          name="price"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <CurrencyField field={field} tabIndex={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        /> */}
          <RichTextField name="notes" form={form} />
        </FieldGroup>
        <SubmitButton>{text}</SubmitButton>
      </form>
    </FormProvider>
  )
}
