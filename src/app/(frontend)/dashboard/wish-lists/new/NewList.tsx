'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getDefaults } from '@/schemas/utils'
// import { User } from '@prisma/client'
import { ListSchema, type ListSchemaType } from '@/schemas/list'
// import { createList } from './actions'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import ListForm from '../components/ListForm'
import { User } from '@/payload-types'
import { client } from '@/lib/payload-client'
import { useMutation } from '@tanstack/react-query'

export default function NewList({ user, shareLinkId }: { user: User; shareLinkId: string }) {
  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema) as any,
    defaultValues: {
      name: '',
      description: undefined,
      visibleToFamilies: [],
      visibleToUsers: [],
      categories: [],
      public: false,
      shareLink: null,
      visibilityType: 'private',
      visibibleViaLink: false,
    },
  })

  const router = useRouter()

  const mutation = useMutation({
    async mutationFn(values: ListSchemaType) {
      const response = await client.create({
        collection: 'list',
        data: {
          name: values.name,
          description: JSON.stringify(values.description),
          user: user.id,
        },
      })
      return response
    },
    onSuccess(data) {
      toast.success('List Created!')
      router.push(`/dashboard/wish-lists/${data.id}`)
    },
    onError(error) {
      toast.error('Failed to create list')
      console.error(error)
    },
  })
  async function onSubmit(values: ListSchemaType) {
    mutation.mutate(values)
  }

  return (
    <>
      <SetBreadcrumbs
        items={[
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
          { name: 'New', href: '/dashboard/wish-lists/new' },
        ]}
      />
      <ListForm form={form} onSubmit={onSubmit} submitText="Create" />
    </>
  )
}
