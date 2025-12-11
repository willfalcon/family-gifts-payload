'use client'

import { useSearchParams } from 'next/navigation'
import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import { useIsMobile } from '@/hooks/use-mobile'

import Title from '@/components/Title'
import ChannelsList from './ChannelsList'
import MessageThread from '@/components/MessageThread'

export default function Messages() {
  const setBreadcrumbs = useBreadcrumbs()
  const searchParams = useSearchParams()
  const mobile = useIsMobile()

  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Messages', href: '/dashboard/messages' },
  ])

  const familyId = searchParams.get('family')
  const eventId = searchParams.get('event')
  const userId = searchParams.get('user')
  const assignmentId = searchParams.get('assignment')

  const activeThreadId = familyId || eventId || userId || assignmentId || null
  const activeThreadType = familyId
    ? 'family'
    : eventId
      ? 'event'
      : userId
        ? 'direct'
        : assignmentId
          ? 'anonymous'
          : undefined

  const getThreadTitle = () => {
    if (familyId) return 'Family Chat'
    if (eventId) return 'Event Discussion'
    if (userId) return 'Direct Message'
    if (assignmentId) return 'Secret Santa (Anonymous)'
    return 'Messages'
  }

  return (
    <div className="space-y-4 p-4 lg:p-8 pt-6">
      <Title>Messages</Title>
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {(!mobile || !activeThreadId) && (
          <ChannelsList
            activeThreadId={activeThreadId || undefined}
            activeThreadType={activeThreadType}
          />
        )}
        {activeThreadId && (
          <div className="flex-1">
            <MessageThread
              familyId={familyId || undefined}
              eventId={eventId || undefined}
              userId={userId || undefined}
              assignmentId={assignmentId || undefined}
              title={getThreadTitle()}
            />
          </div>
        )}
        {!activeThreadId && !mobile && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
