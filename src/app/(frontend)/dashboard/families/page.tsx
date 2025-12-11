import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title, { SubTitle } from '@/components/Title'
import { buttonVariants } from '@/components/ui/button'
import FamiliesPage from './FamiliesPage'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@payload-config'

export const metadata = {
  title: 'Families',
  description: 'Manage your family groups and invitations',
}

export default async function page() {
  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/families')
  }

  const familiesRes = await payload.find({
    collection: 'family',
    overrideAccess: false,
    user,
  })
  const families = familiesRes.docs

  return (
    <div className="container">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Families', href: '/dashboard/families' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Families</Title>
          <SubTitle>Manage your family groups and invitations</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/families/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Family
          </Link>
        </div>
      </div>

      <FamiliesPage families={families} />
    </div>
  )
}
