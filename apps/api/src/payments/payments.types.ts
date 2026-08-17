import { InstallmentStatus, LoanStatus } from 'shared'

export interface PaymentInstallmentResult {
  sequence: number
  status: InstallmentStatus
  paidAt: string | null
}

export interface PaymentResult {
  paymentId: string
  installment: PaymentInstallmentResult
  loanStatus: LoanStatus
}
