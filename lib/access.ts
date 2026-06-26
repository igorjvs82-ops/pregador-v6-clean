import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireActiveAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.status === 'blocked') {
    redirect('/conta-bloqueada');
  }

  return { supabase, user, profile };
}
