'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { InstallmentStatus, LoanStatus } from 'shared'
import { apiFetch } from '@/config/api-client'

export const loanKeys = {
  all: ['loans'] as const,
  detail: (id: string) => ['loans', id] as const,
}

export interface LoanNextInstallment {
  sequence: number
  dueDate: string
  totalCents: number
}

export interface LoanSummaryData {
  id: string
  principalCents: number
  status: LoanStatus
  disbursedAt: string
  termMonths: number
  nextInstallment: LoanNextInstallment | null
  paidCount: number
  totalCount: number
}

export interface LoanInstallmentDetail {
  sequence: number
  dueDate: string
  principalCents: number
  interestCents: number
  feeCents: number
  status: InstallmentStatus
  paidAt: string | null
}

export interface LoanDetailData {
  id: string
  principalCents: number
  status: LoanStatus
  disbursedAt: string
  termMonths: number
  monthlyInterestBps: number
  installments: LoanInstallmentDetail[]
}

export interface PayInstallmentInput {
  loanId: string
  sequence: number
}

export interface PayInstallmentResult {
  paymentId: string
  installment: {
    sequence: number
    status: InstallmentStatus
    paidAt: string | null
  }
  loanStatus: LoanStatus
}

function getLoans() {
  return apiFetch<LoanSummaryData[]>('/loans')
}

function getLoan(id: string) {
  return apiFetch<LoanDetailData>(`/loans/${id}`)
}

function payInstallment(values: PayInstallmentInput) {
  return apiFetch<PayInstallmentResult>('/payments', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function useLoans() {
  return useQuery({
    queryKey: loanKeys.all,
    queryFn: getLoans,
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: loanKeys.detail(id),
    queryFn: () => getLoan(id),
  })
}

export function usePayInstallment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: payInstallment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all })
      queryClient.invalidateQueries({
        queryKey: loanKeys.detail(variables.loanId),
      })
    },
  })
}
