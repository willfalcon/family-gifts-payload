import { User } from '@/payload-types'
import type { CollectionAfterChangeHook } from 'payload'

export const loginAfterCreate: CollectionAfterChangeHook<User> = async ({
  doc,
  operation,
  data,
  req,
}) => {
  if (operation === 'create') {
    const email = data?.email || doc.email
    const password = (data as { password?: string })?.password

    if (email && password && typeof email === 'string' && typeof password === 'string') {
      const { token, user } = await req.payload.login({
        collection: 'users',
        data: { email, password },
        req,
      })

      return {
        ...doc,
        token,
        user,
      }
    }
  }

  return doc
}
