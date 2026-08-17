import { z } from 'zod'

export const payInstallmentSchema = z.object({
  loanId: z.string(),
  sequence: z.number().int().positive(),
})

export type PayInstallmentInput = z.infer<typeof payInstallmentSchema>
