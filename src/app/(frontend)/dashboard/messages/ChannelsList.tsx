'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Users, Calendar, MessageSquare } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useThreads } from '@/hooks/use-threads'
import { ChannelListSkeleton } from '@/components/ChatSkeleton'
import type { Thread } from '@/app/(frontend)/api/messages/threads/route'

interface ChannelsListProps {
  activeThreadId?: string
  activeThreadType?: 'family' | 'event' | 'direct' | 'anonymous'
}

export default function ChannelsList({ activeThreadId, activeThreadType }: ChannelsListProps) {
  const { data: threads, isLoading } = useThreads()

  const getThreadHref = (thread: Thread) => {
    if (thread.type === 'family') {
      return `/dashboard/messages?family=${thread.id}`
    } else if (thread.type === 'event') {
      return `/dashboard/messages?event=${thread.id}`
    } else if (thread.type === 'anonymous') {
      return `/dashboard/messages?assignment=${thread.id}`
    } else {
      return `/dashboard/messages?user=${thread.id}`
    }
  }

  const getThreadIcon = (thread: Thread) => {
    if (thread.type === 'family') {
      return <Users className="h-4 w-4" />
    } else if (thread.type === 'event') {
      return <Calendar className="h-4 w-4" />
    } else if (thread.type === 'anonymous') {
      return <MessageSquare className="h-4 w-4" />
    } else {
      return <MessageSquare className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return <ChannelListSkeleton />
  }

  if (!threads || threads.length === 0) {
    return (
      <Card className="flex flex-col border-r w-80 h-full">
        <CardHeader className="p-4">
          <div className="relative">
            <Input placeholder="Search threads" className="pl-8" disabled />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            No conversations yet. Start a conversation with a family member or create an event!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col border-r w-80 h-full">
      <CardHeader className="p-4">
        <div className="relative">
          <Input placeholder="Search threads" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full">
          <div className="p-2 space-y-1">
            {threads.map((thread) => {
              const isActive = activeThreadId === thread.id && activeThreadType === thread.type
              const href = getThreadHref(thread)

              return (
                <Link
                  key={`${thread.type}-${thread.id}`}
                  href={href}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors',
                    isActive && 'bg-accent',
                  )}
                >
                  {thread.type === 'direct' && thread.participant ? (
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage
                        src={thread.participant.avatar?.sizes?.thumbnail?.url || undefined}
                        alt={thread.participant.name || thread.participant.email}
                      />
                      <AvatarFallback className="text-xs">
                        {(thread.participant.name || thread.participant.email)
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="size-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
                      {getThreadIcon(thread)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{thread.name}</p>
                      {thread.lastMessageAt && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(thread.lastMessageAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                    {thread.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">
                        {thread.lastMessage.sender.name || thread.lastMessage.sender.email}:{' '}
                        {thread.lastMessage.content}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
