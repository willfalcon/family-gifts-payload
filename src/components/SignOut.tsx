import { ComponentPropsWithRef } from 'react'

import { Button } from './ui/button'
import { useAuth } from '@/hooks/use-auth'
import { redirect } from 'next/navigation'

export default function SignOut({
  redirectUrl,
  ...props
}: ComponentPropsWithRef<typeof Button> & { redirectUrl?: string }) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    if (redirectUrl) {
      redirect(redirectUrl)
    } else {
      redirect('/sign-in')
    }
  }

  return (
    <Button variant="ghost" className="w-full p-0" {...props} onClick={handleLogout}>
      Sign Out
    </Button>
  )
}
