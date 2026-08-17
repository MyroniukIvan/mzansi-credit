import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { Routes } from '@/config/routes'

export function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req)
  const pathname = req.nextUrl.pathname
  const isAuthOnlyPath =
    pathname === Routes.LOGIN || pathname === Routes.REGISTER

  if (sessionCookie && isAuthOnlyPath) {
    return NextResponse.redirect(new URL(Routes.DASHBOARD, req.url))
  }

  if (!sessionCookie && !isAuthOnlyPath) {
    const loginUri = new URL(Routes.LOGIN, req.url)
    loginUri.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUri)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/applications/:path*',
    '/apply/:path*',
    '/office/:path*',
    '/login',
    '/register',
  ],
}
