'use client'

import { useEffect, useRef, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import MessageItem from '@/components/MessageItem'
import type { Message as MessageType } from '@/payload-types'

interface MessageListProps {
  messages: MessageType[]
  isLoading?: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(messages.length)

  useEffect(() => {
    // Only auto-scroll if new messages were added (not on initial load or removal)
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages.length])

  const messageItems = useMemo(
    () => messages.map((message) => <MessageItem key={message.id} message={message} />),
    [messages],
  )

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 h-full">
        <div className="p-4 text-center text-muted-foreground">Loading messages...</div>
      </ScrollArea>
    )
  }

  if (messages.length === 0) {
    return (
      <ScrollArea className="flex-1 h-full">
        <div className="p-4 text-center text-muted-foreground">
          No messages yet. Start the conversation!
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4 space-y-1">
        {messageItems}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
