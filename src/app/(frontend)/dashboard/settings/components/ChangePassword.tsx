'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { passwordErrors, passwordSchema, PasswordSchemaType } from '@/schemas/profile'

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
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { client } from '@/lib/payload-client'
import { User as PayloadUser } from '@/payload-types'

export default function ChangePassword({ user }: { user: PayloadUser }) {
  const form = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: async (data: PasswordSchemaType) => {
      const { password, confirmPassword } = data
      if (password !== confirmPassword) throw new Error(passwordErrors.PASSWORD_MISMATCH)
      return await client.update({
        collection: 'users',
        id: user.id,
        data: {
          password: data.password,
        },
      })
    },
    onSuccess: () => {
      toast.success('Password changed successfully')
      form.reset()
    },
    onError: (err) => {
      toast.error('Failed to change password')
      if (err.message === passwordErrors.PASSWORD_REQUIRED) {
        form.setError('password', { message: passwordErrors.PASSWORD_REQUIRED })
      } else if (err.message === passwordErrors.PASSWORD_INCORRECT) {
        form.setError('password', { message: passwordErrors.PASSWORD_INCORRECT })
      } else if (err.message === passwordErrors.PASSWORD_MISMATCH) {
        form.setError('confirmPassword', { message: passwordErrors.PASSWORD_MISMATCH })
      } else {
        console.log(err)
      }
    },
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function onSubmit(data: PasswordSchemaType) {
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password</CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input
                          id="password"
                          {...field}
                          type={showNewPassword ? 'text' : 'password'}
                          tabIndex={1}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                          tabIndex={2}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FieldContent>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )
              }}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          tabIndex={1}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          tabIndex={2}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FieldContent>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )
              }}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" tabIndex={1} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Spinner />
                  Changing password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  )
}
