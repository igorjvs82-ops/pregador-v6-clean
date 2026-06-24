import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: sermons } = await supabase
    .from('sermons')
    .select('id,title,biblical_text,theme,created_at,status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Painel</h1>
          <p style={{ color: '#475569' }}>Prepare e revise suas mensagens.</p>
        </div>
        <Link className="btn" href="/mensagens/nova">Nova mensagem</Link>
      </div>

      <section className="grid">
        {(sermons ?? []).length === 0 ? (
          <div className="card">
            <h2>Nenhuma mensagem ainda</h2>
            <p style={{ color: '#475569' }}>Crie seu primeiro esboço bíblico cristocêntrico.</p>
            <Link className="btn" href="/mensagens/nova">Criar agora</Link>
          </div>
        ) : (
          sermons?.map((sermon) => (
            <Link className="card" key={sermon.id} href={`/mensagens/${sermon.id}`}>
              <h2>{sermon.title || sermon.theme || sermon.biblical_text}</h2>
              <p style={{ color: '#475569' }}>{sermon.biblical_text} • {sermon.status}</p>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
