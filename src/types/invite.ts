import { User, UserReturn } from '@/types/user'

export type Invite = {
  id: string
  email: string
  needsApproval: boolean
  user: User
  token: string
  tokenExpiry: string
  family: {
    id: string
  }
  event: {
    id: string
  }
  eventResponse: 'accepted' | 'maybe' | 'declined'
  createdAt: string
  updatedAt: string
}

export const InviteReturn = `
  id
  email
  needsApproval
  createdAt
  token
  tokenExpiry
  user {
    ${UserReturn}
  }
  family {
    id
  }
  eventResponse
  updatedAt
  createdAt
`
