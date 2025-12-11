'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '@/hooks/use-auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signInSchema = z.object({
  email: z.email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type FormData = z.infer<typeof signInSchema>

export default function SignInForm({ redirectUrl }: { redirectUrl?: string }) {
  const searchParams = useSearchParams()
  const redirect = useRef(redirectUrl || searchParams.get('redirectTo'))
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (redirect?.current) {
        router.push(redirect.current)
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, router])

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
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
      await login(data)
      if (redirect?.current) {
        console.log('redirecting to', redirect.current)
        router.push(redirect.current)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('There was an error with the credentials provided. Please try again.')
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="gap-4 flex flex-col">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" required autoFocus tabIndex={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                    tabIndex={1}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={0}
                    />
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
          )}

          <Button type="submit" variant="default" className="self-end" tabIndex={0}>
            {/* {mutation.isPending ? 'Signing in...' : 'Sign in'} */}
            Sign In
          </Button>
        </form>
      </Form>
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
