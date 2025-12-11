import { List, ListReturn } from './list'
import { Family, FamilyReturn } from './family'
import { Event, EventReturn } from './event'

export type Favorite = {
  id: string
  favorite: {
    relationTo: 'family' | 'event' | 'list'
    value: Family | Event | List
  }
}

export const FavoriteReturn = `
  id
  favorite {
    relationTo
    value {
      ... on Family {
        ${FamilyReturn}
      }
      ... on Event {
        ${EventReturn}
      }
      ... on List {
        ${ListReturn}
      }
    }
  }
`
