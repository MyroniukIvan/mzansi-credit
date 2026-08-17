import { InstallmentStatus } from 'shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const INSTALLMENT_STATUS_LABELS: Record<InstallmentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
}

const INSTALLMENT_STATUS_TONES: Record<InstallmentStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-brand-teal text-brand-teal-foreground',
  overdue: 'bg-destructive/10 text-destructive',
}

interface InstallmentStatusBadgeProps {
  status: InstallmentStatus
}

export function InstallmentStatusBadge({
  status,
}: InstallmentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('border-transparent', INSTALLMENT_STATUS_TONES[status])}
    >
      {INSTALLMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
