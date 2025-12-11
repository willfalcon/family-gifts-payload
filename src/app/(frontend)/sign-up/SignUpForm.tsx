'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '@/hooks/use-auth'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { rest } from '@/hooks/rest'

const signUpSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type FormData = z.infer<typeof signUpSchema>

export default function SignUpForm({ redirectUrl }: { redirectUrl?: string }) {
  const searchParams = useSearchParams()
  const redirect = useRef(redirectUrl || searchParams.get('redirect'))
  const { create } = useAuth()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const {
    formState: { errors, isLoading },
    handleSubmit,
    control,
  } = form

  async function onSubmit(data: FormData) {
    try {
      // const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, data)
      await create(data)
      if (redirect?.current) {
        router.push(redirect.current)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setError('There was an error with the credentials provided. Please try again.')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-4 flex flex-col">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input {...field} id="name" autoFocus tabIndex={0} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input {...field} id="email" type="email" autoFocus tabIndex={0} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                    tabIndex={1}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    tabIndex={0}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
          )}

          <Button type="submit" variant="default" className="self-end" tabIndex={0}>
            {/* {mutation.isPending ? 'Signing in...' : 'Sign in'} */}
            Sign Up
          </Button>
        </FieldGroup>
      </form>
      {/* <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div> */}
      {/* <div className="flex gap-2 justify-center"> */}
      {/* {Object.values(providerMap).map((provider) => (
                <form action={() => handleSignInWithProvider(provider.id)}>
                  <Button type="submit" variant="outline" size="icon" className="h-10">
                    <provider.icon className="h-4 w-4" />
                    <span className="sr-only">{provider.name}</span>
                  </Button>
                </form>
              ))} */}
      {/* <form action={handleSignInWithFacebook}>
          <Button variant="outline" size="icon" className="h-10" type="submit">
            <FaFacebookF className="h-4 w-4" />
            <span className="sr-only">Facebook</span>
          </Button>
        </form> */}
      {/* <form action={handleSignInWithGoogle}>
          <Button variant="outline" size="icon" className="h-10" type="submit">
            <FaGoogle className="h-4 w-4" />
            <span className="sr-only">Google</span>
          </Button>
        </form> */}
      {/* <Button variant="outline" size="icon" className="h-10">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button> */}
      {/* </div> */}
    </>
  )
}
