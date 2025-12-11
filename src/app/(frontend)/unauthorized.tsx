import { AccessDenied } from '@/components/AccessDenied'

export default function Unauthorized() {
  return (
    <AccessDenied
      title="Access Denied"
      description="You don't have permission to access this resource. If you believe this is a mistake, contact the family owner or administrator."
      backLink="/dashboard"
      backLinkLabel="Back to Dashboard"
    />
  )
}
