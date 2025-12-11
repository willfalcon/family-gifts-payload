import { gql, graphqlRequest } from '@/lib/graphql-client'
import { EventReturn, Event } from '@/types/event'
// import { Assignment, Exclusion } from '@/types/secret-santa'
import { Assignment, Exclusion } from './store'
import { AssignmentReturn, ExclusionReturn } from '@/types/secret-santa'
import { Invite } from '@/types/invite'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendSecretSantaNotifications } from './actions'
import { toast } from 'sonner'
import { client } from '@/lib/payload-client'

const CREATE_ASSIGNMENT_MUTATION = gql`
  mutation CreateAssignment($eventId: String!, $giver: String!, $receiver: String!) {
    createAssignment(data: { event: $eventId, giver: $giver, receiver: $receiver }) {
      ${AssignmentReturn}
    }
  }
`

const DELETE_ASSIGNMENT_MUTATION = gql`
  mutation DeleteAssignment($id: String!) {
    deleteAssignments(id: $id) {
      id
    }
  }
`

const CREATE_EXCLUSION_MUTATION = gql`
  mutation CreateExclusion($eventId: String!, $from: String!, $to: String!) {
    createExclusion(data: { event: $eventId, from: $from, to: $to }) {
      ${ExclusionReturn}
    }
  }
`

const DELETE_EXCLUSION_MUTATION = gql`
  mutation DeleteExclusion($id: String!) {
    deleteExclusion(id: $id) {
      id
    }
  }
`

const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($eventId: String!, $budget: String!, $secretSantaParticipants: [String!]!) {
    updateEvent(id: $eventId, data: { secretSantaBudget: $budget, secretSantaParticipants: $secretSantaParticipants }) {
      ${EventReturn}
    }
  }
`

export async function updateSecretSanta(
  event: Event,
  participants: Invite[],
  assignments: Assignment[],
  exclusions: Exclusion[],
  budget: string,
) {
  // delete existing assignments
  await client.delete({
    collection: 'assignment',
    where: {
      event: {
        equals: event.assignments.docs.map((assignment) => assignment.id),
      },
    },
  })
  // delete existing exclusions
  await client.delete({
    collection: 'exclusion',
    where: {
      event: {
        equals: event.exclusions.docs.map((exclusion) => exclusion.id),
      },
    },
  })

  // create assignments
  await Promise.all(
    assignments.map(async (assignment) => {
      const result = await graphqlRequest(CREATE_ASSIGNMENT_MUTATION, {
        eventId: event.id,
        giver: assignment.giver.id,
        receiver: assignment.receiver.id,
      })
      return result
    }),
  )
  // create exclusions
  await Promise.all(
    exclusions.map(async (exclusion) => {
      const result = await graphqlRequest(CREATE_EXCLUSION_MUTATION, {
        eventId: event.id,
        from: exclusion.from.id,
        to: exclusion.to.id,
      })
      return result
    }),
  )
  // update event
  const updatedEvent = await graphqlRequest(UPDATE_EVENT_MUTATION, {
    eventId: event.id,
    secretSantaParticipants: participants.map((participant) => participant.id),
    budget,
  })

  return updatedEvent.updateEvent
}

export function useSecretSantaNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (event: Event) => {
      return await sendSecretSantaNotifications(event)
    },
    onSuccess: (data) => {
      toast.success('Notifications sent successfully')
      queryClient.invalidateQueries({ queryKey: ['event', { id: data.id }] })
    },
    onError: () => {
      toast.error('Failed to send notifications')
    },
  })
}

const RESET_NOTIFICATIONS_SENT_MUTATION = gql`
  mutation ResetNotificationsSent($eventId: String!) {
    updateEvent(id: $eventId, data: { secretSantaNotificationsSent: false }) {
      ${EventReturn}
    }
  }
`

export async function resetNotificationsSent(event: Event) {
  const result = await graphqlRequest(RESET_NOTIFICATIONS_SENT_MUTATION, {
    eventId: event.id,
  })
  return result.resetNotificationsSent
}
