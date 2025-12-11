'use client'

import { MessagesSquare, Wifi, WifiOff } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { cn } from '@/lib/utils'
import {
  Family as PayloadFamily,
  Event as PayloadEvent,
  User as PayloadUser,
} from '@/payload-types'
import { User } from '@/types/user'
import { useMessages } from '@/hooks/use-messages'
import { Badge } from './ui/badge'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import MessageThread from './MessageThread'
import { Assignment } from '@/types/secret-santa'

export default function MessageDialog({
  className,
  assignment,
}: {
  className?: string
  assignment: Assignment
}) {
  const { messages, isLoading, error, isConnected, sendMessage, isSending } = useMessages({
    assignmentId: assignment.id,
    enabled: true,
  })

  const name = `Secret Santa (Anonymous) With ${assignment.receiver.user?.name || assignment.receiver.email || undefined}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn('relative', className)}>
          <MessagesSquare className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="[--messages-dialog-height:70vh] max-w-2xl max-h-(--messages-dialog-height)">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 py-2 pr-4">
          <DialogTitle>{name}</DialogTitle>
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
        </DialogHeader>
        <div className="flex-1 flex flex-col p-0 overflow-hidden">
          {error ? (
            <div className="text-center text-destructive">
              Error loading messages. Please try again.
            </div>
          ) : (
            <>
              {/* <MessageList messages={messages} isLoading={isLoading} /> */}
              <MessageThread assignmentId={assignment.id} title="Secret Santa (Anonymous)" />
              <MessageInput onSend={sendMessage} disabled={isSending || !isConnected} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
