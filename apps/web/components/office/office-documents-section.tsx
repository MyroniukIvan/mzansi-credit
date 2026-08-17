'use client'

import { DocumentRow } from '@/components/office/document-row'
import { useOfficeApplication } from '@/features/office/use-office'

interface OfficeDocumentsSectionProps {
  id: string
}

export function OfficeDocumentsSection({ id }: OfficeDocumentsSectionProps) {
  const { data: application, isPending, isError } = useOfficeApplication(id)

  if (isPending) {
    return <div className="h-32 animate-pulse rounded-2xl bg-muted" />
  }

  if (isError || !application) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        Could not load documents for this application.
      </div>
    )
  }

  if (application.documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        No documents uploaded yet.
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {application.documents.map((document) => (
        <DocumentRow key={document.id} applicationId={id} document={document} />
      ))}
    </ul>
  )
}
