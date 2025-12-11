'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Invite } from '@/payload-types'
import { useMutation } from '@tanstack/react-query'
import { joinFamily } from './actions'
import SignOut from '@/components/SignOut'

type Props = {
  name: string
  inviteType: 'Family' | 'Event'
  invite: Invite
}

export default function JoinButton({ name, inviteType, invite }: Props) {
  const router = useRouter()
  //TODO: add option to join as a maybe right away
  const mutation = useMutation({
    mutationFn: async () => {
      if (inviteType === 'Family') {
        return await joinFamily(invite)
      } else {
        // return await joinEvent(invite);
      }
    },
    onSuccess: (res) => {
      if (!res) return
      toast.success(`Welcome, ${res.user.name}`)
      if (res.family) {
        router.push(`/dashboard/families/${res.family?.id}`)
      } else {
        // router.push(`/dashboard/events/${res.event?.id}`)
      }
    },
    onError: (err) => {
      console.log(err)
      toast.error(err.message)
    },
  })
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={async () => {
          mutation.mutate()
        }}
      >
        Join {name}
      </Button>
      <SignOut redirectUrl={`/join?token=${invite.token}`} />
    </div>
  )
}
