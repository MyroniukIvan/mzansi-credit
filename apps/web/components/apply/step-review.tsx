'use client'

import { useState } from 'react'
import { ApplicationInput } from 'shared'
import { Button } from '@/components/ui/button'
import { formatRand } from '@/lib/currency'

interface StepReviewProps {
  draft: ApplicationInput
  onBack: () => void
}

async function handleApplicationSubmit(
  values: ApplicationInput
): Promise<void> {
  // TODO: submit application to the applications API
}

export function StepReview({ draft, onBack }: StepReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const summaryRows = [
    { label: 'Loan amount', value: formatRand(draft.amount) },
    { label: 'Term', value: `${draft.termMonths} months` },
    { label: 'SA ID number', value: draft.idNumber },
    { label: 'Phone number', value: draft.phone },
    { label: 'Residential address', value: draft.address },
    { label: 'Employer', value: draft.employer },
    { label: 'Gross monthly income', value: formatRand(draft.monthlyIncome) },
    {
      label: 'Monthly expenses',
      value: formatRand(draft.monthlyExpenses),
    },
  ]

  async function handleSubmitClick() {
    setIsSubmitting(true)
    await handleApplicationSubmit(draft)
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-medium text-foreground">
          Review your application
        </h2>
        <p className="text-sm text-muted-foreground">
          Check everything below before you submit.
        </p>
      </div>

      <dl className="flex flex-col gap-3">
        {summaryRows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-border/70 pb-3 text-sm"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Submit application'}
        </Button>
      </div>
    </div>
  )
}
