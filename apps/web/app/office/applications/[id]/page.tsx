import type { Metadata } from 'next'
import { ApplicantInfoSection } from '@/components/office/applicant-info-section'
import { OfficeDocumentsSection } from '@/components/office/office-documents-section'
import { DecisionPanel } from '@/components/office/decision-panel'

export const metadata: Metadata = {
  title: 'Back office',
}

export default async function OfficeApplicationDetailPage(
  props: PageProps<'/office/applications/[id]'>
) {
  const { id } = await props.params

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Application
        </p>
        <h1 className="font-heading text-2xl font-medium text-foreground">
          {id}
        </h1>
      </div>
      <ApplicantInfoSection id={id} />
      <OfficeDocumentsSection id={id} />
      <DecisionPanel id={id} />
    </div>
  )
}
