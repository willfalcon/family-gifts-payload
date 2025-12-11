import { graphqlRequest } from '@/lib/graphql-client'
import { client } from '@/lib/payload-client'
import { Event, EventReturn } from '@/types/event'
import { Invite, InviteReturn } from '@/types/invite'
import { gql } from 'graphql-request'
import { resetNotificationsSent } from '../secret-santa/functions'

const EVENT_MANAGERS_MUTATION = gql`
  mutation EventManagers($eventId: String!, $managers: [String!]) {
    updateEvent(id: $eventId, data: { managers: $managers }) {
      ${EventReturn}
    }
  }
`

type UpdateEventResponse = {
  updateEvent: Event
}

export async function addManager(event: Event, userId: string) {
  const managers = [...event.managers.map((manager) => manager.id), userId]

  const data = await graphqlRequest<UpdateEventResponse>(EVENT_MANAGERS_MUTATION, {
    eventId: event.id,
    managers,
  })
  return data.updateEvent
}

export async function removeManager(event: Event, userId: string) {
  if (!event.managers.some((manager) => manager.id === userId)) {
    return
  }
  const managers = event.managers
    .filter((manager) => manager.id !== userId)
    .map((manager) => manager.id)
  const data = await graphqlRequest<UpdateEventResponse>(EVENT_MANAGERS_MUTATION, {
    eventId: event.id,
    managers,
  })
  return data.updateEvent
}

type InviteCancelResponse = {
  deleteInvite: Invite
}

const INVITE_CANCEL_MUTATION = gql`
  mutation InviteCancel($inviteId: String!) {
    deleteInvite(id: $inviteId) {
      ${InviteReturn}
    }
  }
`

export async function cancelInvite({
  inviteId,
  event,
  resetAssignments,
}: {
  inviteId: string
  event: Event
  resetAssignments: boolean
}) {
  if (resetAssignments) {
    await client.delete({
      collection: 'assignment',
      where: {
        event: {
          equals: event.assignments.docs.map((assignment) => assignment.id),
        },
      },
    })
    await client.delete({
      collection: 'exclusion',
      where: {
        event: {
          equals: event.exclusions.docs.map((exclusion) => exclusion.id),
        },
      },
    })

    await resetNotificationsSent(event)
  }
  const data = await graphqlRequest<InviteCancelResponse>(INVITE_CANCEL_MUTATION, {
    inviteId,
  })
  return data.deleteInvite
}
