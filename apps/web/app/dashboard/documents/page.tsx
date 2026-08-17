import type { Metadata } from 'next'
import { RequiredDocumentsList } from '@/components/dashboard/required-documents-list'

export const metadata: Metadata = {
  title: 'Documents',
}

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Documents
        </h1>
        <p className="text-muted-foreground">
          Upload the documents we need to verify your identity and income.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          Required documents
        </h2>
        <RequiredDocumentsList />
      </div>
    </div>
  )
}
