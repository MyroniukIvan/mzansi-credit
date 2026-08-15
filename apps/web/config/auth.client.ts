import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3001',
  plugins: [adminClient()],
})

export type SessionUser = (typeof authClient.$Infer.Session)['user']
