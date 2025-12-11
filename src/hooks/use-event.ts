import { useQuery } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import { Event, EventReturn } from '@/types/event'
import { gql } from 'graphql-request'

const EVENT_QUERY = gql`
  query Event($id: String!) {
    Event(id: $id) {
      ${EventReturn}
    }
  }
`
type GetEventResponse = {
  Event: Event
}

export async function getEvent(eventId: string) {
  const response = await graphqlRequest<GetEventResponse>(EVENT_QUERY, { id: eventId })
  return response.Event
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', { id: eventId }],
    queryFn: async () => {
      return await getEvent(eventId)
    },
  })
}

const EVENTS_QUERY = gql`
  query Events($ids: [String!]) {
    Events(where: { id: { in: $ids } }) {
      docs {
        ${EventReturn}
      }
    }
  }
`

type GetEventsResponse = {
  Events: {
    docs: Event[]
  }
}

export async function getEvents(ids: string[]) {
  const response = await graphqlRequest<GetEventsResponse>(EVENTS_QUERY, { ids })
  return response.Events
}

export function useEvents(ids: string[]) {
  return useQuery({
    queryKey: ['events', { ids }],
    queryFn: async () => {
      return await getEvents(ids)
    },
  })
}
