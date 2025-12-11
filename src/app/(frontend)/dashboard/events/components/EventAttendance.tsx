'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Invite as PayloadInvite } from '@/payload-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateInviteResponse } from './functions'
import { useInvite } from '@/hooks/use-invite'
import { Invite } from '@/types/invite'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Check, HelpCircle, X } from 'lucide-react'

type Props = {
  invite: PayloadInvite | string
}

export default function EventAttendance({ invite: initialInvite }: Props) {
  const { data: invite, isLoading } = useInvite(initialInvite)

  const queryClient = useQueryClient()

  const inviteId = typeof initialInvite === 'string' ? initialInvite : initialInvite.id

  const mutation = useMutation({
    mutationFn: async (response: Invite['eventResponse']) => {
      return await updateInviteResponse(inviteId, response)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['invite', { id: inviteId }], data)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update invite response', { description: error.message })
    },
  })

  const pending = mutation.isPending || isLoading
  const response = invite?.eventResponse

  return (
    <Card className="flex flex-col lg:flex-row justify-between">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription className="text-pretty">
          Let everyone know if you&apos;ll be attending this event.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={pending}
                  variant={pending ? 'ghost' : response === 'accepted' ? 'default' : 'outline'}
                  onClick={() => mutation.mutate('accepted')}
                  className={cn(
                    response === 'accepted' && 'bg-green-600',
                    'hover:bg-green-600 hover:text-white group',
                  )}
                >
                  <Check
                    className={cn(
                      `w-4 h-4 group-hover:text-white`,
                      response === 'accepted' ? 'text-white' : 'text-green-600',
                    )}
                  />
                  Attending
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>I'll be attending.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={pending}
                  variant={pending ? 'ghost' : response === 'maybe' ? 'default' : 'outline'}
                  onClick={() => mutation.mutate('maybe')}
                  className={cn(
                    response === 'maybe' && 'bg-yellow-500',
                    'hover:bg-yellow-500 hover:text-white group',
                  )}
                >
                  <HelpCircle
                    className={cn(
                      `w-4 h-4 group-hover:text-white`,
                      response === 'maybe' ? 'text-white' : 'text-yellow-500',
                    )}
                  />
                  Maybe
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>I'm not sure if I'll be attending.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={pending}
                  variant={pending ? 'ghost' : response === 'declined' ? 'default' : 'outline'}
                  onClick={() => mutation.mutate('declined')}
                  className={cn(
                    response === 'declined' && 'bg-red-600',
                    'hover:bg-red-600 hover:text-white group',
                  )}
                >
                  <X
                    className={cn(
                      `w-4 h-4 group-hover:text-white`,
                      response === 'declined' ? 'text-white' : 'text-red-600',
                    )}
                  />
                  Not Attending
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>I'm not attending.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
