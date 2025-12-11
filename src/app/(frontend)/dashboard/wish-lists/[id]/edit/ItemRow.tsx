'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { capitalize, cn, formatCurrency } from '@/lib/utils'
// import { Item } from '@prisma/client';
// import { getItemToEdit, updateItem } from './actions';

import CurrencyField from '@/components/CurrencyField'
// import ImageField from '@/components/ImageField'
import { RadioTabs, RadioTabsItem } from '@/components/RadioTabs'
import RichTextField from '@/components/RichTextField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
// import CategoryField from '../components/CategoryField';
import DeleteItem from '../components/DeleteItem'
import { ItemSchema, ItemSchemaType } from '@/schemas/item'
import { getItem, useItem } from '@/hooks/use-list'
import { client } from '@/lib/payload-client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Item } from '@/types/item'

type Props = {
  item: Item
}

export default function ItemRow({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: '',
      link: undefined,
      price: undefined,
      priority: null,
      // categories: [],
      notes: '',
      imageUrl: undefined,
    },
  })

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        link: item.link || undefined,
        price: item.price,
        priority: item.priority as 'low' | 'medium' | 'high' | null,
        notes: item.notes,
        // imageUrl: item.image || undefined,
      })
    }
  }, [item, form])

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: ItemSchemaType) => {
      const { image, ...rest } = values
      let imageUrl = null
      if (image) {
        imageUrl = await fetch(`/api/uploadImage?name=${image.name}`, {
          method: 'POST',
          body: image,
        })
          .then((res) => res.text())
          .catch((err) => {
            console.error(err)
            return null
          })
      }
      return client.update({
        collection: 'item',
        id: item?.id as string,
        data: {
          ...rest,
          notes: JSON.parse(JSON.stringify(values.notes || {})),
          // ...(imageUrl ? { imageUrl } : {}),
        },
      })
    },
    onSuccess: (item) => {
      queryClient.setQueryData(['item', item.id], item)
      toast.success('Item updated')
    },
    onError: (error) => {
      console.log(error)
      toast.error('Failed to update item')
    },
  })

  function onSubmit(data: ItemSchemaType) {
    mutation.mutate(data)
  }

  const pending = mutation.isPending

  return (
    <div className="border rounded-md">
      {/* Collapsed view - summary row */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="grid grid-cols-12 gap-4 p-3 items-center">
          <CollapsibleTrigger className="col-span-4 sm:col-span-9 grid grid-cols-9 gap-4 items-center">
            <div className="col-span-5 font-medium truncate justify-self-start">
              {item?.name || 'Unnamed Item'}
            </div>
            {item?.price && (
              <div className="col-span-2 sm:col-span-2 text-right">
                {formatCurrency(item?.price) || '-'}
              </div>
            )}
            <div className="col-span-3 sm:col-span-2 justify-self-start">
              {item?.priority && (
                <Badge
                  variant={
                    item?.priority === 'high'
                      ? 'destructive'
                      : item.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {capitalize(item.priority)}
                </Badge>
              )}
            </div>
          </CollapsibleTrigger>
          <div className="col-span-3 flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse item details' : 'Expand item details'}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {item && <DeleteItem item={item} />}
          </div>
        </div>
        <CollapsibleContent>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn('p-4 border-t', pending && 'opacity-50')}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => {
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor="name">Item Name</FieldLabel>
                        <Input {...field} />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )
                  }}
                />
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field, fieldState }) => {
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor="price">Price (Optional)</FieldLabel>
                        <CurrencyField field={field} />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="md:grid gap-4 md:grid-cols-3 my-4">
                <div className="col-span-1">
                  {/* <ImageField name="image" label="Image" previewField="imageUrl" /> */}
                </div>
                <div className="md:col-span-2">
                  <RichTextField form={form} name="notes" />
                </div>
              </div>
              {/* <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid gap-2 mt-4">
                    <FormLabel>Notes</FormLabel>
                    <Editor content={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="grid gap-4 sm:grid-cols-3 my-4">
                <Controller
                  control={form.control}
                  name="link"
                  render={({ field, fieldState }) => {
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor="link">Link</FieldLabel>
                        <Input {...field} value={field.value ?? ''} />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )
                  }}
                />
                <Controller
                  control={form.control}
                  name="priority"
                  render={({ field, fieldState }) => {
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor="priority">Priority</FieldLabel>
                        <RadioTabs onValueChange={field.onChange} value={field.value || undefined}>
                          <RadioTabsItem
                            value="low"
                            className="data-[state=checked]:text-green-700 data-[state=checked]:border-green-200 hover:text-green-700 flex-1 data-[state=checked]:bg-green-50 dark:data-[state=checked]:bg-green-950/30"
                          />
                          <RadioTabsItem
                            value="medium"
                            className="data-[state=checked]:text-amber-700 data-[state=checked]:border-amber-200 hover:text-amber-700 flex-1 data-[state=checked]:bg-amber-50 dark:data-[state=checked]:bg-amber-950/30"
                          />
                          <RadioTabsItem
                            value="high"
                            className="data-[state=checked]:text-rose-700 data-[state=checked]:border-rose-200 hover:text-rose-700 flex-1 data-[state=checked]:bg-rose-50 dark:data-[state=checked]:bg-rose-950/30"
                          />
                        </RadioTabs>
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )
                  }}
                />
                {/* <Controller
                  control={form.control}
                  name="categories"
                  render={({ field, fieldState }) => {
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor="categories">Categories</FieldLabel>
                        <CategoriesField categories={categories} value={field.value} />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )
                  }}
                /> */}
              </div>
              <Button type="submit" disabled={pending}>
                {pending ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </FormProvider>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
