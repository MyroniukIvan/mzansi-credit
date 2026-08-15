import { SectionHeading } from '@/components/landing/section-heading'
import { LandingSectionIds } from '@/components/landing/section-ids'
import { formatRand } from '@/lib/currency'
import { calculateLoanQuote } from '@/lib/loan-calculator'

const EXAMPLE_LOAN_AMOUNT = 3000
const EXAMPLE_LOAN_TERM_MONTHS = 3

export function RatesSection() {
  const quote = calculateLoanQuote(
    EXAMPLE_LOAN_AMOUNT,
    EXAMPLE_LOAN_TERM_MONTHS
  )

  const rows = [
    { label: 'Loan amount', value: formatRand(quote.principal) },
    {
      label: 'Initiation fee (once-off, regulated cap)',
      value: formatRand(quote.initiationFee),
    },
    {
      label: `Monthly service fee × ${quote.termMonths}`,
      value: formatRand(quote.serviceFees),
    },
    {
      label: 'Interest over the term',
      value: formatRand(quote.interest),
    },
  ]

  return (
    <section
      id={LandingSectionIds.RATES}
      className="mx-auto w-full max-w-6xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading
          eyebrow="Rates & terms"
          title="One honest example, worked out in full"
          description="This is exactly how we'd break down a real loan — every cost named, nothing rounded away. Your own quote will reflect your amount, term, and affordability assessment."
        />

        <div className="overflow-hidden rounded-3xl bg-brand-ink text-brand-ink-foreground">
          <div className="flex items-center justify-between px-7 pt-7">
            <p className="font-heading text-lg font-medium">
              {formatRand(EXAMPLE_LOAN_AMOUNT)} over {EXAMPLE_LOAN_TERM_MONTHS}{' '}
              months
            </p>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-brand-gold uppercase">
              Example
            </span>
          </div>

          <dl className="mt-6 flex flex-col gap-3 px-7">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 text-sm"
              >
                <dt className="text-white/60">{row.label}</dt>
                <dd className="font-medium whitespace-nowrap text-white">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mx-7 mt-2 flex items-baseline justify-between gap-4 rounded-2xl bg-white/5 p-5">
            <dt className="text-sm text-white/70">Total repayable</dt>
            <dd className="font-heading text-2xl font-medium text-brand-gold">
              {formatRand(quote.totalRepayable)}
            </dd>
          </div>

          <div className="flex items-baseline justify-between gap-4 px-7 pt-4 pb-7 text-sm">
            <dt className="text-white/60">Fixed monthly installment</dt>
            <dd className="font-medium text-white">
              {formatRand(quote.monthlyInstallment)}
            </dd>
          </div>
        </div>
      </div>
    </section>
  )
}
