import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title, { SubTitle } from '@/components/Title'
import NewFamily from './NewFamily'
import { getUser } from '@/lib/server-utils'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'New Family',
  description: 'Create a new family to group people together.',
}

export default async function NewFamilyPage() {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in/redirectTo=/dashboard/families/new')
  }

  return (
    <div className="container">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Families', href: '/dashboard/families' },
          { name: 'New Family', href: '/dashboard/families/new' },
        ]}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>New Family</Title>
          <SubTitle>Create a new family to group people together.</SubTitle>
        </div>
      </div>
      <NewFamily user={user} />
    </div>
  )
}
