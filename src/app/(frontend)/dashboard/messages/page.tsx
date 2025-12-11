import { redirect } from 'next/navigation'

// import Messages from './Messages'
import { getUser } from '@/lib/server-utils'
import Messages from './Messages'

export const metadata = {
  title: 'Messages',
  description: 'Send and receive messages from your family and friends',
  robots: {
    index: false,
  },
}

export default async function MessagePage() {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/messages')
  }

  return <Messages />
}
