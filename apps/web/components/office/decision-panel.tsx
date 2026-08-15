'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

function handleApproveApplication(): void {
  // TODO: call the applications API to approve
}

function handleRejectApplication(): void {
  // TODO: call the applications API to reject
}

export function DecisionPanel() {
  const [comment, setComment] = useState('')

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.target.value)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Decision</h2>
      <Textarea
        placeholder="Add a comment for the record (optional)"
        value={comment}
        onChange={handleCommentChange}
      />
      <div className="flex gap-3">
        <Button onClick={handleApproveApplication} className="flex-1">
          <Check />
          Approve
        </Button>
        <Button
          onClick={handleRejectApplication}
          variant="destructive"
          className="flex-1"
        >
          <X />
          Reject
        </Button>
      </div>
    </div>
  )
}
