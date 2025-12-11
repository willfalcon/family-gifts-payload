import { AvatarImage } from '@radix-ui/react-avatar'
import { Gift, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// import MessageDialog from '@/components/Messages/MessageDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MemberMoreMenu from './MemberMoreMenu'
import { useAuth } from '@/hooks/use-auth'
import { Media } from '@/payload-types'

import { FamilyMember } from '@/types/family'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TOOLTIP_DELAY_DURATION } from '@/constants'

type Props = {
  member: FamilyMember
  memberIsManager: boolean
  isManager: boolean
  familyId: string
  needsApproval?: boolean
}

// TODO: messages

export default function MemberListItem({
  member,
  memberIsManager,
  isManager,
  familyId,
  needsApproval,
}: Props) {
  const [changingRole, setChangingRole] = useState(false)
  const { user } = useAuth()
  return (
    <tr
      key={member.id}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={(member.avatar as Media)?.thumbnailURL || undefined}
              alt={member.name || ''}
            />
            <AvatarFallback>
              {member.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <Link href={`/dashboard/members/${member.id}`} className="font-medium hover:underline">
            {member.name}
          </Link>
        </div>
      </td>
      <td className="p-4 align-middle">{member.email}</td>
      <td className="p-4 align-middle">
        <Badge variant={changingRole ? 'outline' : memberIsManager ? 'default' : 'secondary'}>
          {changingRole ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : needsApproval ? (
            'Pending Approval'
          ) : memberIsManager ? (
            'Manager'
          ) : (
            'Member'
          )}
        </Badge>
      </td>
      <td className="p-4 align-middle">{member.lists?.totalDocs || 0}</td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2 justify-end">
          {/* {user?.id && <MessageDialog user={user.id} dmId={member.id} />} */}
          <Tooltip delayDuration={TOOLTIP_DELAY_DURATION}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/members/${member.id}`}>
                  <Gift className="h-4 w-4" />
                  <span className="sr-only">View Wish Lists</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Wish Lists</p>
            </TooltipContent>
          </Tooltip>
          <MemberMoreMenu
            member={member}
            isManager={isManager}
            memberIsManager={memberIsManager}
            familyId={familyId}
            setChangingRole={setChangingRole}
          />
        </div>
      </td>
    </tr>
  )
}
