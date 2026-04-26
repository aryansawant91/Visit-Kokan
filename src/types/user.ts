export type UserRole = 'user' | 'vendor' | 'admin'

export interface AppUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: AppUser | null
  loading: boolean
  role: UserRole | null
}