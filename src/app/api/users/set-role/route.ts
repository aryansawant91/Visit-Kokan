import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = await req.json()

    if (!uid || !role) {
      return NextResponse.json({ error: 'uid and role are required' }, { status: 400 })
    }

    // Never allow assigning 'admin' role via this public endpoint
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin role cannot be self-assigned' },
        { status: 403 }
      )
    }

    // Only allow valid public onboarding roles: 'user' or 'vendor'
    if (!['user', 'vendor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    try {
      await adminAuth.setCustomUserClaims(uid, { role })
    } catch (authErr: any) {
      if (authErr?.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'User record not found' }, { status: 404 })
      }
      throw authErr
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('set-role error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 })
  }
}
