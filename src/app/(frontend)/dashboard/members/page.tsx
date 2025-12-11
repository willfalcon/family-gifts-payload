import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title, { SubTitle } from '@/components/Title'
import { buttonVariants } from '@/components/ui/button'
import { getMembers } from '@/lib/server-utils'
import { Users2 } from 'lucide-react'
import Link from 'next/link'
import MembersList from './MembersList'

export const metadata = {
  title: 'Members',
}

export default async function MembersPage() {
  const members = await getMembers()

  return (
    <div className="container">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Members', href: '/dashboard/members' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Members</Title>
          <SubTitle>View and connect with all your people</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/families" className={buttonVariants({ variant: 'outline' })}>
            <Users2 className="mr-2 h-4 w-4" />
            Manage Families
          </Link>
        </div>
      </div>
      <MembersList members={members} />
    </div>
  )
}
