const BPS_BASE = 10000
const PERCENT_BASE = 100
const MANUAL_REVIEW_THRESHOLD_PERCENT = 30
const REJECT_THRESHOLD_PERCENT = 40
const MIN_SCORE = 0
const MAX_SCORE = 100

export interface ScoringProduct {
  minAmountCents: number
  maxAmountCents: number
  minTermMonths: number
  maxTermMonths: number
  monthlyInterestBps: number
  monthlyServiceFeeCents: number
}

export interface EvaluateApplicationInput {
  amountCents: number
  termMonths: number
  incomeCents: number
  expensesCents: number
  product: ScoringProduct
  hasActiveLoan: boolean
}

export type ScoringDecision = 'approved' | 'rejected' | 'manual_review'

export interface EvaluateApplicationResult {
  decision: ScoringDecision
  reason: string
  score: number
}

function clampScore(score: number): number {
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score))
}

function isWithinProductLimits(
  amountCents: number,
  termMonths: number,
  product: ScoringProduct
): boolean {
  return (
    amountCents >= product.minAmountCents &&
    amountCents <= product.maxAmountCents &&
    termMonths >= product.minTermMonths &&
    termMonths <= product.maxTermMonths
  )
}

function estimateMonthlyInstallmentCents(
  amountCents: number,
  termMonths: number,
  product: ScoringProduct
): number {
  const principalPerMonthCents = Math.floor(amountCents / termMonths)
  const interestPerMonthCents = Math.floor(
    (amountCents * product.monthlyInterestBps) / BPS_BASE
  )
  return (
    principalPerMonthCents +
    interestPerMonthCents +
    product.monthlyServiceFeeCents
  )
}

export function evaluateApplication(
  input: EvaluateApplicationInput
): EvaluateApplicationResult {
  const {
    amountCents,
    termMonths,
    incomeCents,
    expensesCents,
    product,
    hasActiveLoan,
  } = input

  if (hasActiveLoan) {
    return {
      decision: 'rejected',
      reason: 'Applicant already has an active loan',
      score: MIN_SCORE,
    }
  }

  if (!isWithinProductLimits(amountCents, termMonths, product)) {
    return {
      decision: 'rejected',
      reason: 'Requested amount or term is outside product limits',
      score: MIN_SCORE,
    }
  }

  const netCents = incomeCents - expensesCents
  const installmentCents = estimateMonthlyInstallmentCents(
    amountCents,
    termMonths,
    product
  )

  const installmentUsage = installmentCents * PERCENT_BASE
  const rejectThreshold = REJECT_THRESHOLD_PERCENT * netCents
  const manualReviewThreshold = MANUAL_REVIEW_THRESHOLD_PERCENT * netCents

  const score =
    netCents > 0
      ? clampScore(
          MAX_SCORE - Math.round((installmentCents * MAX_SCORE) / netCents)
        )
      : MIN_SCORE

  if (installmentUsage > rejectThreshold) {
    return {
      decision: 'rejected',
      reason: 'Estimated installment exceeds affordability threshold',
      score,
    }
  }

  if (installmentUsage > manualReviewThreshold) {
    return {
      decision: 'manual_review',
      reason: 'Estimated installment requires manual affordability review',
      score,
    }
  }

  return {
    decision: 'approved',
    reason: 'Applicant meets affordability and product criteria',
    score,
  }
}
