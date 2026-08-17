'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { formatRand } from '@/lib/currency'
import { InstallmentStatusBadge } from '@/components/dashboard/installment-status-badge'
import {
  LoanInstallmentDetail,
  usePayInstallment,
} from '@/features/loans/use-loans'

const CENTS_PER_RAND = 100

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface ScheduleRowProps {
  loanId: string
  installment: LoanInstallmentDetail
  isPayable: boolean
}

export function ScheduleRow({
  loanId,
  installment,
  isPayable,
}: ScheduleRowProps) {
  const payInstallment = usePayInstallment()
  const totalCents =
    installment.principalCents +
    installment.interestCents +
    installment.feeCents

  function handlePayClick() {
    payInstallment.mutate(
      { loanId, sequence: installment.sequence },
      {
        onSuccess: () => toast.success('Installment paid'),
        onError: () =>
          toast.error('Could not process payment. Please try again.'),
      }
    )
  }

  return (
    <tr className="border-b border-border/70 last:border-0">
      <td className="px-4 py-3 font-medium text-foreground">
        {installment.sequence}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {formatDate(installment.dueDate)}
      </td>
      <td className="px-4 py-3">
        {formatRand(installment.principalCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3">
        {formatRand(installment.interestCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3">
        {formatRand(installment.feeCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3 font-medium text-foreground">
        {formatRand(totalCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3">
        <InstallmentStatusBadge status={installment.status} />
      </td>
      <td className="px-4 py-3 text-right">
        {installment.status === 'paid' ? (
          <span className="text-xs text-muted-foreground">
            {installment.paidAt ? formatDate(installment.paidAt) : ''}
          </span>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={handlePayClick}
            disabled={!isPayable || payInstallment.isPending}
          >
            {payInstallment.isPending ? 'Paying…' : 'Pay'}
          </Button>
        )}
      </td>
    </tr>
  )
}
