import { Media } from '@/payload-types'
import { JSONContent } from '@tiptap/react'
import { User, UserReturn } from './user'
import { MediaReturn } from './media'

export type Item = {
  id: string
  name: string
  list: {
    docs: {
      id: string
    }[]
  }
  link?: string
  notes?: JSONContent
  priority?: string
  price?: string
  image?: Media
  purchasedBy?: User[]
  updatedAt: string
  createdAt: string
}

export const ItemReturn = `
  id
  name
  link
  notes
  priority
  price
  image {
    ... on Media {
      ${MediaReturn}
    }
  }
  purchasedBy {
    ${UserReturn}
  }
  list {
    docs {
      id
    }
  }
  updatedAt
  createdAt
`
