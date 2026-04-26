import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/session
 * Body: { uid, role, vendorStatus? }
 * Sets a lightweight `vk_session` cookie read by middleware for route protection.
 *
 * DELETE /api/auth/session
 * Clears the session cookie on logout.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { uid, role, vendorStatus } = body

    if (!uid || !role) {
      return NextResponse.json({ error: 'Missing uid or role' }, { status: 400 })
    }

    const payload = JSON.stringify({ uid, role, vendorStatus: vendorStatus ?? null })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('vk_session', encodeURIComponent(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('vk_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}