'use client'

import { Gift } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Invite } from '@/types/invite'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/types/user'
import MessageDialog from './MessageDialog'
// import MessageDialog from './Messages/MessageDialog';

type Props = {
  member: User & { lists: { totalDocs: number } }
  isManager: boolean
}
export default function MemberCard({ member, isManager }: Props) {
  const { user } = useAuth()

  const isSelf = user?.id === member.id
  return (
    <Card key={member.id}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex flex-1 items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={member.avatar?.thumbnailURL || undefined}
              alt={member.name || member.email || ''}
            />
            <AvatarFallback>
              {(member.name || member.email)
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              <Link href={`/dashboard/members/${member.id}`} className="hover:underline">
                {member.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">{member.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <Badge variant={isManager ? 'default' : 'secondary'} className="text-xs">
            {isManager ? 'Manager' : 'Member'}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {member.lists?.totalDocs || 0} wish lists
          </span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 p-2">
        {user?.id && !isSelf && <MessageDialog user={member} className="align-start" />}

        <Button variant="ghost" size="sm" asChild className="col-start-2 self-end">
          <Link href={`/dashboard/members/${member.id}`}>
            <Gift className="h-4 w-4 mr-1" />
            Lists
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
