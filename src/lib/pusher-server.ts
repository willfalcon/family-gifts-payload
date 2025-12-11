import Pusher from 'pusher'

if (!process.env.PUSHER_APP_ID) {
  throw new Error('PUSHER_APP_ID is not set')
}

if (!process.env.PUSHER_KEY) {
  throw new Error('PUSHER_KEY is not set')
}

if (!process.env.PUSHER_SECRET) {
  throw new Error('PUSHER_SECRET is not set')
}

if (!process.env.PUSHER_CLUSTER) {
  throw new Error('PUSHER_CLUSTER is not set')
}

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
})

/**
 * Get channel name for a family
 */
export function getFamilyChannel(familyId: string): string {
  return `family-${familyId}`
}

/**
 * Get channel name for an event
 */
export function getEventChannel(eventId: string): string {
  return `event-${eventId}`
}

/**
 * Get channel name for a direct message conversation between two users
 * Uses sorted IDs to ensure same channel regardless of who initiates
 */
export function getDirectMessageChannel(userId1: string, userId2: string): string {
  const [id1, id2] = [userId1, userId2].sort()
  return `dm-${id1}-${id2}`
}

/**
 * Get channel name for an anonymous Secret Santa conversation
 */
export function getAnonymousChannel(assignmentId: string): string {
  return `anonymous-${assignmentId}`
}

