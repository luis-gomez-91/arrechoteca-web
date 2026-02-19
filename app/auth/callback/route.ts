import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

  if (code) {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${origin}/auth/error`)
      }
      
      console.log('Session created successfully:', data.session?.user?.email)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  // Redirigir a donde el usuario quería ir, o a la página principal
  const finalRedirect = redirectTo || '/'
  return NextResponse.redirect(`${origin}${finalRedirect}`)
}