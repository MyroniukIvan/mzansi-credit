import { z } from 'zod'
import { DOCUMENT_TYPES } from './types'

export const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type SignInInput = z.infer<typeof signInSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

const APPLICATION_AMOUNT_MIN = 500
const APPLICATION_AMOUNT_MAX = 15000
const APPLICATION_TERM_MIN_MONTHS = 1
const APPLICATION_TERM_MAX_MONTHS = 6
const SA_ID_NUMBER_PATTERN = /^\d{13}$/
const SA_PHONE_NUMBER_PATTERN = /^(\+27|0)\d{9}$/

export const applicationAmountTermSchema = z.object({
  amount: z
    .number()
    .int()
    .min(APPLICATION_AMOUNT_MIN)
    .max(APPLICATION_AMOUNT_MAX),
  termMonths: z
    .number()
    .int()
    .min(APPLICATION_TERM_MIN_MONTHS)
    .max(APPLICATION_TERM_MAX_MONTHS),
})

export type ApplicationAmountTermInput = z.infer<
  typeof applicationAmountTermSchema
>

export const applicationPersonalDetailsSchema = z.object({
  idNumber: z.string(),
  // .regex(SA_ID_NUMBER_PATTERN, 'Enter a valid 13-digit SA ID number'),
  phone: z.string(),
  // .regex(SA_PHONE_NUMBER_PATTERN, 'Enter a valid SA phone number'),
  address: z.string().min(5),
})

export type ApplicationPersonalDetailsInput = z.infer<
  typeof applicationPersonalDetailsSchema
>

export const applicationIncomeExpensesSchema = z.object({
  employer: z.string().min(2),
  monthlyIncome: z.number().int().min(0),
  monthlyExpenses: z.number().int().min(0),
})

export type ApplicationIncomeExpensesInput = z.infer<
  typeof applicationIncomeExpensesSchema
>

export const applicationSchema = z.object({
  ...applicationAmountTermSchema.shape,
  ...applicationPersonalDetailsSchema.shape,
  ...applicationIncomeExpensesSchema.shape,
})

export type ApplicationInput = z.infer<typeof applicationSchema>

const DOCUMENT_MAX_SIZE_BYTES = 10 * 1024 * 1024
const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

export const documentUploadSchema = z.object({
  type: z.enum(DOCUMENT_TYPES),
  mimeType: z.enum(DOCUMENT_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(DOCUMENT_MAX_SIZE_BYTES),
})

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>
