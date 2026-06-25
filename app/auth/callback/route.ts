import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') ?? 'email';
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const errorCode = requestUrl.searchParams.get('error_code');

  if (error) {
    const reason = errorCode === 'otp_expired' ? 'expired' : 'denied';
    return NextResponse.redirect(new URL(`/login?error=${reason}`, requestUrl.origin));
  }

  if (!code && !tokenHash) {
    return NextResponse.redirect(new URL('/login?error=missing_code', requestUrl.origin));
  }

  const supabase = await createClient();

  if (tokenHash) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'email',
    });

    if (verifyError) {
      console.error('Supabase verifyOtp failed', {
        message: verifyError.message,
        status: verifyError.status,
        type,
      });
      return NextResponse.redirect(new URL('/login?error=invalid_link', requestUrl.origin));
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code!);

  if (exchangeError) {
    console.error('Supabase exchangeCodeForSession failed', {
      message: exchangeError.message,
      status: exchangeError.status,
    });
    return NextResponse.redirect(new URL('/login?error=invalid_link', requestUrl.origin));
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
