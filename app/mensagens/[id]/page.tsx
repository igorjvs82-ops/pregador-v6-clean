import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function JsonBlock({ data }: { data: unknown }) {
  return <pre className="result-block">{JSON.stringify(data, null, 2)}</pre>;
}

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermon } = await supabase.from('sermons').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!sermon) notFound();

  const outline = sermon.outline ?? sermon.preparation;
  const review = sermon.theological_review ?? sermon.theological_radar;

  return (
    <main className="app-shell">
      <aside className="sidebar"><div><div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div><nav className="nav"><Link href="/dashboard">Painel</Link><Link href="/mensagens/nova">Nova preparacao</Link><Link href="/">Landing</Link></nav></div><p className="sidebar-note">Leia, ajuste e aprove a preparacao antes de usar no pulpito.</p></aside>
      <section className="grid">
        <div className="card">
          <span className="badge">{sermon.status}</span>
          <h1 className="h2" style={{ marginTop: 14 }}>{sermon.title}</h1>
          <p className="lead" style={{ fontSize: 18 }}>{sermon.biblical_text} • {sermon.theme}</p>
          <div className="actions"><Link className="btn btn-secondary" href="/dashboard">Voltar ao painel</Link><Link className="btn" href="/mensagens/nova">Nova preparacao</Link></div>
        </div>

        <div className="grid-2">
          <section className="card"><p className="kicker">Base gerada</p><h2>Estrutura da mensagem</h2><JsonBlock data={outline} /></section>
          <section className="card"><p className="kicker">Verbum Radar</p><h2>Alertas e ajustes</h2><JsonBlock data={review} /></section>
        </div>
      </section>
    </main>
  );
}
