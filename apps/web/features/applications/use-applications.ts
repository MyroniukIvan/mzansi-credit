'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApplicationInput,
  ApplicationStatus,
  ApplicationSummary,
  DocumentStatus,
  DocumentType,
} from 'shared'
import { apiFetch } from '@/config/api-client'

export const applicationKeys = {
  all: ['applications'] as const,
  detail: (id: string) => ['applications', id] as const,
}

export interface ApplicationDetailProduct {
  id: string
  name: string
  minAmountCents: number
  maxAmountCents: number
  minTermMonths: number
  maxTermMonths: number
  monthlyInterestBps: number
  initiationFeeBps: number
  monthlyServiceFeeCents: number
}

export interface ApplicationDetailDocument {
  id: string
  type: DocumentType
  status: DocumentStatus
  rejectionReason: string | null
  createdAt: string
}

export interface ApplicationDetailData {
  id: string
  status: ApplicationStatus
  amountCents: number
  termMonths: number
  incomeCents: number | null
  expensesCents: number | null
  score: number | null
  decisionReason: string | null
  submittedAt: string | null
  decidedAt: string | null
  product: ApplicationDetailProduct
  documents: ApplicationDetailDocument[]
}

function getApplications() {
  return apiFetch<ApplicationSummary[]>('/applications')
}

function getApplication(id: string) {
  return apiFetch<ApplicationDetailData>(`/applications/${id}`)
}

function createApplication(values: ApplicationInput) {
  return apiFetch<ApplicationSummary>('/applications', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.all,
    queryFn: getApplications,
  })
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => getApplication(id),
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  })
}
