'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// import { updateList } from '@/app/dashboard/wish-lists/actions';
import { ListSchema, type ListSchemaType } from '@/schemas/list'
// import { type GetListForEdit } from '@/lib/queries/items';

import ListForm from '../../components/ListForm'
import { List } from '@/types/list'
import { client } from '@/lib/payload-client'
import { List as PayloadList } from '@/payload-types'
import { useList } from '@/hooks/use-list'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function EditList({ list: initialList }: { list: PayloadList }) {
  const { data: list } = useList(initialList.id)
  return list ? <EditListInner list={list} /> : null
}

function EditListInner({ list }: { list: List }) {
  const defaultVisibilityType = list.public
    ? 'public'
    : list.visibleToFamilies?.length > 0 || list.visibleToUsers?.length > 0
      ? 'specific'
      : 'private'

  const form = useForm({
    resolver: zodResolver(ListSchema),
    defaultValues: {
      name: list.name,
      description: JSON.parse(JSON.stringify(list?.description || {})),
      visibleToFamilies: list.visibleToFamilies.map((item) => item.id),
      visibleToUsers: list.visibleToUsers.map((item) => item.id),
      // visibleToEvents: list.visibleTo
      //   .map((item) => ({
      //     relationTo: 'event' as const,
      //     value: item.value.id,
      //   })),
      public: false,
      shareLink: null,
      categories: [],
      visibilityType: defaultVisibilityType,
      visibibleViaLink: false,
    },
  })

  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (values: ListSchemaType) => {
      const publicValue = values.visibilityType === 'public'
      const privateValue = values.visibilityType === 'private'
      await client.update({
        collection: 'list',
        id: list.id,
        data: {
          ...values,
          description: JSON.stringify(values.description || {}),
          public: publicValue,
          visibleToFamilies: privateValue ? [] : values.visibleToFamilies,
          visibleToUsers: privateValue ? [] : values.visibleToUsers,
        },
      })
    },
    onSuccess: () => {
      toast.success('List updated')
      queryClient.invalidateQueries({ queryKey: ['list', { id: list.id }] })
      router.push(`/dashboard/wish-lists/${list.id}`)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong')
    },
  })

  async function onSubmit(values: ListSchemaType) {
    mutation.mutate(values)
  }

  return <ListForm form={form} onSubmit={onSubmit} submitText="Save" />
}
