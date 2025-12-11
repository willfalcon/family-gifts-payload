'use client'

import type { Permissions } from 'payload'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { User } from '@/payload-types'
import type {
  AuthContext,
  Create,
  ForgotPassword,
  Login,
  Logout,
  ResetPassword,
} from '@/types/auth'

import { rest } from '@/hooks/rest'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const Context = createContext({} as AuthContext)

export async function getUser() {
  const user = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
  if (!user.user) {
    return null
  }
  return user.user as User
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<null | User>()
  const [permissions, setPermissions] = useState<null | Permissions>(null)

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      return await getUser()
    },
  })

  const queryClient = useQueryClient()

  const setUser = useCallback(
    (user: User | null) => {
      queryClient.setQueryData(['user'], user)
    },
    [queryClient],
  )

  const create = useCallback<Create>(async (args) => {
    try {
      const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, args)
      if (!user) {
        throw new Error('Failed to create user')
      }
      toast.success('User created successfully')
      await login({ email: args.email, password: args.password })
      return user
    } catch (error) {
      console.error('Create user error:', error)
      throw new Error('Failed to create user')
    }
  }, [])

  const login = useCallback<Login>(async (args) => {
    const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, args)
    if (!user) {
      throw new Error('Failed to login')
    }
    setUser(user)
    return user
  }, [])

  const logout = useCallback<Logout>(async () => {
    await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`)
    setUser(null)
    return
  }, [])

  // On mount, get user and set
  // useEffect(() => {
  //   const fetchMe = async () => {
  //     const user = await rest(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
  //       {},
  //       {
  //         method: 'GET',
  //       },
  //     )
  //     setUser(user)
  //   }

  //   void fetchMe()
  // }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, args)
    if (!user) {
      throw new Error('Failed to send forgot password email')
    }
    // setUser(user)
    return user
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, args)
    if (!user) {
      throw new Error('Failed to reset password')
    }
    setUser(user)
    return user
  }, [])

  return (
    <Context
      value={{
        create,
        forgotPassword,
        login,
        logout,
        permissions,
        resetPassword,
        setPermissions,
        setUser,
        user,
      }}
    >
      {children}
    </Context>
  )
}

type UseAuth<T = User> = () => AuthContext

export const useAuth: UseAuth = () => use(Context)
