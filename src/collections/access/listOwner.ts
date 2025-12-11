import type { Access, Where } from 'payload'

import { checkRole } from './checkRole'

export const listOwner: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['super-admin'], user)) {
      return true
    }

    return {
      user: {
        equals: user.id,
      },
    }
  }

  return false
}
