'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ItemSchema, ItemSchemaType } from '@/schemas/item'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ItemForm from './ItemForm'
import { client } from '@/lib/payload-client'
import { Item } from '@/types/item'
import { uploadMedia, deleteMedia } from '@/lib/upload'

export default function EditItem({ item }: { item: Item }) {
  const { image, ...initialItem } = item
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (values: ItemSchemaType) => {
      const { image: newImage, ...rest } = values
      let mediaResponse = null
      if (newImage) {
        mediaResponse = await uploadMedia(newImage, item.name)
      }

      if (newImage && image) {
        await deleteMedia(typeof image === 'string' ? image : image.id)
      }

      return await client.update({
        collection: 'item',
        id: item.id,
        data: {
          ...rest,
          notes: item.notes ? JSON.parse(JSON.stringify(values.notes)) : undefined,
          image: mediaResponse?.doc.id,
        },
      })
    },
    onSuccess: (item) => {
      toast.success('Item updated!')
      queryClient.invalidateQueries({ queryKey: ['item', { id: item.id }] })
      const { image, ...rest } = item
      form.reset({
        ...rest,
        priority: item.priority as 'low' | 'medium' | 'high' | null,
        notes: item.notes ? JSON.parse(JSON.stringify(item.notes)) : undefined,
        link: item.link || undefined,
        imageUrl: typeof item.image === 'string' ? item.image : item.image?.url || undefined,
        price: item.price || undefined,
      })
      setOpen(false)
    },
    onError: (err) => {
      console.error(err)
      toast.error('Something went wrong!')
    },
  })

  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      ...initialItem,
      priority: initialItem.priority as 'low' | 'medium' | 'high' | null,
      notes: JSON.parse(JSON.stringify(initialItem.notes || {})),
      link: initialItem.link || undefined,
      imageUrl: image?.url || undefined,
    },
  })

  // console.log(form.getValues())
  const [open, setOpen] = useState(false)

  async function onSubmit(values: ItemSchemaType) {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil />
          <span className="sr-only">Edit Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-2xl h-5/6 flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <ItemForm form={form} onSubmit={onSubmit} text="Save" className="px-1" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
