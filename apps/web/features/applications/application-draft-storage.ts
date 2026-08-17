import { z } from 'zod'
import { applicationSchema } from 'shared'

const DRAFT_STORAGE_KEY = 'mzansi-application-draft'

const storedDraftSchema = z.object({
  stepIndex: z.number().int().min(0).max(3),
  draft: applicationSchema.partial(),
})

export type StoredApplicationDraft = z.infer<typeof storedDraftSchema>

export function readApplicationDraft(): StoredApplicationDraft | null {
  const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
  if (!raw) return null

  try {
    return storedDraftSchema.parse(JSON.parse(raw))
  } catch {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    return null
  }
}

export function saveApplicationDraft(value: StoredApplicationDraft): void {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(value))
}

export function clearApplicationDraft(): void {
  localStorage.removeItem(DRAFT_STORAGE_KEY)
}
