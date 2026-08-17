import { InstallmentStatus, LoanStatus } from 'shared'

export interface NextInstallmentSummary {
  sequence: number
  dueDate: string
  totalCents: number
}

export interface LoanSummary {
  id: string
  principalCents: number
  status: LoanStatus
  disbursedAt: string
  termMonths: number
  nextInstallment: NextInstallmentSummary | null
  paidCount: number
  totalCount: number
}

export interface InstallmentDetail {
  sequence: number
  dueDate: string
  principalCents: number
  interestCents: number
  feeCents: number
  status: InstallmentStatus
  paidAt: string | null
}

export interface LoanDetail {
  id: string
  principalCents: number
  status: LoanStatus
  disbursedAt: string
  termMonths: number
  monthlyInterestBps: number
  installments: InstallmentDetail[]
}
