'use client'

import { AlertCircleIcon, ArrowLeft, Loader2, RefreshCw, Shuffle } from 'lucide-react'

import { formatCurrency, formatDate } from '@/lib/utils'
import { useSecretSantaStore } from './store'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTabs } from '@/components/ui/tabs'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
// import { sendSecretSantaNotifications } from '../actions';
import { Event } from '@/types/event'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useSecretSantaNotification } from './functions'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'

type Props = {
  event: Event
}

export default function Review({ event }: Props) {
  const {
    budget,
    participants,
    exclusions,
    assignments,
    generateAssignments,
    resetAssignments,
    showAssignments,
    setShowAssignments,
  } = useSecretSantaStore()
  const { setValue } = useTabs()
  const notificationMutation = useSecretSantaNotification()
  const [resend, setResend] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Generate Assignments</CardTitle>
        <CardDescription>Review your Secret Santa setup and generate assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Settings</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span>{formatCurrency(budget)}</span>
              </div>
              {event.date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Date:</span>
                  <span>{formatDate(event.date)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants:</span>
                <span>{participants.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exclusions:</span>
                <span>{exclusions.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => {
                return (
                  participant && (
                    <Badge key={participant.id} variant="outline">
                      {participant.user?.name || participant.email}
                    </Badge>
                  )
                )
              })}
            </div>
          </div>
        </div>

        <Separator />

        <div className="">
          <h3 className="font-medium mb-4">Assignments</h3>

          {participants.length < 2 ? (
            <div className="p-4 bg-muted rounded-md text-center">
              <p>Please select at least two participants to generate assignments.</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-4 bg-muted rounded-md text-center">
              <p>
                No assignments generated yet. Click the button below to generate random assignments.
              </p>
              <Button className="mt-4" onClick={() => generateAssignments(event)}>
                <Shuffle className="mr-2 h-4 w-4" />
                Generate Assignments
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {assignments.length} Assignments
                  </Badge>
                  {showAssignments ? (
                    <Button variant="ghost" size="sm" onClick={() => setShowAssignments(false)}>
                      Hide Assignments
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setShowAssignments(true)}>
                      Show Assignments
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Regenerate Assignments?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will create new random assignments. Any existing assignments will be
                          lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => generateAssignments(event)}>
                          Regenerate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Assignments?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all assignments. You'll need to generate new ones.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => resetAssignments(event)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {showAssignments && (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Giver</TableHead>
                        <TableHead>Receiver</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment, index) => {
                        const { giver, receiver } = assignment

                        return (
                          giver &&
                          receiver && (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={giver.user?.avatar?.thumbnailURL || undefined}
                                      alt={giver.user?.name || giver.email}
                                    />
                                    <AvatarFallback>
                                      {(giver.user?.name || giver.email)
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{giver.user?.name || giver.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={receiver.user?.avatar?.thumbnailURL || undefined}
                                      alt={receiver.user?.name || receiver.email}
                                    />
                                    <AvatarFallback>
                                      {(receiver.user?.name || receiver.email)
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {receiver.user?.name || receiver.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
              {!event.secretSantaNotificationsSent ? (
                <Button
                  onClick={() => notificationMutation.mutate(event)}
                  className="mt-4"
                  disabled={notificationMutation.isPending}
                >
                  {notificationMutation.isPending ? (
                    <>
                      <Spinner />
                      Sending...
                    </>
                  ) : (
                    'Send Notifications'
                  )}
                </Button>
              ) : (
                <AlertDialog open={resend} onOpenChange={setResend}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Resend Notifications
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Resend Notifications?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You've already sent notifications once. Do you want to send them again?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        onClick={async (e) => {
                          e.preventDefault()
                          await notificationMutation.mutateAsync(event)
                          setResend(false)
                        }}
                        type="button"
                      >
                        {notificationMutation.isPending ? (
                          <>
                            <Spinner />
                            Resending...
                          </>
                        ) : (
                          'Resend Notifications'
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setValue('exclusions')}>
          <ArrowLeft className="w-4 h-4" />
          Exclusions
        </Button>
      </CardFooter>
    </Card>
  )
}
