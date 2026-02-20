'use client'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signInWithFacebook: (redirectTo?: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Crear la instancia una sola vez y memorizarla
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Refrescar la página cuando cambie el estado de auth
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          router.refresh()
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [router, supabase.auth]) // supabase.auth ahora es estable

  const signInWithGoogle = async (redirectTo?: string): Promise<void> => {
    const callbackUrl = redirectTo
      ? `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`
      : `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signInWithFacebook = async (redirectTo?: string): Promise<void> => {
    const callbackUrl = redirectTo
      ? `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`
      : `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: callbackUrl,
      },
    })
    if (error) {
      console.error('Error signing in with Facebook:', error)
      throw error
    }
  }

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const isAdmin = Boolean(
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())
  )

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signInWithGoogle,
      signInWithFacebook,
      signInWithEmail,
      signUpWithEmail,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}