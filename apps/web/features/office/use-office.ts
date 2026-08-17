'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationStatus, DocumentStatus, DocumentType } from 'shared'
import { apiFetch } from '@/config/api-client'

export const officeKeys = {
  all: ['office'] as const,
  queues: ['office', 'queue'] as const,
  queue: (status: ApplicationStatus) => ['office', 'queue', status] as const,
  detail: (id: string) => ['office', 'application', id] as const,
}

export interface OfficeQueueItem {
  id: string
  applicantName: string
  amountCents: number
  termMonths: number
  status: ApplicationStatus
  submittedAt: string
  score: number | null
  documentsCount: number
}

export interface OfficeApplicant {
  id: string
  name: string
  email: string
}

export interface OfficeApplicantPersonal {
  idNumber: string | null
  phone: string | null
  address: string | null
  employer: string | null
  incomeCents: number | null
  expensesCents: number | null
}

export interface OfficeProduct {
  id: string
  name: string
  monthlyInterestBps: number
  initiationFeeBps: number
  monthlyServiceFeeCents: number
}

export interface OfficeDocument {
  id: string
  type: DocumentType
  status: DocumentStatus
  rejectionReason: string | null
  createdAt: string
  downloadUrl: string
}

export interface OfficeApplicationDetail {
  id: string
  status: ApplicationStatus
  amountCents: number
  termMonths: number
  score: number | null
  decisionReason: string | null
  submittedAt: string | null
  decidedAt: string | null
  applicant: OfficeApplicant
  personal: OfficeApplicantPersonal
  product: OfficeProduct
  documents: OfficeDocument[]
}

export type DecisionOutcome = 'approved' | 'rejected'

export interface DecideApplicationInput {
  decision: DecisionOutcome
  comment: string
}

export type DocumentReviewStatus = Exclude<DocumentStatus, 'pending'>

export interface ReviewDocumentInput {
  documentId: string
  applicationId: string
  status: DocumentReviewStatus
  reason?: string
}

function getOfficeQueue(status: ApplicationStatus) {
  return apiFetch<OfficeQueueItem[]>(`/office/applications?status=${status}`)
}

function getOfficeApplication(id: string) {
  return apiFetch<OfficeApplicationDetail>(`/office/applications/${id}`)
}

async function postOfficeAction<TInput extends object>(
  path: string,
  body: TInput
): Promise<void> {
  await apiFetch<void>(path, { method: 'POST', body: JSON.stringify(body) })
}

function decideApplication(id: string, input: DecideApplicationInput) {
  return postOfficeAction(`/office/applications/${id}/decision`, input)
}

function reviewDocument(input: ReviewDocumentInput) {
  return postOfficeAction(`/office/documents/${input.documentId}/review`, {
    status: input.status,
    reason: input.reason,
  })
}

export function useOfficeQueue(status: ApplicationStatus) {
  return useQuery({
    queryKey: officeKeys.queue(status),
    queryFn: () => getOfficeQueue(status),
  })
}

export function useOfficeApplication(id: string) {
  return useQuery({
    queryKey: officeKeys.detail(id),
    queryFn: () => getOfficeApplication(id),
  })
}

export function useDecideApplication(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DecideApplicationInput) => decideApplication(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: officeKeys.queues })
      queryClient.invalidateQueries({ queryKey: officeKeys.detail(id) })
    },
  })
}

export function useReviewDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewDocument,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: officeKeys.detail(variables.applicationId),
      })
    },
  })
}
