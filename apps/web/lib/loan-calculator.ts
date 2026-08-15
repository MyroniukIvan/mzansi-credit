export const LOAN_AMOUNT_MIN = 500
export const LOAN_AMOUNT_MAX = 15000
export const LOAN_AMOUNT_STEP = 100

export const LOAN_TERM_OPTIONS_MONTHS = [1, 2, 3, 4, 5, 6] as const

const MONTHLY_INTEREST_RATE = 0.05
const MONTHLY_SERVICE_FEE = 69

const INITIATION_FEE_BASE = 165
const INITIATION_FEE_THRESHOLD = 1000
const INITIATION_FEE_RATE_ABOVE_THRESHOLD = 0.1
const INITIATION_FEE_MAX = 1050

export interface LoanQuote {
  principal: number
  termMonths: number
  initiationFee: number
  serviceFees: number
  interest: number
  totalRepayable: number
  monthlyInstallment: number
  costOfCredit: number
}

export function calculateInitiationFee(principal: number): number {
  const amountAboveThreshold = Math.max(0, principal - INITIATION_FEE_THRESHOLD)
  const fee =
    INITIATION_FEE_BASE +
    amountAboveThreshold * INITIATION_FEE_RATE_ABOVE_THRESHOLD
  return Math.min(fee, INITIATION_FEE_MAX)
}

export function calculateLoanQuote(
  principal: number,
  termMonths: number
): LoanQuote {
  const initiationFee = calculateInitiationFee(principal)
  const serviceFees = MONTHLY_SERVICE_FEE * termMonths
  const interest = principal * MONTHLY_INTEREST_RATE * termMonths
  const totalRepayable = principal + initiationFee + serviceFees + interest
  const monthlyInstallment = totalRepayable / termMonths
  const costOfCredit = totalRepayable - principal

  return {
    principal,
    termMonths,
    initiationFee,
    serviceFees,
    interest,
    totalRepayable,
    monthlyInstallment,
    costOfCredit,
  }
}
