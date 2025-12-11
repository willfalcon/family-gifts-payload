import { ArrowLeft, ArrowRight } from 'lucide-react'

import { useSecretSantaStore } from './store'
import { Event } from '@/types/event'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useTabs } from '@/components/ui/tabs'

type Props = {
  event: Event
}

export default function Participants({ event }: Props) {
  const { participants, addParticipant, removeParticipant, setParticipants } = useSecretSantaStore()
  const { setValue } = useTabs()
  console.log(participants)
  function addAll() {
    setParticipants(event.invites.docs)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Participants</CardTitle>
        <CardDescription>Choose who will participate in the Secret Santa exchange</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => addAll()}>
            Select All
          </Button>
          {participants.length > 0 && (
            <div className="p-4 bg-muted rounded-md mb-4">
              <div className="font-medium mb-2">Selected Participants ({participants.length})</div>
              <div className="flex flex-wrap gap-2">
                {participants.map((participant) => {
                  return (
                    participant && (
                      <Badge
                        key={participant.id}
                        variant="secondary"
                        className="flex items-center gap-1 pl-1"
                      >
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage
                            src={participant.user?.avatar?.thumbnailURL || undefined}
                            alt={participant.user?.name || undefined}
                          />
                          <AvatarFallback className="text-[10px]">
                            {(participant.user.name || participant.user.email)
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {participant.user.name || participant.email}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
                          onClick={() => removeParticipant(participant)}
                        >
                          ×
                        </Button>
                      </Badge>
                    )
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {event.invites.docs.map((invite) => (
              <div key={invite.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`participant-${invite.id}`}
                  checked={participants.some((p) => p.id === invite.id)}
                  onCheckedChange={(checked) =>
                    checked ? addParticipant(invite) : removeParticipant(invite)
                  }
                />
                <div className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarImage
                      src={invite.user?.avatar?.thumbnailURL || undefined}
                      alt={invite.user?.name || undefined}
                    />
                    <AvatarFallback>
                      {(invite.user.name || invite.user.email)
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor={`participant-${invite.id}`}>
                      {invite.user.name || invite.user.email}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={() => setValue('setup')}>
          <ArrowLeft className="w-4 h-4" />
          Setup
        </Button>
        <Button variant="outline" onClick={() => setValue('exclusions')}>
          Next <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
