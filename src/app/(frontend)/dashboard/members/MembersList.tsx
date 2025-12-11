'use client'

import MemberCard from '@/components/MemberCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useUsers } from '@/hooks/use-users'
import { User as PayloadUser } from '@/payload-types'
import { Gift, Mail, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function MembersList({ members: initialMembers }: { members: PayloadUser[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  // const [relationshipFilter, setRelationshipFilter] = useState<RelationshipType>('all');
  const [furtherFilter, setFurtherFilter] = useState<string | undefined>(undefined)
  const { data: members } = useUsers({
    userIds: initialMembers.map((member) => member.id),
  })
  const filteredMembers = useMemo(() => {
    return (
      members?.filter(
        (member) =>
          // Search filter
          searchTerm === '' ||
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase()),
        // Relationship filter
        // (relationshipFilter === 'all' || member.relationships.some((rel) => rel.type === relationshipFilter)) &&
        // // Privacy filter - in a real app, this would check against the current user
        // isVisible(member.member),
      ) || []
    )
    // .filter((member) => {
    //   if (relationshipFilter === 'family' || relationshipFilter === 'event') {
    //     return member.relationships.some((rel) => rel.id === furtherFilter);
    //   }
    //   return true;
    // });
  }, [searchTerm, members])
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* <RelationFilter
          relationshipFilter={relationshipFilter}
          setRelationshipFilter={setRelationshipFilter}
          furtherFilter={furtherFilter}
          setFurtherFilter={setFurtherFilter}
        /> */}
      </div>
      {filteredMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No members found matching your search.</p>
        </div>
      ) : (
        <div className="@container">
          <div className="grid gap-4 @3xl:grid-cols-2 @4xl:grid-cols-3 @5xl:grid-cols-4">
            {filteredMembers.map((member) => {
              return (
                <MemberCard key={member.id} member={member} isManager={false} />
                // <Card key={member.id}>
                //   <CardHeader>
                //     <div className="flex items-center gap-4">
                //       <Avatar className="h-10 w-10">
                //         <AvatarImage
                //           src={member.avatar?.thumbnailURL || undefined}
                //           alt={member.name || undefined}
                //         />
                //         <AvatarFallback>
                //           {member.name
                //             ?.split(' ')
                //             .map((n) => n[0])
                //             .join('')}
                //         </AvatarFallback>
                //       </Avatar>
                //       <div className="flex-1">
                //         <div className="flex items-center justify-between">
                //           <CardTitle className="text-base">
                //             <Link
                //               href={`/dashboard/members/${member.id}`}
                //               className="hover:underline"
                //             >
                //               {member.name}
                //             </Link>
                //           </CardTitle>
                //           {/* <TooltipProvider>
                //           <Tooltip>
                //             <TooltipTrigger asChild>
                //               <div className={`h-3 w-3 rounded-full ${privacyInfo.color}`}></div>
                //             </TooltipTrigger>
                //             <TooltipContent>
                //               <div className="flex items-center gap-1">
                //                 {privacyInfo.icon}
                //                 <span>{privacyInfo.label}</span>
                //               </div>
                //             </TooltipContent>
                //           </Tooltip>
                //         </TooltipProvider> */}
                //         </div>
                //         <CardDescription className="text-xs">{member.email}</CardDescription>
                //       </div>
                //     </div>
                //   </CardHeader>
                //   <CardContent>
                //     {/* <div className="space-y-2">
                //       <div className="text-sm font-medium">Connections:</div>
                //       <div className="flex flex-wrap gap-2">
                //         {relationships.map((rel, idx) => (
                //           <TooltipProvider key={idx}>
                //             <Tooltip>
                //               <TooltipTrigger asChild>
                //                 <Badge variant="outline" className="flex items-center gap-1">
                //                   {getRelationshipIcon(rel.type)}
                //                   <span className="truncate max-w-[100px]">{rel.name}</span>
                //                 </Badge>
                //               </TooltipTrigger>
                //               <TooltipContent>
                //                 {rel.type === 'family' && 'Family Member'}
                //                 {rel.type === 'event' && 'Event Attendee'}
                //                 {rel.type === 'list' && 'Shared List'}
                //               </TooltipContent>
                //             </Tooltip>
                //           </TooltipProvider>
                //         ))}
                //       </div>
                //     </div> */}
                //   </CardContent>
                //   <CardFooter className="flex justify-between">
                //     <Button variant="outline" size="sm">
                //       <Mail className="h-4 w-4 mr-1" />
                //       Message
                //     </Button>
                //     <Button variant="outline" size="sm" asChild>
                //       <Link href={`/dashboard/members/${member.id}`}>
                //         <Gift className="h-4 w-4 mr-1" />
                //         Wish Lists
                //       </Link>
                //     </Button>
                //   </CardFooter>
                // </Card>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
