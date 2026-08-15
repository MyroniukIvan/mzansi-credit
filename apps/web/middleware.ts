import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { Routes } from '@/config/routes'

export function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req)

  if (!sessionCookie) {
    const loginUri = new URL(Routes.LOGIN, req.url)
    loginUri.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(loginUri)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/applications/:path*'],
}
