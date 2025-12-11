'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { cn } from '@/lib/utils'
import { addManager, removeManager } from '../actions'
import { cancelInvite } from './functions'

import { Invite } from '@/types/invite'
import { Event } from '@/types/event'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

type Props = {
  invite: Invite
  isManager: boolean
  event: Event
}

export default function Participant({ invite, isManager, event }: Props) {
  const participant = invite.user
  console.log(invite)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (
      action: 'addManager' | 'removeManager' | 'removeParticipant' | 'cancelInvite',
    ) => {
      switch (action) {
        case 'addManager':
          await addManager(event, participant?.id)
          break
        case 'removeManager':
          await removeManager(event, participant?.id)
          break
        case 'removeParticipant':
        case 'cancelInvite':
          await cancelInvite({
            inviteId: invite.id,
            event,
            resetAssignments: participantHasAssignment,
          })
          break
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', { id: event.id }] })
    },
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    },
  })

  const participantHasAssignment = event.assignments?.docs?.some(
    (assignment) => assignment.giver.id === invite?.id,
  )
  console.log(event)
  const [showAssignmentResetWarning, setShowAssignmentResetWarning] = useState(false)
  const [showRemoveParticipantWarning, setShowRemoveParticipantWarning] = useState(false)
  // const { user: participant, ...invite } = query.data!;

  const attendeeIsManager = event.managers.some((manager) => manager.id === participant?.id)

  if (participant) {
    return (
      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Avatar>
            <AvatarImage
              src={participant?.avatar?.thumbnailURL || undefined}
              alt={participant.name || ''}
            />
            <AvatarFallback>
              {participant.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{participant.name}</p>
            <p className="text-sm text-muted-foreground">{participant.email}</p>
          </div>
        </div>
        <Badge
          className={cn(
            'rounded-full',
            invite?.eventResponse === 'accepted'
              ? 'bg-green-600'
              : invite?.eventResponse === 'maybe'
                ? 'bg-yellow-600'
                : invite?.eventResponse === 'declined'
                  ? 'bg-red-600'
                  : 'bg-gray-600',
          )}
        >
          {invite?.eventResponse === 'accepted'
            ? 'Attending'
            : invite?.eventResponse === 'maybe'
              ? 'Maybe'
              : invite?.eventResponse === 'declined'
                ? 'Declined'
                : 'Pending'}
        </Badge>
        <Badge
          variant={attendeeIsManager ? 'default' : 'outline'}
          className={cn(mutation.isPending && 'animate-pulse opacity-50')}
        >
          {attendeeIsManager ? 'Manager' : 'Participant'}
        </Badge>
        {isManager && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {attendeeIsManager && (
                <DropdownMenuItem onClick={() => mutation.mutate('removeManager')}>
                  Remove as Manager
                </DropdownMenuItem>
              )}
              {!attendeeIsManager && (
                <DropdownMenuItem onClick={() => mutation.mutate('addManager')}>
                  Make Manager
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setShowRemoveParticipantWarning(true)}>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <AlertDialog open={showAssignmentResetWarning} onOpenChange={setShowAssignmentResetWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Secret Santa Assignments Will Be Reset</AlertDialogTitle>
              <AlertDialogDescription>
                Secret Santa assignments will be reset if you remove this participant.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => mutation.mutate('removeParticipant')}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog
          open={showRemoveParticipantWarning}
          onOpenChange={setShowRemoveParticipantWarning}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will remove this participant from the event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (participantHasAssignment) {
                    setShowAssignmentResetWarning(true)
                    setShowRemoveParticipantWarning(false)
                    return
                  } else {
                    mutation.mutate('removeParticipant')
                    setShowRemoveParticipantWarning(false)
                  }
                }}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }
  if (invite) {
    return (
      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
        <div className="flex items-center gap-3 flex-1">
          <Avatar>
            <AvatarFallback>{invite.email?.[0] ?? ''}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{invite.email ?? ''}</p>
          </div>
        </div>
        <Badge className={cn('rounded-full bg-gray-600')}>Invited</Badge>
        {isManager && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem asChild>
              <Link href={`/dashboard/family-members/${.id}`}>View Profile</Link>
            </DropdownMenuItem> */}

              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => mutation.mutate('cancelInvite')}
              >
                Cancel Event Invitation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }
}
