import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFamily } from '@/hooks/use-family'
import { promoteMember, demoteMember } from './functions'
import { Family } from '@/types/family'
import { User } from '@/types/user'

type Props = {
  isManager: boolean
  familyId: string
  memberId: string
  setChangingRole: Dispatch<SetStateAction<boolean>>
}

export default function PromoteDemote({ isManager, familyId, memberId, setChangingRole }: Props) {
  const { data: family } = useFamily(familyId)

  const queryClient = useQueryClient()
  const promoteMutation = useMutation({
    mutationFn: async ({ family, memberId }: { family: Family; memberId: User['id'] }) => {
      return await promoteMember(family, memberId)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['family', { id: familyId }], data)
      toast.success('Member role updated')
      setChangingRole(false)
    },
    onError: (error) => {
      // console.error(error);
      toast.error(error.message)
      setChangingRole(false)
    },
  })
  const demoteMutation = useMutation({
    mutationFn: async ({ family, memberId }: { family: Family; memberId: User['id'] }) => {
      return await demoteMember(family, memberId)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['family', { id: familyId }], data)
      toast.success('Member role updated')
      setChangingRole(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
      setChangingRole(false)
    },
  })
  if (!family) return null
  return isManager ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setChangingRole(true)
              demoteMutation.mutate({ family, memberId })
            }}
            disabled={demoteMutation.isPending}
          >
            {demoteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Demoting
              </>
            ) : (
              'Remove Admin'
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Demote to regular member</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setChangingRole(true)
              promoteMutation.mutate({ family, memberId })
            }}
            disabled={promoteMutation.isPending}
          >
            {promoteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Promoting
              </>
            ) : (
              'Make Admin'
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Promote to admin role</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
