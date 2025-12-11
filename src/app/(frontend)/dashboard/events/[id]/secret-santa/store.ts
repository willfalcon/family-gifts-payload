import { create } from 'zustand'
import type { Event } from '@/types/event'
import { Invite } from '@/types/invite'
import { resetNotificationsSent } from './functions'

export type Assignment = {
  giver: Invite
  receiver: Invite
}

export type Exclusion = {
  from: Invite
  to: Invite
}

type SecretSantaState = {
  budget: string
  participants: Invite[]
  exclusions: Exclusion[]
  assignments: Assignment[]
  showAssignments: boolean
  error: string | null

  initializeStore: (event: Event) => void
  setBudget: (budget: string) => void

  addParticipant: (participant: Invite) => void
  removeParticipant: (participant: Invite) => void
  setParticipants: (participants: Invite[]) => void

  addExclusion: (from: Invite, to: Invite) => void
  removeExclusion: (from: Invite, to: Invite) => void
  hasExclusion: (from: Invite, to: Invite) => boolean

  generateAssignments: (event: Event) => Promise<void>
  resetAssignments: (event: Event) => Promise<void>
  setShowAssignments: (show: boolean) => void
  setError: (error: string | null) => void
}

export const useSecretSantaStore = create<SecretSantaState>((set, get) => ({
  budget: '',
  notificationsSent: false,
  participants: [],
  exclusions: [],
  assignments: [],
  showAssignments: false,
  error: null,

  initializeStore: (event) => {
    console.log(event)

    const exclusions = event.exclusions.docs.map((exclusion) => ({
      from: exclusion.from,
      to: exclusion.to,
    }))

    const assignments = event.assignments.docs.map((assignment) => ({
      giver: assignment.giver,
      receiver: assignment.receiver,
    }))

    set({
      budget: event.secretSantaBudget || '',
      // notificationsSent: event.notificationsSent,
      participants: event.secretSantaParticipants,
      exclusions,
      assignments,
    })
  },
  setBudget: (budget: string) => set({ budget }),
  addParticipant: (participant: Invite) =>
    set((state) => ({ participants: [...state.participants, participant] })),
  removeParticipant: (participant: Invite) =>
    set((state) => ({ participants: state.participants.filter((p) => p.id !== participant.id) })),
  setParticipants: (participants: Invite[]) => set({ participants }),
  addExclusion: (from: Invite, to: Invite) => {
    const { exclusions } = get()
    // Check if exclusion already exists
    if (!exclusions.some((e) => e.from.id === from.id && e.to.id === to.id)) {
      set({ exclusions: [...exclusions, { from, to }] })
    }
  },
  removeExclusion: (from: Invite, to: Invite) => {
    const { exclusions } = get()
    set({ exclusions: exclusions.filter((e) => e.from.id !== from.id && e.to.id !== to.id) })
  },
  hasExclusion: (from: Invite, to: Invite) => {
    const { exclusions } = get()
    return exclusions.some((e) => e.from.id === from.id && e.to.id === to.id)
  },
  generateAssignments: async (event: Event) => {
    const { participants, hasExclusion, setError } = get()

    const givers = [...participants]
    const receivers = [...participants]
    const newAssignments: Assignment[] = []

    // Shuffle receivers
    for (let i = receivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[receivers[i], receivers[j]] = [receivers[j], receivers[i]]
    }

    // Assign givers to receivers
    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i]

      // Find a valid receiver (not the same person and respects exclusions)
      let receiverIndex = -1
      for (let j = 0; j < receivers.length; j++) {
        if (
          receivers[j] !== giver &&
          !hasExclusion(giver, receivers[j]) &&
          !newAssignments.some((a) => a.receiver.id === receivers[j].id)
        ) {
          receiverIndex = j
          break
        }
      }

      if (receiverIndex >= 0) {
        newAssignments.push({
          giver,
          receiver: receivers[receiverIndex],
        })
        receivers.splice(receiverIndex, 1)
      }
    }

    // If we couldn't assign everyone, alert the user
    if (newAssignments.length < participants.length) {
      setError(
        "Couldn't generate valid assignments with the current exclusions. Please try again or modify exclusions.",
      )

      return
    }

    set({
      assignments: newAssignments,
      showAssignments: true,
    })

    await resetNotificationsSent(event)
  },
  resetAssignments: async (event: Event) => {
    await resetNotificationsSent(event)
    set({ assignments: [], showAssignments: false })
  },
  setShowAssignments: (show: boolean) => set({ showAssignments: show }),
  setError: (error: string | null) => set({ error }),
}))
