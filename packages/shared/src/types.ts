export const USER_ROLES = ['client', 'underwriter', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'scoring',
  'manual_review',
  'approved',
  'rejected',
  'disbursed',
  'active',
  'closed',
  'defaulted',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export interface ApplicationSummary {
  id: string
  applicantName: string
  amount: number
  termMonths: number
  status: ApplicationStatus
  submittedAt: string
}

export const DOCUMENT_STATUSES = ['pending', 'verified', 'rejected'] as const
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export const LOAN_STATUSES = ['active', 'closed', 'defaulted'] as const
export type LoanStatus = Extract<
  ApplicationStatus,
  (typeof LOAN_STATUSES)[number]
>

export const INSTALLMENT_STATUSES = ['pending', 'paid', 'overdue'] as const
export type InstallmentStatus = (typeof INSTALLMENT_STATUSES)[number]

export const PAYMENT_STATUSES = ['pending', 'succeeded', 'failed'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const DOCUMENT_TYPES = ['sa_id', 'proof_of_income'] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]
