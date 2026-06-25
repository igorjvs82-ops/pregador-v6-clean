import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    return NextResponse.redirect(new URL('/?beta=invalid#beta', request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.from('beta_leads').insert(payload);

  if (error) {
    console.error('beta_leads_insert_error', error.message);
    return NextResponse.redirect(new URL('/?beta=error#beta', request.url));
  }

  return NextResponse.redirect(new URL('/?beta=ok#beta', request.url));
}
