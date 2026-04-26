import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    const decoded = await adminAuth.verifyIdToken(token)
    const role = decoded.role ?? 'user'
    return NextResponse.json({ uid: decoded.uid, role })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}