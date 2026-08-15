export const USER_ROLES = ['client', 'underwriter', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]
