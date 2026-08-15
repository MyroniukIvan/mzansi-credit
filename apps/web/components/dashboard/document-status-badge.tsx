import { DocumentStatus } from 'shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: 'Pending',
  verified: 'Verified',
  rejected: 'Rejected',
}

const STATUS_TONES: Record<DocumentStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  verified: 'bg-brand-teal text-brand-teal-foreground',
  rejected: 'bg-destructive/10 text-destructive',
}

interface DocumentStatusBadgeProps {
  status: DocumentStatus
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('border-transparent', STATUS_TONES[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
