'use client'

import { useEffect, useState } from 'react'
import {
  ApplicationAmountTermInput,
  ApplicationIncomeExpensesInput,
  ApplicationInput,
  ApplicationPersonalDetailsInput,
} from 'shared'
import { Stepper } from '@/components/apply/stepper'
import { StepAmountTerm } from '@/components/apply/step-amount-term'
import { StepPersonalDetails } from '@/components/apply/step-personal-details'
import { StepIncomeExpenses } from '@/components/apply/step-income-expenses'
import { StepReview } from '@/components/apply/step-review'
import {
  saveApplicationDraft,
  StoredApplicationDraft,
} from '@/features/applications/application-draft-storage'

const STEP_LABELS = [
  'Amount & term',
  'Personal details',
  'Income & expenses',
  'Review & submit',
]

type ApplicationDraft = Partial<ApplicationInput>

interface ApplicationWizardStepsProps {
  initialState: StoredApplicationDraft | null
}

export function ApplicationWizardSteps({
  initialState,
}: ApplicationWizardStepsProps) {
  const [stepIndex, setStepIndex] = useState(initialState?.stepIndex ?? 0)
  const [draft, setDraft] = useState<ApplicationDraft>(
    initialState?.draft ?? {}
  )

  useEffect(() => {
    saveApplicationDraft({ stepIndex, draft })
  }, [stepIndex, draft])

  function handleAmountTermNext(values: ApplicationAmountTermInput) {
    setDraft((prev) => ({ ...prev, ...values }))
    setStepIndex((index) => index + 1)
  }

  function handlePersonalDetailsNext(values: ApplicationPersonalDetailsInput) {
    setDraft((prev) => ({ ...prev, ...values }))
    setStepIndex((index) => index + 1)
  }

  function handleIncomeExpensesNext(values: ApplicationIncomeExpensesInput) {
    setDraft((prev) => ({ ...prev, ...values }))
    setStepIndex((index) => index + 1)
  }

  function handleStepBack() {
    setStepIndex((index) => Math.max(0, index - 1))
  }

  return (
    <div className="flex flex-col gap-8">
      <Stepper steps={STEP_LABELS} currentStepIndex={stepIndex} />

      {stepIndex === 0 && (
        <StepAmountTerm defaultValues={draft} onNext={handleAmountTermNext} />
      )}

      {stepIndex === 1 && (
        <StepPersonalDetails
          defaultValues={draft}
          onNext={handlePersonalDetailsNext}
          onBack={handleStepBack}
        />
      )}

      {stepIndex === 2 && (
        <StepIncomeExpenses
          defaultValues={draft}
          onNext={handleIncomeExpensesNext}
          onBack={handleStepBack}
        />
      )}

      {stepIndex === 3 && (
        <StepReview draft={draft as ApplicationInput} onBack={handleStepBack} />
      )}
    </div>
  )
}
