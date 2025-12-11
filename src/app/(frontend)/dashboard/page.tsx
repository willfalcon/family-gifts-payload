import { Plus } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import SetBreadcrumbs from '@/components/SetBreadcrumbs'
import Title from '@/components/Title'
import FamilySection from './components/FamilySection'
import WishListSection from './components/WishListSection'
import EventsSection from './components/EventsSection'
import FavoritesSection from './components/FavoritesSection'

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Family Gifts',
}

export default async function page() {
  return (
    <div className="container">
      <SetBreadcrumbs
        items={[
          {
            name: 'Dashboard',
            href: '/dashboard',
          },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Dashboard</Title>
          <p className="text-muted-foreground">
            Welcome back! Manage your families, events, and wish lists.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/wish-lists/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Wish List
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <FavoritesSection />
        <WishListSection />
        <FamilySection />
        <EventsSection />
      </div>
    </div>
  )
}
