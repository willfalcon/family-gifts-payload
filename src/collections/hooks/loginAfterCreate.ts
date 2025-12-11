import { User } from '@/payload-types'
import { Payload } from 'payload'
import type { AfterChangeHook } from 'payload/dist/collections/config/types'

export const loginAfterCreate: AfterChangeHook = async ({
  doc,
  operation,
  req,
  req: { body = {}, payload, res },
}: {
  doc: User
  operation: 'create'
  req: { body: { email?: string; password?: string } }
  payload: Payload
  res: Response
}) => {
  if (operation === 'create') {
    const { email, password } = body

    if (email && password) {
      const { token, user } = await payload.login({
        collection: 'users',
        data: { email, password },
        req,
        res,
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
