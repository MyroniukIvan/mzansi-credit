const BPS_BASE = 10000

export interface LoanScheduleInput {
  principalCents: number
  termMonths: number
  monthlyInterestBps: number
  initiationFeeBps: number
  monthlyServiceFeeCents: number
}

export interface ScheduleInstallment {
  sequence: number
  principalCents: number
  interestCents: number
  feeCents: number
}

export function buildSchedule(input: LoanScheduleInput): ScheduleInstallment[] {
  const {
    principalCents,
    termMonths,
    monthlyInterestBps,
    initiationFeeBps,
    monthlyServiceFeeCents,
  } = input

  const basePrincipalCents = Math.floor(principalCents / termMonths)
  const principalRemainderCents =
    principalCents - basePrincipalCents * termMonths
  const interestCents = Math.round(
    (principalCents * monthlyInterestBps) / BPS_BASE
  )
  const initiationFeeCents = Math.round(
    (principalCents * initiationFeeBps) / BPS_BASE
  )

  return Array.from({ length: termMonths }, (_, index) => {
    const sequence = index + 1
    const isFirst = sequence === 1
    const isLast = sequence === termMonths
    return {
      sequence,
      principalCents:
        basePrincipalCents + (isLast ? principalRemainderCents : 0),
      interestCents,
      feeCents: monthlyServiceFeeCents + (isFirst ? initiationFeeCents : 0),
    }
  })
}

export function installmentTotalCents(
  installment: ScheduleInstallment
): number {
  return (
    installment.principalCents +
    installment.interestCents +
    installment.feeCents
  )
}

export function estimateMonthlyPaymentCents(
  input: Omit<LoanScheduleInput, 'initiationFeeBps'>
): number {
  const principalPartCents = Math.floor(input.principalCents / input.termMonths)
  const interestPartCents = Math.round(
    (input.principalCents * input.monthlyInterestBps) / BPS_BASE
  )
  return principalPartCents + interestPartCents + input.monthlyServiceFeeCents
}
