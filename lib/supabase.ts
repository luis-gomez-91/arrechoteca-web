import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Variable global para mantener una sola instancia
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

// Cliente para componentes del cliente (Singleton)
export const createClient = () => {
  // Si ya existe una instancia, devolverla
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Crear nueva instancia solo si no existe
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Agregar una clave de storage única para tu aplicación
      storageKey: 'arrechoteca-admin2-auth'
    }
  })

  return supabaseInstance
}

// Cliente por defecto (para compatibilidad)
export const supabase = createClient()