import { describe, expect, it } from 'vitest'
import {
  evaluateApplication,
  ScoringDecision,
  ScoringProduct,
} from './scoring.utils'

const PRODUCT: ScoringProduct = {
  minAmountCents: 500_00,
  maxAmountCents: 4000_00,
  minTermMonths: 1,
  maxTermMonths: 3,
  monthlyInterestBps: 600,
  monthlyServiceFeeCents: 60_00,
}

const BASE_AMOUNT_CENTS = 1000_00
const BASE_TERM_MONTHS = 2

interface EvaluateApplicationCase {
  description: string
  amountCents: number
  termMonths: number
  incomeCents: number
  expensesCents: number
  hasActiveLoan: boolean
  expectedDecision: ScoringDecision
}

const CASES: EvaluateApplicationCase[] = [
  {
    description: 'applicant already has an active loan',
    amountCents: BASE_AMOUNT_CENTS,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 5000_00,
    expensesCents: 2000_00,
    hasActiveLoan: true,
    expectedDecision: 'rejected',
  },
  {
    description: 'amount below product minimum',
    amountCents: 400_00,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 5000_00,
    expensesCents: 2000_00,
    hasActiveLoan: false,
    expectedDecision: 'rejected',
  },
  {
    description: 'amount above product maximum',
    amountCents: 5000_00,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 5000_00,
    expensesCents: 2000_00,
    hasActiveLoan: false,
    expectedDecision: 'rejected',
  },
  {
    description: 'term outside product range',
    amountCents: BASE_AMOUNT_CENTS,
    termMonths: 5,
    incomeCents: 5000_00,
    expensesCents: 2000_00,
    hasActiveLoan: false,
    expectedDecision: 'rejected',
  },
  {
    description: 'installment exceeds 40% of net income',
    amountCents: BASE_AMOUNT_CENTS,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 1000_00,
    expensesCents: 0,
    hasActiveLoan: false,
    expectedDecision: 'rejected',
  },
  {
    description: 'installment between 30% and 40% of net income',
    amountCents: BASE_AMOUNT_CENTS,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 1800_00,
    expensesCents: 0,
    hasActiveLoan: false,
    expectedDecision: 'manual_review',
  },
  {
    description: 'installment below 30% of net income',
    amountCents: BASE_AMOUNT_CENTS,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 3000_00,
    expensesCents: 0,
    hasActiveLoan: false,
    expectedDecision: 'approved',
  },
  {
    description: 'expenses equal income (zero net)',
    amountCents: BASE_AMOUNT_CENTS,
    termMonths: BASE_TERM_MONTHS,
    incomeCents: 1000_00,
    expensesCents: 1000_00,
    hasActiveLoan: false,
    expectedDecision: 'rejected',
  },
]

describe('evaluateApplication', () => {
  it.each(CASES)('$description -> $expectedDecision', (testCase) => {
    const result = evaluateApplication({
      amountCents: testCase.amountCents,
      termMonths: testCase.termMonths,
      incomeCents: testCase.incomeCents,
      expensesCents: testCase.expensesCents,
      product: PRODUCT,
      hasActiveLoan: testCase.hasActiveLoan,
    })

    expect(result.decision).toBe(testCase.expectedDecision)
  })
})
