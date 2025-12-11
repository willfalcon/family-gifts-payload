'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import { FamilySchema, FamilySchemaType } from '@/schemas/family'

import FamilyForm from '../FamilyForm'
import { client } from '@/lib/payload-client'
import { User } from '@/payload-types'

export default function NewFamily({ user }: { user: User }) {
  const form = useForm<FamilySchemaType>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: '',
      description: [],
    },
  })

  const router = useRouter()

  const mutation = useMutation({
    async mutationFn(values: FamilySchemaType) {
      const response = await client.create({
        collection: 'family',
        data: {
          name: values.name,
          description: JSON.stringify(values.description),
          members: [user.id],
          createdBy: user.id,
          managers: [user.id],
        },
      })
      return response
    },
    onSuccess(data) {
      toast.success(`${data.name} created!`)
      router.push(`/dashboard/families/${data.id}`)
    },
    onError(error) {
      toast.error('Failed to create family')
      console.error(error)
    },
  })

  function onSubmit(values: FamilySchemaType) {
    mutation.mutate(values)
  }

  const setBreadcrumbs = useBreadcrumbs()
  setBreadcrumbs([
    { name: 'Families', href: '/dashboard/families' },
    { name: 'New', href: '/dashboard/families/new' },
  ])

  return (
    <FamilyForm
      form={form}
      onSubmit={onSubmit}
      submitText="Create Family"
      pending={mutation.isPending}
    />
  )
}
