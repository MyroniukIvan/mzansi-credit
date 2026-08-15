import { DocumentStatus } from 'shared'
import { DocumentStatusBadge } from '@/components/dashboard/document-status-badge'

interface RequiredDocument {
  id: string
  label: string
  status: DocumentStatus
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  { id: 'sa-id', label: 'SA ID document', status: 'pending' },
  { id: 'proof-of-income', label: 'Proof of income', status: 'pending' },
]

export function RequiredDocumentsList() {
  return (
    <ul className="flex flex-col gap-3">
      {REQUIRED_DOCUMENTS.map((document) => (
        <li
          key={document.id}
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
        >
          <span className="text-sm font-medium text-foreground">
            {document.label}
          </span>
          <DocumentStatusBadge status={document.status} />
        </li>
      ))}
    </ul>
  )
}
