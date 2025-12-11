import { useQuery } from '@tanstack/react-query'
import { Mail, Plus, Search, X } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useFormContext } from 'react-hook-form'

// import { GetFamilies } from '@/lib/queries/families';

import { Alert } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useFamilies } from '@/hooks/use-families'
import MemberSelect from './MemberSelect'
import MemberSearch from './MemberSearch'
import PrimaryFamily from './PrimaryFamily'
import { Separator } from '@/components/ui/separator'
import MorePeople from './MorePeople'

export default function Attendees() {
  const form = useFormContext()

  const { data: families, isLoading: familiesLoading } = useFamilies()

  // State for external invites
  const [externalInvites, setExternalInvites] = useState<string[]>([])
  const [newInviteEmail, setNewInviteEmail] = useState('')

  const addExternalInvite = (e: FormEvent) => {
    e.preventDefault()
    // Check if email already exists in invites
    if (externalInvites.includes(newInviteEmail)) {
      return // Email already exists
    }

    // Add new invite
    setExternalInvites([...externalInvites, newInviteEmail])

    form.setValue('newExternalInvites', [...externalInvites, newInviteEmail])

    // Clear form
    setNewInviteEmail('')
  }

  // Remove external invite
  const removeExternalInvite = (email: string) => {
    setExternalInvites(externalInvites.filter((invite) => invite !== email))
    form.setValue('externalInvites', [...externalInvites, newInviteEmail])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendees</CardTitle>
        <CardDescription>Select people to invite to this event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {familiesLoading ? (
          <TabsSkeleton />
        ) : families && families.length ? (
          <>
            <PrimaryFamily />
            <MemberSelect />
            <MorePeople />
            <MemberSearch />
          </>
        ) : (
          <Alert variant="default">No families found</Alert>
        )}
        <Separator className="my-6" />
        <div>
          <h3 className="text-lg font-medium mb-4">External Invites</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Invite people who don't have an account or aren't in your family. They'll receive an
            email invitation to join the event.
          </p>
        </div>
        {externalInvites.length > 0 && (
          <div className="mb-4 space-y-2">
            {externalInvites.map((invite) => (
              <div
                key={invite}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">{invite}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExternalInvite(invite)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                placeholder="friend@example.com"
              />
            </div>
          </div>
          <Button onClick={addExternalInvite} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TabsSkeleton() {
  return (
    <>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-2">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-52" />
        </div>
      </div>
    </>
  )
}
