import { ApplicationSummary } from 'shared'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { formatRand } from '@/lib/currency'

interface ApplicantInfoSectionProps {
  application?: ApplicationSummary
}

export function ApplicantInfoSection({
  application,
}: ApplicantInfoSectionProps) {
  if (!application) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Applicant details will appear here once this application is connected to
        real data.
      </div>
    )
  }

  return (
    <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 text-sm">
      <div>
        <dt className="text-muted-foreground">Applicant</dt>
        <dd className="font-medium text-foreground">
          {application.applicantName}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Amount</dt>
        <dd className="font-medium text-foreground">
          {formatRand(application.amount)}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Term</dt>
        <dd className="font-medium text-foreground">
          {application.termMonths} months
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Status</dt>
        <dd>
          <ApplicationStatusBadge status={application.status} />
        </dd>
      </div>
    </dl>
  )
}
