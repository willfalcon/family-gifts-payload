import { useFamilies } from '@/hooks/use-families'
import { useUsers } from '@/hooks/use-users'
import { useFormContext } from 'react-hook-form'
import UserCheckbox from './UserCheckbox'

export default function MorePeople() {
  const form = useFormContext()

  const attendees = form.getValues('attendees')

  const { data: families, isLoading: familiesLoading } = useFamilies()
  const family = families?.find((f) => f.id === form.getValues('family'))

  const selectedAttendeesOutsideFamily = attendees.filter(
    (attendee: string) => !family?.members.some((member) => member.id === attendee),
  )
  const { data: users, isLoading: usersLoading } = useUsers({
    userIds: selectedAttendeesOutsideFamily || [],
  })

  return (
    !usersLoading &&
    users &&
    users.length > 0 && (
      <>
        <h3 className="text-lg font-medium">More People</h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((attendee) => (
              <UserCheckbox key={attendee.id} user={attendee} />
            ))}
          </div>
        </div>
      </>
    )
  )
}
