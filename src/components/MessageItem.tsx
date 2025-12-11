'use client'

import { memo } from 'react'
import { formatTime } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import type { Message as MessageType } from '@/payload-types'

interface MessageItemProps {
  message: MessageType
}

function MessageItem({ message }: MessageItemProps) {
  const { user } = useAuth()
  const sender = typeof message.sender === 'string' ? null : message.sender
  const isAnonymous = !!message.assignment
  const isOwnMessage = user?.id === sender?.id

  // For anonymous messages, hide sender identity unless it's the current user's own message
  const showAnonymous = isAnonymous && !isOwnMessage

  const avatarUrl = showAnonymous
    ? undefined
    : sender?.avatar && typeof sender.avatar !== 'string'
      ? sender.avatar?.sizes?.thumbnail?.url || sender.avatar?.url
      : undefined

  const senderName = showAnonymous ? 'Anonymous' : sender?.name || sender?.email || 'Unknown'

  return (
    <div
      className={cn('flex gap-3 mb-4', {
        'flex-row-reverse': isOwnMessage,
      })}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {showAnonymous ? (
          <AvatarFallback className="text-xs bg-muted">
            <span className="text-muted-foreground">?</span>
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={avatarUrl || ''} alt={senderName} />
            <AvatarFallback className="text-xs">
              {senderName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div
        className={cn('flex flex-col max-w-[70%]', {
          'items-end': isOwnMessage,
          'items-start': !isOwnMessage,
        })}
      >
        <div
          className={cn('rounded-lg px-4 py-2', {
            'bg-primary text-primary-foreground': isOwnMessage,
            'bg-muted': !isOwnMessage,
          })}
        >
          <p className="text-sm whitespace-pre-wrap wrap-break-word">{message.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{senderName}</span>
          <span>·</span>
          <span>{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default memo(MessageItem)
