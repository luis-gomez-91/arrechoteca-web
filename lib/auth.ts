/**
 * Helpers para verificación de admin en el servidor (API routes, Server Actions, middleware).
 * La lista de admins viene de NEXT_PUBLIC_ADMIN_EMAILS (emails separados por coma).
 *
 * Ejemplo en API route o Server Action:
 *   import { createClient } from '@/lib/supabase'
 *   import { isAdminEmail } from '@/lib/auth'
 *   const supabase = createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *   if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
 */

export function getAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}
