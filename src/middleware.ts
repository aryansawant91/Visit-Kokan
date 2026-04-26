import { NextRequest, NextResponse } from 'next/server'

/**
 * Route protection rules:
 * - /admin/*   → only role === 'admin'
 * - /vendor/*  → only role === 'vendor' (and vendorStatus === 'approved' for dashboard etc.)
 * - /dashboard, /bookings, /wishlist, /profile, /trip-planner → any logged-in user
 * - All others → public
 *
 * We store a lightweight session cookie `vk_session` (JSON) that AuthContext sets
 * after every sign-in. The cookie contains { uid, role, vendorStatus }.
 * This avoids a round-trip to Firebase Admin on every request.
 */

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/about',
  '/contact',
  '/destinations',
  '/listings',
  '/products',
  '/blogs',
  '/treks',
  '/search',
]

const ADMIN_PREFIX = '/admin'
const VENDOR_PREFIX = '/vendor'
const USER_PROTECTED = ['/dashboard', '/bookings', '/wishlist', '/profile', '/trip-planner']

function isPublic(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return true // API routes handle their own auth
  if (pathname.startsWith('/_next/')) return true
  if (pathname.startsWith('/icons/') || pathname.startsWith('/images/')) return true
  if (pathname === '/favicon.ico') return true
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

interface SessionPayload {
  uid: string
  role: 'admin' | 'vendor' | 'user'
  vendorStatus?: 'pending' | 'approved' | 'rejected'
}

function getSession(req: NextRequest): SessionPayload | null {
  const raw = req.cookies.get('vk_session')?.value
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as SessionPayload
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── 1. Always allow public paths ─────────────────────────────────────────
  if (isPublic(pathname)) {
    return NextResponse.next()
  }

  const session = getSession(req)
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('redirect', pathname)
console.log(session)
  // ── 2. Not logged in → redirect to login ─────────────────────────────────
  if (!session) {
    return NextResponse.redirect(loginUrl)
  }

  const { role, vendorStatus } = session

  // ── 3. Admin routes ───────────────────────────────────────────────────────
  if (pathname.startsWith(ADMIN_PREFIX)) {
    console.log(role)
    if (role !== 'admin') {
      // Vendors → vendor dashboard, Users → user dashboard
      const dest = '/vendor/dashboard'
      return NextResponse.redirect(new URL(dest, req.url))
    }
    return NextResponse.next()
  }

  // ── 4. Vendor routes ──────────────────────────────────────────────────────
  if (pathname.startsWith(VENDOR_PREFIX)) {
    if (role !== 'vendor') {
      const dest = '/admin/dashboard'
      return NextResponse.redirect(new URL(dest, req.url))
    }

    // Vendor is logged in — check approval status
    // /vendor/pending is always accessible to vendors
    if (pathname === '/vendor/pending') {
      return NextResponse.next()
    }

    if (vendorStatus !== 'approved') {
      return NextResponse.redirect(new URL('/vendor/pending', req.url))
    }

    return NextResponse.next()
  }

  // ── 5. User-protected routes ──────────────────────────────────────────────
  if (USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    // Any logged-in user can access these
    // But redirect admins/vendors to their dashboards
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    if (role === 'vendor' && vendorStatus === 'approved') {
      return NextResponse.redirect(new URL('/vendor/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files.
     * This regex skips: _next/static, _next/image, favicon.ico
     */
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
}