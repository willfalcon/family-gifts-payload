import { Media } from '@/payload-types'
import { MediaReturn } from './media'
import { List, ListReturn } from './list'

export type User = {
  id: string
  name: string
  email: string
  avatar: Media
  roles: string[]
  sessions: {
    id: string
    createdAt: string
    expiresAt: string
  }[]
  createdAt: string
  updatedAt: string
}

// lists removed from return, add as needed
export const UserReturn = `
  id
  name
  email
  avatar {
    ${MediaReturn}
  }
  roles
  sessions {
    id
    createdAt
    expiresAt
  }
  updatedAt
  createdAt
`
