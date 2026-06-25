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
    .limit(8);

  const total = sermons?.length ?? 0;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div>
          <nav className="nav">
            <Link href="/dashboard">Painel</Link>
            <Link href="/mensagens/nova">Nova preparacao</Link>
            <Link href="/">Landing</Link>
          </nav>
        </div>
        <p className="sidebar-note">Preparacao biblica assistida. A aprovacao final pertence ao pregador.</p>
      </aside>

      <section className="grid">
        <div className="section-title">
          <div>
            <span className="eyebrow">Painel pastoral</span>
            <h1 className="h2" style={{ marginTop: 12 }}>Suas preparacoes</h1>
            <p className="muted">Organize esbocos, revisoes e aplicacoes para sua proxima mensagem.</p>
          </div>
          <Link className="btn" href="/mensagens/nova">Nova preparacao</Link>
        </div>

        <div className="grid-3">
          <div className="stat"><strong>{total}</strong><span className="muted">preparacoes recentes</span></div>
          <div className="stat"><strong>Beta</strong><span className="muted">motor inicial</span></div>
          <div className="stat"><strong>RLS</strong><span className="muted">dados protegidos</span></div>
        </div>

        {(sermons ?? []).length === 0 ? (
          <div className="card">
            <span className="badge">Primeiro passo</span>
            <h2 style={{ marginTop: 14 }}>Crie sua primeira preparacao biblica.</h2>
            <p className="muted">Informe texto biblico, tema, publico e ocasiao. O Verbum entregara uma base inicial para revisao pastoral.</p>
            <Link className="btn btn-gold" href="/mensagens/nova">Criar agora</Link>
          </div>
        ) : (
          <div className="grid-2">
            {sermons?.map((sermon) => (
              <Link className="card sermon-card" key={sermon.id} href={`/mensagens/${sermon.id}`}>
                <span className="badge">{sermon.status}</span>
                <h2>{sermon.title || sermon.theme || sermon.biblical_text}</h2>
                <p className="muted">{sermon.biblical_text}</p>
                <p className="kicker">{sermon.theme || 'Mensagem biblica'}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
