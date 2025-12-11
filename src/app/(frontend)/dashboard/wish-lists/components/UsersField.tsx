import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
// import { User } from '@prisma/client'
// import { getRelatedUsers } from '../actions'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { client } from '@/lib/payload-client'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { User } from '@/payload-types'

export default function UsersField() {
  const form = useFormContext()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return client.find({
        collection: 'users',
      })
    },
  })

  return (
    <Controller
      control={form.control}
      name="visibleToUsers"
      render={({ field, fieldState }) => {
        return (
          <Field className="grid gap-2 w-72">
            <FieldLabel className="block">Users</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                  // tabIndex={0}
                >
                  {field.value.length > 0
                    ? `Shared with ${field.value.length} ${field.value.length > 1 ? 'users' : 'user'}`
                    : 'Select users'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {isLoading && <Loader2 className="w-full my-5 animate-spin" />}
                      {users?.docs?.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            const current = field.value
                            const value = user.id
                            form.setValue(
                              'visibleToUsers',
                              current.includes(user.id)
                                ? current.filter((v: string) => v !== user.id)
                                : [...current, user.id],
                            )
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value.includes(user.id) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {/* )} */}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FieldDescription>
              These users will be able to view this list and mark things as bought.
            </FieldDescription>
          </Field>
        )
      }}
    />
  )
}
