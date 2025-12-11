'use client'

import { useAuth } from '@/hooks/use-auth'
import JoinButton from './JoinButton'
import SignInOrSignUp from './SignInOrSignUp'
import { Family, Invite } from '@/payload-types'

// TODO: test join flow with new api stuff

export default function JoinArea({ token, invite }: { token: string; invite: Invite }) {
  const { user } = useAuth()
  const family = invite.family as Family
  const inviteType = invite.event ? 'Event' : 'Family'

  return !user ? (
    <SignInOrSignUp redirectUrl={`/join?token=${token}`} />
  ) : (
    <JoinButton
      // name={family?.name || event?.name || ''}
      name={family?.name || ''}
      invite={invite}
      inviteType={inviteType}
    />
  )
}
