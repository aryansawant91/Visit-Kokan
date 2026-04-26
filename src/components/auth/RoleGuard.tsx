'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { UserRole } from '@/types/user'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && role && !allowedRoles.includes(role)) {
      router.replace('/dashboard')
    }
  }, [role, loading, allowedRoles, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!role || !allowedRoles.includes(role)) return fallback ?? null

  return <>{children}</>
}