import { ApplicationSummary } from 'shared'
import { Card, CardContent } from '@/components/ui/card'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { formatRand } from '@/lib/currency'

interface ApplicationCardProps {
  application: ApplicationSummary
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-lg font-medium text-foreground">
            {formatRand(application.amount)} · {application.termMonths} months
          </p>
          <p className="text-xs text-muted-foreground">
            Submitted {application.submittedAt}
          </p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </CardContent>
    </Card>
  )
}
