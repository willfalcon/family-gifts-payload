'use client'

import { ArrowLeft, ArrowRight, X } from 'lucide-react'

import { useSecretSantaStore } from './store'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTabs } from '@/components/ui/tabs'

type Props = {}

export default function Exclusions({}: Props) {
  const { participants, exclusions, addExclusion, removeExclusion, hasExclusion } =
    useSecretSantaStore()
  console.log(exclusions)
  const { setValue } = useTabs()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Exclusions</CardTitle>
        <CardDescription>Define who shouldn't be assigned to whom</CardDescription>
      </CardHeader>
      <CardContent>
        {participants.length < 2 ? (
          <div className="p-4 bg-muted rounded-md text-center">
            <p>Please select at least two participants to set up exclusions.</p>
          </div>
        ) : (
          <>
            {exclusions.length > 0 && (
              <div className="p-4 bg-muted rounded-md mb-4">
                <div className="font-medium mb-2">Current Exclusions</div>
                <div className="space-y-2">
                  {exclusions.map((exclusion) => {
                    const { from, to } = exclusion
                    return (
                      from &&
                      to && (
                        <div
                          key={`${from.id}-${to.id}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span>{from.user.name || from.email}</span>
                            <span>→</span>
                            <span>{to.user.name || to.email}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExclusion(from, to)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    )
                  })}
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">From ↓ To →</TableHead>
                  {participants.map((participant) => {
                    return (
                      participant && (
                        <TableHead key={participant.id} className="text-center">
                          <div className="flex flex-col items-center">
                            <Avatar className="h-8 w-8 mb-1">
                              <AvatarImage
                                src={participant.user?.avatar?.thumbnailURL || undefined}
                                alt={participant.user?.name || undefined}
                              />
                              <AvatarFallback>
                                {(participant.user.name || participant.email)
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">
                              {(participant.user.name || participant.email)?.split(' ')[0]}
                            </span>
                          </div>
                        </TableHead>
                      )
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((from) => {
                  return (
                    from && (
                      <TableRow key={from.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={from.user?.avatar?.thumbnailURL || undefined}
                                alt={from.user.name || undefined}
                              />
                              <AvatarFallback>
                                {(from.user.name || from.email)
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">
                              {(from.user.name || from.email)?.split(' ')[0]}
                            </span>
                          </div>
                        </TableCell>
                        {participants.map((to) => {
                          const isExcluded = hasExclusion(from, to)
                          const isSelf = from === to

                          return (
                            <TableCell key={to.id} className="text-center">
                              {isSelf ? (
                                <div className="h-6 w-6 mx-auto bg-muted rounded-md"></div>
                              ) : (
                                <Checkbox
                                  checked={isExcluded}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      addExclusion(from, to)
                                    } else {
                                      removeExclusion(from, to)
                                    }
                                  }}
                                />
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  )
                })}
              </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground mt-4">
              Check the boxes to indicate who shouldn't be assigned to whom. For example, if you
              check the box where "John" and "Sarah" intersect, John won't be assigned as Sarah's
              Secret Santa.
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={() => setValue('participants')}>
          <ArrowLeft className="w-4 h-4" />
          Participants
        </Button>
        <Button variant="outline" onClick={() => setValue('review')}>
          Next <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
