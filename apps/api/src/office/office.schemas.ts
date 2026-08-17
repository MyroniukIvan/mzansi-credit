import { z } from 'zod'
import { APPLICATION_STATUSES } from 'shared'

export const officeQueueQuerySchema = z.object({
  status: z.enum(APPLICATION_STATUSES).default('manual_review'),
})

export type OfficeQueueQuery = z.infer<typeof officeQueueQuerySchema>

const OFFICE_DECISION_COMMENT_MIN_LENGTH = 3

export const officeDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  comment: z.string().min(OFFICE_DECISION_COMMENT_MIN_LENGTH),
})

export type OfficeDecisionInput = z.infer<typeof officeDecisionSchema>

export const officeDocumentReviewSchema = z
  .object({
    status: z.enum(['verified', 'rejected']),
    reason: z.string().optional(),
  })
  .refine((data) => data.status !== 'rejected' || Boolean(data.reason), {
    message: 'reason is required when rejecting a document',
    path: ['reason'],
  })

export type OfficeDocumentReviewInput = z.infer<
  typeof officeDocumentReviewSchema
>
