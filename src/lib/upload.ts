import { Media } from '@/types/media'
import { graphqlRequest, gql } from './graphql-client'

type MediaResponse = {
  doc: Media
  message: string
}

export async function uploadMedia(image: File, name: string): Promise<MediaResponse | null> {
  const formData = new FormData()
  formData.append('file', image)
  formData.append(
    '_payload',
    JSON.stringify({
      alt: name,
    }),
  )
  try {
    const res = await fetch(`/api/media`, {
      method: 'POST',
      body: formData,
    })
    const media: MediaResponse = await res.json()
    return media
  } catch (err) {
    console.error(err)
    return null
  }
}

const DELETE_MEDIA_MUTATION = gql`
  mutation DeleteMedia($id: String!) {
    deleteMedia(id: $id) {
      id
    }
  }
`

export async function deleteMedia(mediaId: string) {
  const deletedMedia = await graphqlRequest(DELETE_MEDIA_MUTATION, {
    id: mediaId,
  })
  return deletedMedia.deleteMedia
}
