'use client'

import { zodResolver } from '@hookform/resolvers/zod'
// import { User } from '@prisma/client';
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

// import { updateProfile } from '../actions';
import { ProfileSchema, ProfileSchemaType } from '@/schemas/profile'

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import ImageField from '@/components/ImageField'
import RichTextField from '@/components/RichTextField'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EnhancedDatePicker } from '@/components/EnhancedDatePicker'
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field'
import { User as PayloadUser } from '@/payload-types'
import { useMutation } from '@tanstack/react-query'
import { deleteMedia, uploadMedia } from '@/lib/upload'
import { client } from '@/lib/payload-client'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

interface ProfileFormProps {
  user: PayloadUser
}

export default function ProfileSettings({ user }: ProfileFormProps) {
  const { avatar, ...initialUser } = user
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: initialUser.name || '',
      email: initialUser.email || '',
      birthday: initialUser.birthday ? new Date(initialUser.birthday) : undefined,
      bio: initialUser.bio ? JSON.parse(JSON.stringify(initialUser.bio)) : undefined,
      imageUrl: avatar
        ? typeof avatar === 'string'
          ? avatar
          : avatar.url || undefined
        : undefined,
    },
  })
  const mutation = useMutation({
    mutationFn: async (values: ProfileSchemaType) => {
      const { image: newImage, ...rest } = values
      let mediaResponse = null
      if (newImage) {
        mediaResponse = await uploadMedia(newImage, initialUser.name || '')
      }

      if (newImage && avatar) {
        await deleteMedia(typeof avatar === 'string' ? avatar : avatar.id)
      }

      return await client.update({
        collection: 'users',
        id: user.id,
        data: {
          ...rest,
          birthday: rest.birthday?.toISOString() || undefined,
          bio: rest.bio ? JSON.parse(JSON.stringify(rest.bio)) : undefined,
          avatar: mediaResponse?.doc.id,
        },
      })
    },
    onSuccess: () => {
      toast.success('Profile updated')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update profile')
    },
  })

  async function onSubmit(values: ProfileSchemaType) {
    mutation.mutate(values)
  }

  const setBreadcrumbs = useBreadcrumbs()
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Profile', href: '/dashboard/settings?tab=profile' },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent>
            <FieldSet className={cn(mutation.isPending && 'opacity-60 pointer-events-none')}>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input {...field} />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )
                }}
              />
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input {...field} />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )
                }}
              />
              <Controller
                control={form.control}
                name="birthday"
                render={({ field, fieldState }) => {
                  return (
                    <Field className="flex flex-col">
                      <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
                      <EnhancedDatePicker date={field.value} setDate={field.onChange} />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )
                }}
              />
              <ImageField
                name="image"
                previewField="imageUrl"
                label="Profile Image"
                className="min-h-52"
              />
              <RichTextField name="bio" label="Bio" />
            </FieldSet>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={mutation.isPending} className="cursor-pointer">
              {mutation.isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  )
}
