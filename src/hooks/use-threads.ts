'use client'

import { useQuery } from '@tanstack/react-query'
import type { Thread } from '@/app/(frontend)/api/messages/threads/route'

export function useThreads() {
  return useQuery<Thread[]>({
    queryKey: ['threads'],
    queryFn: async () => {
      const response = await fetch('/api/messages/threads')
      if (!response.ok) {
        throw new Error('Failed to fetch threads')
      }
      const data = await response.json()
      return data.threads || []
    },
    refetchOnWindowFocus: true,
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}

