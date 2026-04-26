import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = await req.json()

    if (!uid || !role) {
      return NextResponse.json({ error: 'uid and role are required' }, { status: 400 })
    }

    await adminAuth.setCustomUserClaims(uid, { role })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('set-role error:', err)
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 })
  }
}