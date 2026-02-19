import { User } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  session: import('@supabase/supabase-js').Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export interface ProtectedRouteProps {
  children: React.ReactNode
}