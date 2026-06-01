import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { uid, role, vendorStatus } = body
console.log(body)
    if (!uid || !role) {
      return NextResponse.json({ error: 'Missing uid or role' }, { status: 400 })
    }

    // ✅ Store raw JSON — Next.js cookies.set handles encoding internally
    const payload = JSON.stringify({ uid, role, vendorStatus: vendorStatus ?? null })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('vk_session', payload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
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