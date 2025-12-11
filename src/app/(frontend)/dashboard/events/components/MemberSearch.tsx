import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUsers } from '@/hooks/use-users'
import { User } from '@/types/user'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import UserCheckbox from './UserCheckbox'

export default function MemberSearch() {
  const [query, setQuery] = useState('')
  const { data: users, isLoading: usersLoading } = useUsers({ query })
  const form = useFormContext()
  if (!form) {
    throw new Error('Form not found')
  }
  const attendees = form.getValues('attendees')
  const shownResults = users?.filter((users) => !attendees.includes(users.id))

  return (
    <>
      <div className="relative">
        <div className="absolute w-10 h-full flex items-center justify-center">
          <Search className="size-4 text-muted-foreground" />
        </div>
        <Input
          placeholder="Search people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      {query && (
        <>
          {usersLoading && <p>Loading...</p>}
          {shownResults && (
            <div>
              {shownResults.map((member) => (
                <UserCheckbox key={member.id} user={member} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
