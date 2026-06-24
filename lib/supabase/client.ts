import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cvfnykfvmgltoaalmkno.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_SB1PyM3hY4NXTKeobqcMMg_afACkeS2';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
