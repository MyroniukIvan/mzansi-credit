'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'
import { ApplicationStatus } from 'shared'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Routes } from '@/config/routes'
import {
  DecisionOutcome,
  useDecideApplication,
  useOfficeApplication,
} from '@/features/office/use-office'

const MIN_COMMENT_LENGTH = 3

const STATUS_EXPLANATIONS: Record<ApplicationStatus, string> = {
  draft: 'still a draft',
  submitted: 'waiting to be scored',
  scoring: 'being scored automatically',
  manual_review: 'awaiting manual review',
  approved: 'already approved',
  rejected: 'already rejected',
  disbursed: 'already disbursed',
  active: 'active with an outstanding loan',
  closed: 'closed',
  defaulted: 'marked as defaulted',
}

interface DecisionPanelProps {
  id: string
}

export function DecisionPanel({ id }: DecisionPanelProps) {
  const [comment, setComment] = useState('')
  const router = useRouter()
  const { data: application, isPending } = useOfficeApplication(id)
  const { mutateAsync: decideApplication, isPending: isDeciding } =
    useDecideApplication(id)

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.target.value)
  }

  async function submitDecision(decision: DecisionOutcome) {
    try {
      await decideApplication({ decision, comment: comment.trim() })
      toast.success(
        decision === 'approved'
          ? 'Application approved'
          : 'Application rejected'
      )
      router.push(Routes.OFFICE)
    } catch {
      toast.error('Could not record the decision. Please try again.')
    }
  }

  function handleApproveClick() {
    void submitDecision('approved')
  }

  function handleRejectClick() {
    void submitDecision('rejected')
  }

  if (isPending || !application) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />
  }

  if (application.status !== 'manual_review') {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        This application is {STATUS_EXPLANATIONS[application.status]}. Decisions
        can only be recorded while an application is awaiting manual review.
      </div>
    )
  }

  const isCommentValid = comment.trim().length >= MIN_COMMENT_LENGTH

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Decision</h2>
      <Textarea
        placeholder="Add a comment for the record (required, min 3 characters)"
        value={comment}
        onChange={handleCommentChange}
      />
      <div className="flex gap-3">
        <Button
          onClick={handleApproveClick}
          disabled={!isCommentValid || isDeciding}
          className="flex-1"
        >
          <Check />
          Approve
        </Button>
        <Button
          onClick={handleRejectClick}
          variant="destructive"
          disabled={!isCommentValid || isDeciding}
          className="flex-1"
        >
          <X />
          Reject
        </Button>
      </div>
    </div>
  )
}
