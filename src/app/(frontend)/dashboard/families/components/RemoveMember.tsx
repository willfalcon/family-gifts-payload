// import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

// import { removeMember } from '../[id]/actions';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Family, FamilyMember } from '@/types/family'
import { useFamily } from '@/hooks/use-family'
import { removeMember } from './functions'

type Props = {
  familyId: Family['id']
  member: FamilyMember
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  triggerButton: React.ReactNode
}
export default function RemoveMember({ familyId, member, open, setOpen, triggerButton }: Props) {
  const { data: family } = useFamily(familyId)
  const queryClient = useQueryClient()
  const removeMutation = useMutation({
    mutationFn: async (family: Family) => {
      return await removeMember(family, member.id)
    },
    onSuccess: (updatedFamily) => {
      queryClient.setQueryData(['family', { id: familyId }], updatedFamily)
      queryClient.setQueryData(['family-members', { id: familyId }], updatedFamily.members)
      toast.success('Member removed')
      setOpen(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    },
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {member.name} from this family? They will no longer have
            access to family events and wish lists.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {family && (
            <Button
              variant="destructive"
              onClick={() => {
                removeMutation.mutate(family)
              }}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Offing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
