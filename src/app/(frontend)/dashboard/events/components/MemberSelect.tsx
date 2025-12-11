import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { useFamilies } from '@/hooks/use-families'
import { Media } from '@/payload-types'
import { Controller, useFormContext } from 'react-hook-form'
import UserCheckbox from './UserCheckbox'

export default function MemberSelect() {
  const { data: families, isLoading: familiesLoading } = useFamilies()

  const form = useFormContext()
  const familyValue = form.watch('family')
  const family = families?.find((f) => f.id === familyValue)

  const checkAll = () => {
    form.setValue('attendees', family?.members.map((member) => member.id) || [])
  }

  return (
    family && (
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="mb-4" onClick={checkAll} type="button">
          Check All in Family
        </Button>

        <Controller
          control={form.control}
          name="attendees"
          render={({ field, fieldState }) => (
            <Field>
              <div className="space-y-5">
                {family.members.map((member) => (
                  <UserCheckbox key={member.id} user={member} />
                ))}
              </div>
            </Field>
          )}
        />
      </div>
    )
  )
}
