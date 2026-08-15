import type { Metadata } from 'next'
import { ApplicationWizard } from '@/components/apply/application-wizard'

export const metadata: Metadata = {
  title: 'Apply for a loan',
}

export default function ApplyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-medium text-foreground">
          Apply for a loan
        </h1>
        <p className="text-muted-foreground">
          It takes about ten minutes. You can go back and change anything before
          you submit.
        </p>
      </div>
      <ApplicationWizard />
    </div>
  )
}
