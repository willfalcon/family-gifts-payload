import { useQuery } from '@tanstack/react-query'
import { Check, CheckCheck, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
// import { Family } from '@prisma/client';
// import { getFamilies } from '../actions';

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFamilies } from '@/hooks/use-families'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

type FamilyOption = {
  relationTo: 'family'
  value: string
}

export default function FamiliesField() {
  const form = useFormContext()
  const { data: families, isLoading } = useFamilies()

  return (
    <Controller
      control={form.control}
      name="visibleToFamilies"
      render={({ field }) => {
        return (
          <Field>
            <FieldLabel>Families</FieldLabel>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                  tabIndex={0}
                >
                  {field.value.length > 0
                    ? `Shared with ${field.value.length} ${field.value.length > 1 ? 'families' : 'family'}`
                    : 'Select families'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search families..." />
                  <CommandList>
                    <CommandEmpty>No families found.</CommandEmpty>
                    <CommandGroup>
                      {isLoading && <Loader2 className="w-full my-5 animate-spin" />}
                      {families?.map((family) => (
                        <CommandItem
                          key={family.id}
                          onSelect={() => {
                            const current = field.value
                            form.setValue(
                              'visibleToFamilies',
                              current.includes(family.id)
                                ? current.filter((v: string) => v !== family.id)
                                : [...current, family.id],
                            )
                          }}
                        >
                          <CheckCheck
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value.includes(family.id) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {family.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {/* )} */}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Members of these families will be able to view this list and mark things as bought.
            </FormDescription>
          </Field>
        )
      }}
    />
  )
}

// <Field
//   control={form.control}
//   name="visibleToFamilies"
//   render={({ field }) => {
//     return (
//       <FormItem className="grid gap-2 w-72">
//         <FormLabel className="block">Families</FormLabel>
//         <Popover>
//           <PopoverTrigger asChild>
//             <FormControl>
//               <Button
//                 variant="outline"
//                 role="combobox"
//                 className={cn('justify-between', !field.value && 'text-muted-foreground')}
//                 // tabIndex={0}
//               >
//                 {field.value.length > 0
//                   ? `Shared with ${field.value.length} ${field.value.length > 1 ? 'families' : 'family'}`
//                   : 'Select families'}
//                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//               </Button>
//             </FormControl>
//           </PopoverTrigger>
//           <PopoverContent className="p-0">
//             <Command>
//               <CommandInput placeholder="Search families..." />
//               <CommandList>
//                 <CommandEmpty>No families found.</CommandEmpty>
//                 <CommandGroup>
//                   {isLoading && <Loader2 className="w-full my-5 animate-spin" />}
//                   {families?.map((family) => (
//                     <CommandItem
//                       key={family.id}
//                       onSelect={() => {
//                         const current = field.value
//                         const value = family.id
//                         form.setValue(
//                           'visibleTo',
//                           current.includes(value)
//                             ? current.filter((v: string) => v !== value)
//                             : [...current, value],
//                         )
//                       }}
//                     >
//                       <Check
//                         className={cn(
//                           'mr-2 h-4 w-4',
//                           field.value.includes(family.id) ? 'opacity-100' : 'opacity-0',
//                         )}
//                       />
//                       {family.name}
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//                 {/* )} */}
//               </CommandList>
//             </Command>
//           </PopoverContent>
//         </Popover>
//         <FormDescription>
//           Members of these families will be able to view this list and mark things as bought.
//         </FormDescription>
//       </FormItem>
//     )
//   }}
// />
//   )
// }
