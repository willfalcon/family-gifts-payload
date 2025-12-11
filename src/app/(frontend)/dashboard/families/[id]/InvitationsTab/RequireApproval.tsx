'use client'

import { Switch } from '@/components/ui/switch'
import { useFamily } from '@/hooks/use-family'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateFamilyPrivacy } from './functions'
import { Family as PayloadFamily } from '@/payload-types'

type Props = {
  family: PayloadFamily
}

export default function RequireApproval({ family: initialFamily }: Props) {
  const { data: family } = useFamily(initialFamily.id)
  const queryClient = useQueryClient()
  const { mutate: updateFamily, isPending } = useMutation({
    mutationFn: async ({
      familyId,
      requireApproval,
    }: {
      familyId: string
      requireApproval: boolean
    }) => {
      return await updateFamilyPrivacy(familyId, {
        requireApproval,
      })
    },
    onSuccess: (updatedFamily) => {
      queryClient.setQueryData(['family', { id: updatedFamily.id }], updatedFamily)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update family settings.')
    },
  })
  return (
    family && (
      <div className="flex items-center justify-between p-4 bg-muted rounded-md">
        <div>
          <h3 className="font-medium">Require Admin Approval</h3>
          <p className="text-sm text-muted-foreground">
            Require admin approval for new members not specifically invited.
          </p>
        </div>
        <Switch
          checked={family.requireApproval}
          onCheckedChange={() => {
            updateFamily({ familyId: family.id, requireApproval: !family.requireApproval })
          }}
          disabled={isPending}
        />
      </div>
    )
  )
}
