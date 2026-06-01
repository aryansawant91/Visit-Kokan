'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  IdTokenResult,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export type UserRole = 'admin' | 'vendor' | 'user'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  phone?: string
  emailVerified: boolean
  isActive: boolean
  createdAt?: unknown
  updatedAt?: unknown
  businessName?: string
  businessAddress?: string
  gstNumber?: string
  vendorStatus?: 'pending' | 'approved' | 'rejected'
}

export interface SignUpData {
  email: string
  password: string
  displayName: string
  phone?: string
}

export interface VendorSignUpData extends SignUpData {
  businessName: string
  businessAddress: string
  gstNumber?: string
}

export interface MobileSignUpData {
  mobile: string;
  password: string;
  displayName: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: UserRole | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUpWithEmail: (data: SignUpData) => Promise<void>
  signUpVendor: (data: VendorSignUpData) => Promise<void>
  logout: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
  refreshProfile: () => Promise<void>
  signInWithMobile: (mobile: string, password: string) => Promise<void>
  signUpWithMobile: (data: MobileSignUpData) => Promise<void>
  resetPasswordWithMobile: (mobile: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

async function setRoleClaim(uid: string, role: UserRole) {
  try {
    await fetch('/api/users/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, role }),
    })
  } catch (err) {
    console.error('Failed to set role claim:', err)
  }
}

async function setSessionCookie(uid: string, role: UserRole, vendorStatus?: string | null) {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, role, vendorStatus: vendorStatus ?? null }),
    })
  } catch (err) {
    console.error('Failed to set session cookie:', err)
  }
}

async function clearSessionCookie() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch {}
}

function resolveRedirect(profile: UserProfile, role: UserRole, searchParams?: string): string {
  if (role === 'admin') return '/admin/dashboard'

  if (role === 'vendor') {
    if (profile.vendorStatus !== 'approved') return '/vendor/pending'
    return '/vendor/dashboard'
  }

  if (searchParams) {
    const params = new URLSearchParams(searchParams)
    const redirect = params.get('redirect')
    if (redirect && redirect.startsWith('/')) return redirect
  }

  return '/'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const skipNextAuthChange = useRef(false)

  
  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      return snap.exists() ? (snap.data() as UserProfile) : null
    } catch {
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.uid)
      setProfile(p)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (skipNextAuthChange.current) {
        skipNextAuthChange.current = false
        setLoading(false)
        return
      }

      if (!fbUser) {
        setUser(null)
        setProfile(null)
        setRole(null)
        setLoading(false)
        return
      }

      setUser(fbUser)
      const p = await fetchProfile(fbUser.uid)

      let claimedRole: UserRole = p?.role ?? 'user'
      try {
        const tokenResult: IdTokenResult = await fbUser.getIdTokenResult(true)
        if (tokenResult.claims.role) {
          claimedRole = tokenResult.claims.role as UserRole
        }
      } catch {
        claimedRole = p?.role ?? 'user'
      }

      setRole(claimedRole)
      setProfile(p)
      await setSessionCookie(fbUser.uid, claimedRole, p?.vendorStatus)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  skipNextAuthChange.current = true

  const p = await fetchProfile(cred.user.uid)

  let claimedRole: UserRole = p?.role ?? 'user'
  try {
    const tokenResult = await cred.user.getIdTokenResult(true)
    if (tokenResult.claims.role) {
      claimedRole = tokenResult.claims.role as UserRole
    } else if (p?.role) {
      claimedRole = p.role
      await setRoleClaim(cred.user.uid, p.role)
      await cred.user.getIdToken(true)
    }
  } catch {
    claimedRole = p?.role ?? 'user'
  }

  setUser(cred.user)
  setRole(claimedRole)
  setProfile(p)

  // Set session cookie BEFORE redirect
  await setSessionCookie(cred.user.uid, claimedRole, p?.vendorStatus)

  // Redirect based on role
  if (claimedRole === 'admin') {
    router.replace('/admin/dashboard')
  } else if (claimedRole === 'vendor') {
    if (p?.vendorStatus === 'approved') {
      router.replace('/vendor/dashboard')
    } else {
      router.replace('/vendor/pending')
    }
  } else {
    // Regular user — go to homepage or redirect param
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    router.replace(redirect && redirect.startsWith('/') ? redirect : '/')
  }
}

  const signInWithGoogle = async () => {
    const { user: fbUser } = await signInWithPopup(auth, googleProvider)
    skipNextAuthChange.current = true

    const userRef = doc(db, 'users', fbUser.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email!,
        displayName: fbUser.displayName ?? '',
        photoURL: fbUser.photoURL ?? '',
        role: 'user',
        emailVerified: fbUser.emailVerified,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      await setDoc(userRef, newProfile)
      await setRoleClaim(fbUser.uid, 'user')
      await setSessionCookie(fbUser.uid, 'user', null)

      setUser(fbUser)
      setProfile(newProfile)
      setRole('user')
      router.replace('/')
    } else {
      const p = userSnap.data() as UserProfile

      let claimedRole: UserRole = p.role ?? 'user'
      try {
        const tokenResult = await fbUser.getIdTokenResult(true)
        if (tokenResult.claims.role) {
          claimedRole = tokenResult.claims.role as UserRole
        } else if (p?.role) {
          claimedRole = p.role
          await setRoleClaim(fbUser.uid, p.role)
          await fbUser.getIdToken(true)
        }
      } catch {
        claimedRole = p.role ?? 'user'
      }

      await setSessionCookie(fbUser.uid, claimedRole, p?.vendorStatus)

      setUser(fbUser)
      setProfile(p)
      setRole(claimedRole)
      router.replace(resolveRedirect(p, claimedRole, window.location.search))
    }
  }

  const signUpWithEmail = async (data: SignUpData) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
    skipNextAuthChange.current = true

    await updateProfile(cred.user, { displayName: data.displayName })
    try { await sendEmailVerification(cred.user) } catch {}

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: data.email,
      displayName: data.displayName,
      role: 'user',
      phone: data.phone ?? '',
      emailVerified: false,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', cred.user.uid), newProfile)
    await setRoleClaim(cred.user.uid, 'user')
    await setSessionCookie(cred.user.uid, 'user', null)

    setUser(cred.user)
    setProfile(newProfile)
    setRole('user')
    router.replace('/')
  }

  const signUpVendor = async (data: VendorSignUpData) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
    skipNextAuthChange.current = true

    await updateProfile(cred.user, { displayName: data.displayName })
    try { await sendEmailVerification(cred.user) } catch {}

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: data.email,
      displayName: data.displayName,
      role: 'vendor',
      phone: data.phone ?? '',
      emailVerified: false,
      isActive: true,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      gstNumber: data.gstNumber ?? '',
      vendorStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', cred.user.uid), newProfile)
    await setRoleClaim(cred.user.uid, 'vendor')
    await setSessionCookie(cred.user.uid, 'vendor', 'pending')

    setUser(cred.user)
    setProfile(newProfile)
    setRole('vendor')
    router.replace('/vendor/pending')
  }

  const logout = async () => {
    await signOut(auth)
    await clearSessionCookie()
    setUser(null)
    setProfile(null)
    setRole(null)
    router.replace('/')
  }

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const sendVerificationEmail = async () => {
    if (user) {
      try { await sendEmailVerification(user) } catch {}
    }
  }

  // ── Mobile auth functions ─────────────────────────────────────────────────

  const signInWithMobile = async (mobile: string, password: string) => {
    const res = await fetch("/api/auth/mobile-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Mobile number not registered.");
    }

    const { email } = await res.json();
    await signInWithEmail(email, password);
  }

  const signUpWithMobile = async (data: MobileSignUpData) => {
    await signUpWithEmail({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      phone: data.mobile,
    });
  }

  const resetPasswordWithMobile = async (mobile: string, newPassword: string) => {
    const res = await fetch("/api/auth/mobile-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    if (!res.ok) throw new Error("Mobile number not registered.");

    const { email } = await res.json();

    const updateRes = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    if (!updateRes.ok) throw new Error("Failed to reset password.");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        signInWithEmail,
        signInWithGoogle,
        signUpWithEmail,
        signUpVendor,
        logout,
        sendPasswordReset,
        sendVerificationEmail,
        refreshProfile,
        signInWithMobile,
        signUpWithMobile,
        resetPasswordWithMobile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}