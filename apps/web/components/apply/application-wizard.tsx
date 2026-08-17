'use client'

import { ApplicationWizardSteps } from '@/components/apply/application-wizard-steps'
import { readApplicationDraft } from '@/features/applications/application-draft-storage'
import { useIsHydrated } from '@/lib/use-is-hydrated'

export function ApplicationWizard() {
  const isHydrated = useIsHydrated()

  if (!isHydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-muted" />
  }

  return <ApplicationWizardSteps initialState={readApplicationDraft()} />
}
