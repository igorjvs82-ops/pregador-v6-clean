import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function redirectTo(request: Request, status: 'ok' | 'invalid' | 'error') {
  return NextResponse.redirect(new URL(`/?beta=${status}#beta`, request.url), 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    whatsapp: String(formData.get('whatsapp') ?? '').trim(),
    role: String(formData.get('role') ?? '').trim(),
    frequency: String(formData.get('frequency') ?? '').trim(),
    main_challenge: String(formData.get('main_challenge') ?? '').trim(),
    expectation: String(formData.get('expectation') ?? '').trim(),
    source: 'verbum-landing-beta',
  };

  if (!payload.name || !payload.email || !payload.whatsapp) {
    return redirectTo(request, 'invalid');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('beta_leads').insert(payload);

  if (error) {
    console.error('beta_leads_insert_error', error.message);
    return redirectTo(request, 'error');
  }

  return redirectTo(request, 'ok');
}
