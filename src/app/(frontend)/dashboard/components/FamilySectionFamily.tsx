'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// import { FamilyFromDashboardGetFamilies, MemberFromDashboardGetFamilies } from '@/lib/queries/families';
// import { dashboardGetMoreMembers } from '../actions';

// import MemberCard from '@/components/MemberCard';
import { Button, buttonVariants } from '@/components/ui/button'
import { Family } from '@/types/family'
import MemberCard from '@/components/MemberCard'

export default function FamilySectionFamily({ family }: { family: Family }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div>
      <div className="flex items-center justify-between mb-2 cursor-pointer">
        <h3
          className="text-lg font-medium flex items-center flex-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          {family.name}
        </h3>

        <Link
          href={`/dashboard/families/${family.id}`}
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        >
          View Family
        </Link>
      </div>

      {expanded && (
        <>
          <div className="grid gap-4 @lg:grid-cols-2 @3xl:grid-cols-3">
            {family.members.map((member) => {
              const isManager = family.managers.some((manager) => manager.id === member.id)
              return <MemberCard key={member.id} member={member} isManager={isManager} />
            })}
          </div>
          {/* {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                className="w-full max-w-xs"
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
                Show More <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )} */}
        </>
      )}
    </div>
  )
}
