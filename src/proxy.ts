import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/account']

// Routes that are only for unauthenticated users
const AUTH_ROUTES = ['/login', '/register', '/forgot']

const intlMiddleware = createMiddleware(routing)

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(th|en)/, '') || '/'

  const token = req.cookies.get('access-token')?.value
  const userCookie = req.cookies.get('user')?.value
  const isAuthenticated = !!token && !!userCookie

  // Redirect unauthenticated users from protected routes to login
  if (PROTECTED_ROUTES.some((route) => pathnameWithoutLocale.startsWith(route)) && !isAuthenticated) {
    const locale = pathname.match(/^\/(th|en)/)?.[1] || 'th'
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
  }

  // Redirect authenticated users away from auth routes
  if (AUTH_ROUTES.some((route) => pathnameWithoutLocale.startsWith(route)) && isAuthenticated) {
    const locale = pathname.match(/^\/(th|en)/)?.[1] || 'th'
    return NextResponse.redirect(new URL(`/${locale}/`, req.url))
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
}
