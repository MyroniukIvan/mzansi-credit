import type { Metadata } from 'next'
import { LoanDetail } from '@/components/dashboard/loan-detail'

export const metadata: Metadata = {
  title: 'Loan',
}

export default async function LoanDetailPage(
  props: PageProps<'/dashboard/loans/[id]'>
) {
  const { id } = await props.params

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Loan
        </p>
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Loan details
        </h1>
      </div>
      <LoanDetail id={id} />
    </div>
  )
}
