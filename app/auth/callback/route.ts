import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const errorCode = requestUrl.searchParams.get('error_code');

  if (error) {
    const reason = errorCode === 'otp_expired' ? 'expired' : 'denied';
    return NextResponse.redirect(new URL(`/login?error=${reason}`, requestUrl.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', requestUrl.origin));
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(new URL('/login?error=invalid_link', requestUrl.origin));
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
