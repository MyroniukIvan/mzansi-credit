import { describe, expect, it } from 'vitest'
import {
  buildSchedule,
  estimateMonthlyPaymentCents,
  installmentTotalCents,
  LoanScheduleInput,
} from './loan-math'

const CASES: LoanScheduleInput[] = [
  {
    principalCents: 500_00,
    termMonths: 1,
    monthlyInterestBps: 600,
    initiationFeeBps: 1000,
    monthlyServiceFeeCents: 60_00,
  },
  {
    principalCents: 400_000,
    termMonths: 3,
    monthlyInterestBps: 600,
    initiationFeeBps: 1000,
    monthlyServiceFeeCents: 60_00,
  },
  {
    principalCents: 150_000,
    termMonths: 6,
    monthlyInterestBps: 500,
    initiationFeeBps: 1000,
    monthlyServiceFeeCents: 60_00,
  },
  {
    principalCents: 1_500_000,
    termMonths: 6,
    monthlyInterestBps: 500,
    initiationFeeBps: 1000,
    monthlyServiceFeeCents: 60_00,
  },
  {
    principalCents: 333_333,
    termMonths: 7,
    monthlyInterestBps: 733,
    initiationFeeBps: 1234,
    monthlyServiceFeeCents: 6_00,
  },
]

describe('buildSchedule', () => {
  it.each(CASES)(
    'produces a schedule of length termMonths with sequences 1..n ($termMonths months, $principalCents cents)',
    (input) => {
      const schedule = buildSchedule(input)

      expect(schedule).toHaveLength(input.termMonths)
      expect(schedule.map((installment) => installment.sequence)).toEqual(
        Array.from({ length: input.termMonths }, (_, index) => index + 1)
      )
    }
  )

  it.each(CASES)(
    'sums principal parts to exactly principalCents ($termMonths months, $principalCents cents)',
    (input) => {
      const schedule = buildSchedule(input)
      const total = schedule.reduce(
        (sum, installment) => sum + installment.principalCents,
        0
      )
      expect(total).toBe(input.principalCents)
    }
  )

  it.each(CASES)(
    'has no negative or fractional cents ($termMonths months, $principalCents cents)',
    (input) => {
      const schedule = buildSchedule(input)
      for (const installment of schedule) {
        expect(installment.principalCents).toBeGreaterThanOrEqual(0)
        expect(installment.interestCents).toBeGreaterThanOrEqual(0)
        expect(installment.feeCents).toBeGreaterThanOrEqual(0)
        expect(Number.isInteger(installment.principalCents)).toBe(true)
        expect(Number.isInteger(installment.interestCents)).toBe(true)
        expect(Number.isInteger(installment.feeCents)).toBe(true)
      }
    }
  )

  it.each(CASES)(
    'only the first installment carries the initiation fee ($termMonths months, $principalCents cents)',
    (input) => {
      const schedule = buildSchedule(input)
      const initiationFeeCents = Math.round(
        (input.principalCents * input.initiationFeeBps) / 10000
      )

      expect(schedule[0].feeCents).toBe(
        input.monthlyServiceFeeCents + initiationFeeCents
      )
      for (const installment of schedule.slice(1)) {
        expect(installment.feeCents).toBe(input.monthlyServiceFeeCents)
      }
    }
  )
})

describe('installmentTotalCents', () => {
  it('sums principal, interest and fee for a single installment', () => {
    const total = installmentTotalCents({
      sequence: 1,
      principalCents: 100,
      interestCents: 20,
      feeCents: 5,
    })
    expect(total).toBe(125)
  })
})

describe('estimateMonthlyPaymentCents', () => {
  it.each(CASES)(
    'sums floored principal/term, rounded interest and the service fee ($termMonths months, $principalCents cents)',
    (input) => {
      const estimate = estimateMonthlyPaymentCents(input)
      const expectedPrincipalPart = Math.floor(
        input.principalCents / input.termMonths
      )
      const expectedInterestPart = Math.round(
        (input.principalCents * input.monthlyInterestBps) / 10000
      )
      expect(estimate).toBe(
        expectedPrincipalPart +
          expectedInterestPart +
          input.monthlyServiceFeeCents
      )
    }
  )
})
