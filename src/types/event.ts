import { Invite, InviteReturn } from './invite'
import { User, UserReturn } from './user'
import { Family, FamilyReturn } from './family'
import { Assignment, AssignmentReturn, Exclusion, ExclusionReturn } from './secret-santa'

export type Event = {
  id: string
  name: string
  date: string
  time: string
  endDate: string
  endTime: string
  location: string
  info: JSON
  creator: User
  managers: User[]
  invites: {
    docs: Invite[]
  }
  family: Family
  secretSantaBudget: string
  secretSantaParticipants: Invite[]
  assignments: {
    docs: Assignment[]
  }
  exclusions: {
    docs: Exclusion[]
  }
  secretSantaNotificationsSent: boolean
  favorite: {
    docs: {
      id: string
    }[]
  }
  updatedAt: string
  createdAt: string
}

export const EventReturn = `
  id
  name
  date
  time
  endDate
  endTime
  location
  info
  creator {
    ${UserReturn}
  }
  managers {
    ${UserReturn}
  }
  invites {
    docs {
      ${InviteReturn}
    }
  }
  family {
    ${FamilyReturn}
  }
  secretSantaBudget
  secretSantaParticipants {
    ${InviteReturn}
  }
  assignments {
    docs {
      ${AssignmentReturn}
    }
  }
  exclusions {
    docs {
      ${ExclusionReturn}
    }
  }
  secretSantaNotificationsSent
  favorite {
    docs {
      id
    }
  }
  updatedAt
  createdAt
`
