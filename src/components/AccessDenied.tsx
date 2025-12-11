import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

interface AccessDeniedProps {
  title?: string
  description?: string
  backLink?: string
  backLinkLabel?: string
}

export function AccessDenied({
  title = 'Access Denied',
  description = "You don't have permission to access this resource. If you believe this is a mistake, contact the owner or try accessing it with a different account.",
  backLink = '/dashboard',
  backLinkLabel = 'Back to Dashboard',
}: AccessDeniedProps) {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-screen">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <Lock className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">{description}</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={backLink}>{backLinkLabel}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Home</Link>
        </Button>
      </div>
    </div>
  )
}
