import { Media as PayloadMedia } from '@/payload-types'

export const MediaReturn = `
  id
  alt
  updatedAt
  createdAt
  url
  filename
  mimeType
  filesize
  width
  height
  focalX
  focalY
  sizes {
    medium {
      url
      width
      height
      mimeType
      filesize
      filename
    }
    thumbnail {
      url
      width
      height
      mimeType
      filesize
      filename
    }
  }
`

export type Media = PayloadMedia
