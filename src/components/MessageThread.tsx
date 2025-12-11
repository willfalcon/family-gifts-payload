'use client'

import { useMessages } from '@/hooks/use-messages'
import MessageList from '@/components/MessageList'
import MessageInput from '@/components/MessageInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff } from 'lucide-react'

interface MessageThreadProps {
  familyId?: string
  eventId?: string
  userId?: string
  assignmentId?: string
  title?: string
}

export default function MessageThread({
  familyId,
  eventId,
  userId,
  assignmentId,
  title,
}: MessageThreadProps) {
  const { messages, isLoading, error, isConnected, sendMessage, isSending } = useMessages({
    familyId,
    eventId,
    userId,
    assignmentId,
    enabled: true,
  })

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-destructive">
            Error loading messages. Please try again.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title || 'Messages'}</CardTitle>
        <Badge variant={isConnected ? 'default' : 'secondary'} className="gap-1">
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Connecting...
            </>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSend={sendMessage} disabled={isSending || !isConnected} />
      </CardContent>
    </Card>
  )
}
