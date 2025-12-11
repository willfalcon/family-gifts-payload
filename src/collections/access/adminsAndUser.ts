import type { Access, Where } from 'payload'

import { checkRole } from './checkRole'

export const adminsAndUser: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['super-admin'], user)) {
      return true
    }

    return {
      id: { equals: user.id },
    }
  }

  return false
}
