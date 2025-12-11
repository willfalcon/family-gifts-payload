'use client'

import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { joinFamily } from './actions'

export default function JoinButton({
  familyId,
  familyName,
  userId,
}: {
  familyId: string
  familyName: string
  userId: string
}) {
  const router = useRouter()

  const { mutate: join, isPending } = useMutation({
    mutationFn: async () => {
      const res = await joinFamily(familyId)
      return res
    },
    onSuccess: () => {
      toast.success(`Welcome!`)
      router.push(`/dashboard/families/${familyId}`)
    },
    onError: (error) => {
      console.log(error)
      if (error.message === 'You are already a member of this family.') {
        router.push(`/dashboard/families/${familyId}`)
      } else {
        toast.error(error.message)
      }
    },
  })

  return (
    <Button
      onClick={() => {
        join()
      }}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Joining...
        </>
      ) : (
        'Join ' + familyName
      )}
    </Button>
  )
}
