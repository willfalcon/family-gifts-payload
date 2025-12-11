import { getPayload, getUser } from '@/lib/server-utils'
import { redirect } from 'next/navigation'

export default async function TestPage() {
  const user = await getUser()
  if (!user) {
    redirect('/sign-in?redirectTo=/test')
  }
  const payload = await getPayload()

  // Test with access control enabled (overrideAccess: false)
  // This uses the exact query from List.ts access control
  const lists = await payload.find({
    collection: 'list',
    overrideAccess: false,
    user,
  })

  console.log('Lists:', lists.docs)

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  )
}
