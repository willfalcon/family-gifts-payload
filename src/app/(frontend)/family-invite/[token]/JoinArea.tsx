'use client'

import { useAuth } from '@/hooks/use-auth'

import SignInOrSignUp from '../../join/SignInOrSignUp'
import { Family as PayloadFamily } from '@/payload-types'
import JoinButton from './JoinButton'

export default function JoinArea({ token, family }: { token: string; family: PayloadFamily }) {
  const { user } = useAuth()
  return !user ? (
    <SignInOrSignUp redirectUrl={`/family-invite/${token}`} />
  ) : (
    <JoinButton familyId={family.id} familyName={family.name} userId={user?.id} />
  )
}
