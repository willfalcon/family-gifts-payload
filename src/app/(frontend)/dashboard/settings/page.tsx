import { redirect } from 'next/navigation'
import { cache } from 'react'

import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title, { SubTitle } from '@/components/Title'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User } from '@/types/user'
import { getUser } from '@/lib/server-utils'
// import ChangePassword from './components/ChangePassword'
// import PrivacySettings from './components/PrivacySettings'
import ProfileSettings from './components/ProfileForm'
import ChangePassword from './components/ChangePassword'

export const metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
  robots: {
    index: false,
  },
}

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in?redirectTo=/dashboard/settings')
  }

  return (
    <div className="container px-4 py-8 max-w-5xl">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Settings', href: '/dashboard/settings' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Settings</Title>
          <SubTitle>Manage your account settings and preferences</SubTitle>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <>
            <ProfileSettings user={user} />
            <ChangePassword user={user} />
          </>
        </TabsContent>
        {/* <TabsContent value="notifications" className="space-y-4"> */}
        {/* <NotificationsForm user={user} /> */}
        {/* </TabsContent> */}
      </Tabs>
    </div>
  )
}
