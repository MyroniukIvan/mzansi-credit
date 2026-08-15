'use client'
import React from 'react'
import { authClient } from '@/config/auth.client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const DashboardPage = () => {
  const { data } = authClient.useSession()

  if (!data?.user) return

  const handleLogout = async () => {
    return await authClient.signOut()
  }

  return (
    <Card>
      <CardContent>
        <p>{data.user.name}</p>
      </CardContent>
      <Button onClick={handleLogout}>Logout</Button>
    </Card>
  )
}

export default DashboardPage
