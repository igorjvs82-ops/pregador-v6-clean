import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function JsonBlock({ data }: { data: unknown }) {
  return <pre style={{ whiteSpace: 'pre-wrap', background: '#f1f5f9', borderRadius: 12, padding: 16, overflowX: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>;
}

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermon } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!sermon) notFound();

  return (
    <main className="container">
      <Link href="/dashboard" style={{ color: '#475569' }}>← Voltar</Link>
      <section className="card" style={{ marginTop: 16 }}>
        <h1>{sermon.title}</h1>
        <p style={{ color: '#475569' }}>{sermon.biblical_text} • {sermon.theme}</p>
        <h2>Esboço</h2>
        <JsonBlock data={sermon.outline ?? sermon.preparation} />
        <h2>Revisão teológica</h2>
        <JsonBlock data={sermon.theological_review ?? sermon.theological_radar} />
      </section>
    </main>
  );
}
