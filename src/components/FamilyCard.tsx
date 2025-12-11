'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import type { Family as PayloadFamily } from '@/payload-types'
import type { Family } from '@/types/family'
import { useAuth } from '@/hooks/use-auth'

export default function FamilyCard({ family }: { family: PayloadFamily | Family }) {
  const { user } = useAuth()

  const isCreator =
    family.createdBy &&
    typeof family.createdBy === 'object' &&
    'id' in family.createdBy &&
    family.createdBy.id === user?.id
  const creator = isCreator
    ? 'you'
    : family.createdBy && typeof family.createdBy === 'object' && 'name' in family.createdBy
      ? family.createdBy.name
      : 'Unknown'

  return (
    <Card key={family.id}>
      <CardHeader>
        <CardTitle>{family.name}</CardTitle>
        <CardDescription>Created by {creator}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span>{family.members?.length} members</span>
          {/* <span>3 upcoming events</span>
              <span className="text-muted-foreground">5 wish lists</span> */}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full" asChild>
          <Link href={`/dashboard/families/${family.id}`}>View Family</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
