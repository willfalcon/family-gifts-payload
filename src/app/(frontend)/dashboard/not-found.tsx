import { AccessDenied } from '@/components/AccessDenied'

export default function NotFound() {
  return (
    <AccessDenied
      title="Page Not Found"
      description="This either doesn't exist, or you don't have permission to access it."
      backLink="/dashboard"
      backLinkLabel="Dashboard"
    />
  )
}
