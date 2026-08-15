import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { SessionUser } from '@/config/auth.client'

interface UserInfoProps {
  user: SessionUser
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <>
      <p>{user.name}</p>
      <Avatar>
        <AvatarImage src={user.image ?? undefined} alt="User image" />
      </Avatar>
    </>
  )
}

export default UserInfo
