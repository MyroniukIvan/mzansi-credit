import { ApplicationStatus } from 'shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  scoring: 'Scoring',
  manual_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
  active: 'Active',
  closed: 'Closed',
  defaulted: 'Defaulted',
}

const STATUS_TONES: Record<ApplicationStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-accent text-accent-foreground',
  scoring: 'bg-accent text-accent-foreground',
  manual_review: 'bg-brand-gold-soft text-brand-ink',
  approved: 'bg-brand-teal text-brand-teal-foreground',
  rejected: 'bg-destructive/10 text-destructive',
  disbursed: 'bg-brand-teal text-brand-teal-foreground',
  active: 'bg-brand-teal text-brand-teal-foreground',
  closed: 'bg-muted text-muted-foreground',
  defaulted: 'bg-destructive/10 text-destructive',
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('border-transparent', STATUS_TONES[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
