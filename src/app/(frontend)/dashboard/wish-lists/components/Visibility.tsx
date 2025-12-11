import { Globe, LinkIcon, Lock, Users } from 'lucide-react'
import { FormEvent } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import FamiliesField from './FamiliesField'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import UsersField from './UsersField'

// import EventsField from './EventsField'
// import FamiliesField from './FamiliesField'
// import UsersField from './UsersField'

export default function Visibility() {
  const form = useFormContext()

  const shareLinkId = form.getValues('shareLink')

  const shareLink = process.env.NEXT_PUBLIC_FRONTEND_URL + '/list/' + shareLinkId
  const copyShareLink = (e: FormEvent) => {
    e.preventDefault()
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        console.log('Link copied to clipboard')
        toast.success('Link copied to clipboard')
      })
      .catch((err) => {
        toast.error('Failed to copy link')
        console.error('Failed to copy link: ', err)
      })
  }

  const visibileViaLinkValue = form.watch('visibibleViaLink')
  // TODO: add a way to handle accessibility of list via view links
  // TODO: lists should be able to be visible via link and to specific people and groups
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility</CardTitle>
        <CardDescription>Control who can see your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          control={form.control}
          name="visibilityType"
          render={({ field, fieldState }) => {
            return (
              <Field>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />

                    <div className="grid gap-1.5 w-full">
                      <FieldLabel htmlFor="private" className="cursor-pointer space-y-2">
                        <div className="font-medium flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Private
                        </div>
                        <FieldDescription>Only you can see this wish list</FieldDescription>
                      </FieldLabel>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />

                    <div className="grid gap-1.5 w-full">
                      <FieldLabel htmlFor="public" className="cursor-pointer space-y-2">
                        <div className="font-medium flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Public
                        </div>
                        <FieldDescription>Anyone can find and view this wish list</FieldDescription>
                      </FieldLabel>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific" />

                    <div className="grid gap-1.5 w-full pointer">
                      <FieldLabel htmlFor="specific" className="cursor-pointer space-y-2">
                        <div className="font-medium flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Specific people and groups
                        </div>
                        <FieldDescription>
                          Only selected families, events, and individuals can view this wish list
                        </FieldDescription>
                      </FieldLabel>
                    </div>
                  </div>
                  {field.value === 'specific' && (
                    <div className="space-y-4 mt-2 ml-5">
                      <FamiliesField />
                      {/* <EventsField /> */}
                      <UsersField />
                    </div>
                  )}
                </RadioGroup>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )
          }}
        />
        <Controller
          control={form.control}
          name="visibibleViaLink"
          render={({ field, fieldState }) => {
            return (
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <div className="grid gap-1.5 w-full">
                  <FieldLabel className="cursor-pointer space-y-2">
                    <div className="font-medium flex items-center">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Anyone with the link
                    </div>
                    <FieldDescription>Anyone with the link can see this wish list</FieldDescription>
                  </FieldLabel>
                </div>
                <FieldError errors={[fieldState.error]} />
              </div>
            )
          }}
        />
        {visibileViaLinkValue && (
          <div className="flex mt-2">
            <Input value={shareLink} readOnly className="rounded-r-none" />
            <Button onClick={copyShareLink} className="rounded-l-none" variant="secondary">
              Copy
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
