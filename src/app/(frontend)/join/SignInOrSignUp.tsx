'use client'

import { useState } from 'react'
import SignInForm from '../sign-in/SignInForm'
import SignUpForm from '../sign-up/SignUpForm'

export default function SignInOrSignUp({ redirectUrl }: { redirectUrl?: string }) {
  const [isSignIn, setIsSignIn] = useState(true)
  return isSignIn ? (
    <>
      <h2>
        To join, sign in or{' '}
        <button
          onClick={() => setIsSignIn(false)}
          className="text-primary underline cursor-pointer"
        >
          create an account.
        </button>
      </h2>
      <SignInForm redirectUrl={redirectUrl} />
    </>
  ) : (
    <>
      <h2>
        To join, create an account or{' '}
        <button onClick={() => setIsSignIn(true)} className="text-primary underline cursor-pointer">
          sign in.
        </button>
      </h2>
      <SignUpForm redirectUrl={redirectUrl} />
    </>
  )
}
