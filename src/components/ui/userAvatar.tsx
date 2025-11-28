import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  // Accept a loose shape because the app's `User` type varies across the codebase.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  size?: 'sm' | 'md' | 'lg'
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const sizeClass =
    size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'

  const initial = (user?.name && user.name.length > 0) ? user.name.charAt(0).toUpperCase() : '?'

  return (
    <Avatar className={`inline-flex items-center justify-center overflow-hidden rounded-full ${sizeClass}`}>
      {user?.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name ?? 'User avatar'} />
      ) : (
        <AvatarFallback>{initial}</AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar