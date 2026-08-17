'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DocumentType } from 'shared'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DocumentStatusBadge } from '@/components/dashboard/document-status-badge'
import {
  OfficeDocument,
  useReviewDocument,
  useOfficeApplication,
} from '@/features/office/use-office'

const MIN_REJECTION_REASON_LENGTH = 3

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  sa_id: 'SA ID document',
  proof_of_income: 'Proof of income',
}

interface DocumentRowProps {
  applicationId: string
  document: OfficeDocument
}

function DocumentRow({ applicationId, document }: DocumentRowProps) {
  const [isRejecting, setIsRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const reviewDocument = useReviewDocument()

  function handleReasonChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setReason(event.target.value)
  }

  function handleVerifyClick() {
    reviewDocument.mutate(
      { documentId: document.id, applicationId, status: 'verified' },
      {
        onSuccess: () => toast.success('Document verified'),
        onError: () =>
          toast.error('Could not verify document. Please try again.'),
      }
    )
  }

  function handleRejectClick() {
    setIsRejecting(true)
  }

  function handleCancelRejectClick() {
    setIsRejecting(false)
    setReason('')
  }

  function handleConfirmRejectClick() {
    reviewDocument.mutate(
      { documentId: document.id, applicationId, status: 'rejected', reason },
      {
        onSuccess: () => {
          toast.success('Document rejected')
          setIsRejecting(false)
          setReason('')
        },
        onError: () =>
          toast.error('Could not reject document. Please try again.'),
      }
    )
  }

  const isReasonValid = reason.trim().length >= MIN_REJECTION_REASON_LENGTH

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">
          {DOCUMENT_LABELS[document.type]}
        </span>
        <DocumentStatusBadge status={document.status} />
      </div>
      {document.status === 'rejected' && document.rejectionReason && (
        <p className="text-xs text-destructive">{document.rejectionReason}</p>
      )}
      <a
        href={document.downloadUrl}
        target="_blank"
        rel="noreferrer"
        className="self-start text-xs font-medium text-brand-ink underline underline-offset-2"
      >
        View file
      </a>
      {document.status === 'pending' && !isRejecting && (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleVerifyClick}
            disabled={reviewDocument.isPending}
          >
            Verify
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleRejectClick}
            disabled={reviewDocument.isPending}
          >
            Reject
          </Button>
        </div>
      )}
      {document.status === 'pending' && isRejecting && (
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Reason for rejection (min 3 characters)"
            value={reason}
            onChange={handleReasonChange}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleConfirmRejectClick}
              disabled={!isReasonValid || reviewDocument.isPending}
            >
              Confirm rejection
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancelRejectClick}
              disabled={reviewDocument.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}

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
