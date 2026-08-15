'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/config/auth.client'
import { toast } from 'sonner'

export function useSignOut(redirectTo?: string) {
  const router = useRouter()

  return async function handleSignOut() {
    const { data } = await authClient.signOut()

    if (!data?.success) {
      toast.error('Something went wrong')
      return
    }

    toast.success('Logged out successfully')

    if (redirectTo) {
      router.push(redirectTo)
    }
  }
}
