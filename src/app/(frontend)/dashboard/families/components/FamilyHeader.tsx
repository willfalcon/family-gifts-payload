import { JSONContent } from '@tiptap/react'
import { format } from 'date-fns'
import { Mail, MoreHorizontal, PenSquare } from 'lucide-react'
import Link from 'next/link'

// import MessageDialog from '@/components/Messages/MessageDialog';
import { ShareButton } from '@/components/ShareButton'
import Title from '@/components/Title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Viewer from '@/components/ui/rich-text/viewer'
import { Family as PayloadFamily, User as PayloadUser } from '@/payload-types'

import RemoveSelf from './RemoveSelf'
import Favorite from '@/components/Favorite'
import MessageDialog from '@/components/MessageDialog'
type Props = {
  family: PayloadFamily
  isManager: boolean
  me: PayloadUser
}

// TODO: Add message all button
export default function FamilyHeader({ family, isManager, me }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <Title>{family.name}</Title>
          <Badge variant="outline">
            {family.members?.length} member{family.members?.length === 1 ? '' : 's'}
          </Badge>
          <Favorite family={family} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created by{' '}
          {family.createdBy && typeof family.createdBy === 'object' && 'name' in family.createdBy
            ? family.createdBy.name
            : 'Unknown'}{' '}
          • {format(family.createdAt, 'yyyyI-mm-dd')}
        </p>
        {family.description && (
          <Viewer
            className="text-muted-foreground"
            content={family.description as JSONContent}
            immediatelyRender={false}
          />
        )}
      </div>
      <div className="flex gap-2">
        <MessageDialog family={family} />

        <ShareButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isManager && (
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/families/${family.id}/edit`}>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Edit Family
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Message All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" asChild>
              <RemoveSelf family={family} trigger={<Button variant="ghost">Leave Family</Button>} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
