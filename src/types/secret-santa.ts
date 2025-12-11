import { Invite, InviteReturn } from './invite'

export type Assignment = {
  id: string
  event: string
  giver: Invite
  receiver: Invite
}

export type Exclusion = {
  id: string
  event: string
  from: Invite
  to: Invite
}

export const AssignmentReturn = `
  id
  event {
    id
  }
  giver {
    ${InviteReturn}
  }
  receiver {
    ${InviteReturn}
  }
`

export const ExclusionReturn = `
  id
  event {
    id
  }
  from {
    ${InviteReturn}
  }
  to {
    ${InviteReturn}
  }
`
