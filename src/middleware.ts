import { NextRequest, NextResponse } from 'next/server'

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
  '/privacy',
  '/terms',
  '/checkout',
  '/order-confirmation',
]

const ADMIN_PREFIX = '/admin'
const VENDOR_PREFIX = '/vendor'
const USER_PROTECTED = ['/dashboard', '/bookings', '/wishlist', '/profile', '/trip-planner', '/orders']

function isPublic(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return true
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

  // Try raw JSON first (new cookies set without encodeURIComponent)
  try {
    return JSON.parse(raw) as SessionPayload
  } catch {
    // Fall back to decodeURIComponent for old cookies set with encodeURIComponent
    try {
      return JSON.parse(decodeURIComponent(raw)) as SessionPayload
    } catch {
      return null
    }
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const session = getSession(req)
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('redirect', pathname)

  if (!session) return NextResponse.redirect(loginUrl)

  const { role, vendorStatus } = session

  if (pathname.startsWith(ADMIN_PREFIX)) {
    console.log(role);
    if (role !== 'admin') {
      return NextResponse.redirect(new URL(role === 'vendor' ? '/vendor/dashboard' : '/dashboard', req.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith(VENDOR_PREFIX)) {
    if (role === 'admin') return NextResponse.next()
    if (role !== 'vendor') return NextResponse.redirect(new URL('/dashboard', req.url))
    if (pathname === '/vendor/pending' || pathname === '/vendor/register') return NextResponse.next()
    if (vendorStatus !== 'approved') return NextResponse.redirect(new URL('/vendor/pending', req.url))
    return NextResponse.next()
  }

  if (USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    if (role === 'vendor' && vendorStatus === 'approved') {
      return NextResponse.redirect(new URL('/vendor/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}