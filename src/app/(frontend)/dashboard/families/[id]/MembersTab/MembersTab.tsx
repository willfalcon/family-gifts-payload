'use client'

import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TabsContent, useTabs } from '@/components/ui/tabs'
import InviteMembers from '../../components/InviteMembers'
import MemberListItem from './MemberListItem'
import { useFamilyMembers } from '@/hooks/use-family-members'
import { useFamily } from '@/hooks/use-family'
import { Family as PayloadFamily } from '@/payload-types'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  isManager: boolean
  family: PayloadFamily
}

export default function MembersTab({ isManager, family: initialFamily }: Props) {
  const { setValue } = useTabs()
  const [searchTerm, setSearchTerm] = useState('')
  const initialMembers =
    initialFamily?.members?.map((member) => (typeof member === 'string' ? member : member.id)) || []
  const { data: family, isLoading, error, isError } = useFamily(initialFamily.id)
  const { data: members, isLoading: membersLoading } = useFamilyMembers(initialFamily.id)
  // TODO: Smarter search
  const filteredMembers =
    members?.filter((member) => member.name?.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const setBreadcrumbs = useBreadcrumbs()
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Families', href: '/dashboard/families' },
    { name: family?.name || '', href: `/dashboard/families/${initialFamily.id}` },
    { name: 'Members', href: `/dashboard/families/${initialFamily.id}?tab=members` },
  ])

  const pendingInvitations =
    family?.invites.docs.filter((invite) => invite.needsApproval || !invite.user) || []
  const pendingInvitationsCount = pendingInvitations.length
  return (
    <TabsContent value="members" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <>
            <div>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>People in your family group</CardDescription>
            </div>

            {isManager && family && <InviteMembers family={initialFamily} />}
          </>
        </CardHeader>
        <CardContent>
          <>
            <div className="relative w-full mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Wish Lists</th>
                      <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersLoading
                      ? initialMembers.map((member) => {
                          return <MemberListItemSkeleton key={member} />
                        })
                      : filteredMembers.map((member) => {
                          const memberIsManager =
                            family?.managers?.some((manager) => {
                              if (typeof manager === 'string') {
                                return manager === member.id
                              }
                              return manager.id === member.id
                            }) || false
                          const invite = family?.invites.docs.find(
                            (invite) => invite.user?.id === member.id,
                          )
                          const needsApproval = !!invite?.needsApproval
                          return (
                            <MemberListItem
                              key={member.id}
                              member={member}
                              isManager={isManager}
                              memberIsManager={memberIsManager}
                              familyId={initialFamily.id}
                              needsApproval={needsApproval}
                            />
                          )
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        </CardContent>
        <CardFooter>
          {isManager && pendingInvitationsCount > 0 && (
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground"
              onClick={() => setValue('invitations')}
            >
              {pendingInvitationsCount} pending invitation{pendingInvitationsCount === 1 ? '' : 's'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </TabsContent>
  )
}

function MemberListItemSkeleton() {
  return (
    <tr>
      <td className="p-4 flex items-center gap-2">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="w-24 h-4" />
      </td>
      <td className="p-4">
        <Skeleton className="w-40 h-4" />
      </td>
      <td className="p-4">
        <Skeleton className="w-16 h-4" />
      </td>
      <td className="p-4">
        <Skeleton className="w-full h-4" />
      </td>
      <td className="p-4">
        <Skeleton className="ml-auto w-8 h-4" />
      </td>
    </tr>
  )
}
