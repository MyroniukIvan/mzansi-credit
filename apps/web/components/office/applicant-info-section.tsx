import { estimateMonthlyPaymentCents } from 'shared'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { formatRand } from '@/lib/currency'
import { useOfficeApplication } from '@/features/office/use-office'

const CENTS_PER_RAND = 100

interface ApplicantInfoSectionProps {
  id: string
}

export function ApplicantInfoSection({ id }: ApplicantInfoSectionProps) {
  const { data: application, isPending, isError } = useOfficeApplication(id)

  if (isPending) {
    return <div className="h-56 animate-pulse rounded-2xl bg-muted" />
  }

  if (isError || !application) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Could not load this application. Please try again later.
      </div>
    )
  }

  const { personal } = application

  const netIncomeCents =
    personal.incomeCents !== null && personal.expensesCents !== null
      ? personal.incomeCents - personal.expensesCents
      : null

  const estimatedInstallmentCents = estimateMonthlyPaymentCents({
    principalCents: application.amountCents,
    termMonths: application.termMonths,
    monthlyInterestBps: application.product.monthlyInterestBps,
    monthlyServiceFeeCents: application.product.monthlyServiceFeeCents,
  })

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 text-sm">
        <div>
          <dt className="text-muted-foreground">Applicant</dt>
          <dd className="font-medium text-foreground">
            {application.applicant.name}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium text-foreground">
            {application.applicant.email}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium text-foreground">
            {formatRand(application.amountCents / CENTS_PER_RAND)}
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
        <div>
          <dt className="text-muted-foreground">Estimated installment</dt>
          <dd className="font-medium text-foreground">
            {formatRand(estimatedInstallmentCents / CENTS_PER_RAND)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">SA ID number</dt>
          <dd className="font-medium text-foreground">
            {personal.idNumber ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-medium text-foreground">
            {personal.phone ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Address</dt>
          <dd className="font-medium text-foreground">
            {personal.address ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Employer</dt>
          <dd className="font-medium text-foreground">
            {personal.employer ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Monthly income</dt>
          <dd className="font-medium text-foreground">
            {personal.incomeCents !== null
              ? formatRand(personal.incomeCents / CENTS_PER_RAND)
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Monthly expenses</dt>
          <dd className="font-medium text-foreground">
            {personal.expensesCents !== null
              ? formatRand(personal.expensesCents / CENTS_PER_RAND)
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Net monthly income</dt>
          <dd className="font-medium text-foreground">
            {netIncomeCents !== null
              ? formatRand(netIncomeCents / CENTS_PER_RAND)
              : '—'}
          </dd>
        </div>
        {application.score !== null && (
          <div>
            <dt className="text-muted-foreground">Score</dt>
            <dd className="font-medium text-foreground">{application.score}</dd>
          </div>
        )}
      </dl>
      {application.decisionReason && (
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm">
          <p className="font-medium text-foreground">Decision notes</p>
          <p className="mt-1 text-muted-foreground">
            {application.decisionReason}
          </p>
        </div>
      )}
    </div>
  )
}
