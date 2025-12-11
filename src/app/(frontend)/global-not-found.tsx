import { AccessDenied } from '@/components/AccessDenied'

export default function NotFound() {
  return (
    <AccessDenied
      title="Global Page Not Found"
      description="The page you're looking for doesn't exist or has been removed. Check the URL and try again, or return to the dashboard."
      backLink="/dashboard"
      backLinkLabel="Back to Dashboard"
    />
  )
}
