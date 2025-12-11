'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPusherClient,
  getFamilyChannel,
  getEventChannel,
  getDirectMessageChannel,
  getAnonymousChannel,
} from '@/lib/pusher-client'
import { useAuth } from '@/hooks/use-auth'
import type { Message as MessageType } from '@/payload-types'

interface UseMessagesOptions {
  familyId?: string
  eventId?: string
  userId?: string
  assignmentId?: string
  enabled?: boolean
}

interface SendMessageData {
  content: string
  familyId?: string
  eventId?: string
  userId?: string
  assignmentId?: string
}

export function useMessages({
  familyId,
  eventId,
  userId,
  assignmentId,
  enabled = true,
}: UseMessagesOptions) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)

  // Build query key and channel name
  let channelName: string | null = null
  if (familyId) {
    channelName = getFamilyChannel(familyId)
  } else if (eventId) {
    channelName = getEventChannel(eventId)
  } else if (userId && user) {
    channelName = getDirectMessageChannel(user.id, userId)
  } else if (assignmentId) {
    channelName = getAnonymousChannel(assignmentId)
  }

  // Use a stable string key instead of array to avoid dependency issues
  const queryKey = useMemo(
    () => ['messages', familyId || eventId || userId || assignmentId],
    [familyId, eventId, userId, assignmentId],
  )

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery<MessageType[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (familyId) params.append('family', familyId)
      if (eventId) params.append('event', eventId)
      if (userId) params.append('user', userId)
      if (assignmentId) params.append('assignment', assignmentId)

      const response = await fetch(`/api/messages?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      // Payload returns { docs: [...], hasNextPage, totalDocs, etc. }
      return (data.docs || []) as MessageType[]
    },
    enabled: enabled && !!channelName,
    refetchOnWindowFocus: false,
  })

  // Subscribe to Pusher channel
  useEffect(() => {
    if (!channelName || !enabled) return

    const pusher = getPusherClient()
    const channel = pusher.subscribe(channelName)

    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true)
    })

    channel.bind('pusher:subscription_error', () => {
      setIsConnected(false)
    })

    channel.bind('new-message', (data: { message: MessageType }) => {
      // Optimistically update the cache
      queryClient.setQueryData<MessageType[]>(queryKey, (old = []) => {
        // Check if message already exists (avoid duplicates)
        if (old.some((msg) => msg.id === data.message.id)) {
          return old
        }
        return [...old, data.message]
      })
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
    }
  }, [channelName, enabled, queryClient, queryKey.join(',')]) // Use stringified key for dependency

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessageData) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }
      const responseJson = await response.json()
      console.log('responseJson', responseJson)
      return responseJson
    },
    onSuccess: () => {
      // The Pusher event will update the cache automatically
      // But we can also refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const sendMessage = useCallback(
    (content: string) => {
      if (!familyId && !eventId && !userId && !assignmentId) {
        throw new Error('Either familyId, eventId, userId, or assignmentId must be provided')
      }
      return sendMessageMutation.mutateAsync({
        content,
        familyId,
        eventId,
        userId,
        assignmentId,
      })
    },
    [familyId, eventId, userId, assignmentId, sendMessageMutation],
  )

  return {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    isSending: sendMessageMutation.isPending,
  }
}
