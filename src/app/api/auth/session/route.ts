import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { createSignedSessionCookie } from '@/lib/apiAuth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { uid } = body

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 })
    }

    // Verify user role directly from Firestore (authoritative source of truth)
    const userDoc = await adminDb.collection("users").doc(uid).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 })
    }

    const userData = userDoc.data()
    const role = (userData?.role as 'admin' | 'vendor' | 'user') || 'user'
    const vendorStatus = userData?.vendorStatus || null

    const signedCookie = createSignedSessionCookie({ uid, role, vendorStatus })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('vk_session', signedCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err: any) {
    console.error("Session creation error:", err?.message)
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
