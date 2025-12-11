import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/user'
import { useFormContext } from 'react-hook-form'

export default function UserCheckbox({ user }: { user: User }) {
  const form = useFormContext()
  if (!form) {
    throw new Error('Form not found')
  }
  const attendees = form.watch('attendees')
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`member-${user.id}`}
        checked={attendees.includes(user.id)}
        onCheckedChange={() => {
          console.log('checkedChange', attendees)
          if (attendees.includes(user.id)) {
            form.setValue(
              'attendees',
              attendees.filter((id: string) => id !== user.id),
            )
          } else {
            form.setValue('attendees', [...attendees, user.id])
          }
          console.log('attendees', form.getValues('attendees'))
        }}
      />
      <label htmlFor={`member-${user.id}`} className="flex items-center gap-3 flex-1">
        <Avatar>
          <AvatarImage src={user.avatar?.thumbnailURL || undefined} alt={user.name || ''} />
          <AvatarFallback>
            {user.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            {user.name}
          </div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </label>
    </div>
  )
}
