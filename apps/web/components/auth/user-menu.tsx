'use client'

import Link from 'next/link'
import {
  ChevronDown,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Routes } from '@/config/routes'
import { SessionUser } from '@/config/auth.client'
import { useSignOut } from '@/components/auth/use-sign-out'

interface UserMenuProps {
  user: SessionUser
}

export function UserMenu({ user }: UserMenuProps) {
  const initial = user.name.charAt(0).toUpperCase()
  const handleSignOut = useSignOut(Routes.HOME)
  const isOfficeUser = user.role === 'underwriter' || user.role === 'admin'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
        <Avatar size="sm">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-foreground sm:inline">
          {user.name}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={Routes.DASHBOARD}>
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={Routes.APPLICATIONS}>
            <FileText />
            My applications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={Routes.DOCUMENTS}>
            <FolderOpen />
            Documents
          </Link>
        </DropdownMenuItem>
        {isOfficeUser ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={Routes.OFFICE}>
                <ShieldCheck />
                Back office
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
