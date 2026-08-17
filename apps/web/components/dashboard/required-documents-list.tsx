'use client'

import { toast } from 'sonner'
import { DOCUMENT_TYPES, DocumentType } from 'shared'
import {
  useDocuments,
  useUploadDocument,
} from '@/features/documents/use-documents'
import { DocumentStatusBadge } from '@/components/dashboard/document-status-badge'
import { DocumentUploadDropzone } from '@/components/dashboard/document-upload-dropzone'

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  sa_id: 'SA ID document',
  proof_of_income: 'Proof of income',
}

export function RequiredDocumentsList() {
  const { data: documents, isPending } = useDocuments()
  const uploadDocument = useUploadDocument()

  function handleFileSelected(file: File, type: DocumentType) {
    uploadDocument.mutate(
      { file, type },
      {
        onSuccess: () => toast.success('Document uploaded'),
        onError: () =>
          toast.error('Could not upload document. Please try again.'),
      }
    )
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {DOCUMENT_TYPES.map((type) => {
        const document = documents?.find((item) => item.type === type)
        const isUploadingThisType =
          uploadDocument.isPending && uploadDocument.variables?.type === type

        return (
          <li
            key={type}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">
                {DOCUMENT_LABELS[type]}
              </span>
              {document && <DocumentStatusBadge status={document.status} />}
            </div>
            {document?.status === 'rejected' && document.rejectionReason && (
              <p className="text-xs text-destructive">
                {document.rejectionReason}
              </p>
            )}
            {document && (
              <a
                href={document.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="self-start text-xs font-medium text-brand-ink underline underline-offset-2"
              >
                View uploaded file
              </a>
            )}
            {(!document || document.status === 'rejected') && (
              <DocumentUploadDropzone
                documentType={type}
                isUploading={isUploadingThisType}
                onFileSelected={handleFileSelected}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
