import { Invite, InviteReturn } from '@/types/invite'
import { User, UserReturn } from './user'

export type Family = {
  id: string
  name: string
  description: any
  allowInvites: boolean
  createdBy: User
  managers: User[]
  members: User[]
  invites: {
    docs: Invite[]
    totalDocs: number
  }
  inviteLinkToken: string
  inviteLinkExpiry: string
  requireApproval: boolean
  favorite: {
    docs: {
      id: string
    }[]
  }
  createdAt: string
  updatedAt: string
}

export type UpdateFamilyResponse = {
  updateFamily: Family
}

export type FamilyMember = User & {
  lists: {
    totalDocs: number
  }
}

export const FamilyReturn = `
  id
  name
  description
  invites {
    docs {
      ${InviteReturn}
    }
    totalDocs
  }
  managers {
    ${UserReturn}
  }
  members {
    ${UserReturn}
  }
  inviteLinkToken
  inviteLinkExpiry
  requireApproval
  favorite {
    docs {
      id
    }
  }
  updatedAt
  createdAt
`
