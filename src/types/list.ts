import { User, UserReturn } from './user'
import { Item, ItemReturn } from './item'
import { JSONContent } from '@tiptap/react'

export type List = {
  id: string
  name: string
  description?: JSONContent
  user: User
  items: Item[]
  visibleToFamilies: {
    id: string
  }[]
  visibleToUsers: {
    id: string
  }[]
  public: boolean
  shareLink: string | null
  favorite: {
    docs: {
      id: string
    }[]
  }
  updatedAt: string
  createdAt: string
}

export const ListReturn = `
  id
  name
  description
  user {
    ${UserReturn}
  }
  items {
    ${ItemReturn}
  } 
  visibleToFamilies {
    id
  }
  visibleToUsers {
    id
  }
  public
  shareLink
  favorite {
    docs {
      id
    }
  }
  updatedAt
  createdAt
`
