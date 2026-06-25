import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value));
}

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
  const firstName = user.email?.split('@')[0] ?? 'pregador';

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div>
          <nav className="nav">
            <Link href="/dashboard">Painel</Link>
            <Link href="/mensagens/nova">Nova preparação</Link>
            <Link href="/#planos">Planos</Link>
            <Link href="/uso-responsavel">Uso responsável</Link>
          </nav>
        </div>
        <p className="sidebar-note">Preparação bíblica assistida. A aprovação final pertence ao pregador.</p>
      </aside>

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <div className="section-title">
            <div>
              <span className="eyebrow">Painel pastoral</span>
              <h1 className="h2" style={{ marginTop: 16 }}>Bem-vindo ao Verbum, {firstName}.</h1>
              <p className="lead" style={{ fontSize: 17 }}>Comece uma nova base de preparação, revise mensagens recentes e mantenha seu processo organizado em um só lugar.</p>
            </div>
            <Link className="btn" href="/mensagens/nova">Nova preparação</Link>
          </div>
        </div>

        <div className="grid-3">
          <div className="stat"><strong>{total}</strong><span className="muted">preparações recentes</span></div>
          <div className="stat"><strong>Radar</strong><span className="muted">revisão teológica</span></div>
          <div className="stat"><strong>Beta</strong><span className="muted">acesso antecipado</span></div>
        </div>

        <div className="grid-2">
          <div className="card">
            <span className="badge">Próxima ação</span>
            <h2 style={{ marginTop: 14 }}>Prepare sua próxima mensagem.</h2>
            <p className="muted">Informe texto bíblico, público, ocasião e objetivo pastoral. O Verbum organizará uma base revisável para seu estudo.</p>
            <Link className="btn btn-gold" href="/mensagens/nova">Começar preparação</Link>
          </div>
          <div className="card">
            <span className="badge">Método Verbum</span>
            <h2 style={{ marginTop: 14 }}>Revise antes de pregar.</h2>
            <p className="muted">Use o Radar como apoio para observar fidelidade textual, contexto, doutrina, aplicação e clareza homilética.</p>
            <Link className="btn btn-secondary" href="/uso-responsavel">Ver uso responsável</Link>
          </div>
        </div>

        <section className="card">
          <div className="section-title">
            <div>
              <p className="kicker">Histórico</p>
              <h2 style={{ margin: 0 }}>Preparações recentes</h2>
            </div>
            <Link className="btn btn-secondary" href="/mensagens/nova">Nova</Link>
          </div>

          {(sermons ?? []).length === 0 ? (
            <div className="card-soft">
              <h3 style={{ marginTop: 0 }}>Nenhuma preparação criada ainda.</h3>
              <p className="muted">Crie sua primeira preparação bíblica e veja aqui seu histórico de mensagens.</p>
              <Link className="btn" href="/mensagens/nova">Criar primeira preparação</Link>
            </div>
          ) : (
            <div className="grid-2">
              {sermons?.map((sermon) => (
                <Link className="card-soft sermon-card" key={sermon.id} href={`/mensagens/${sermon.id}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <span className="badge">{sermon.status}</span>
                    <span className="muted" style={{ fontSize: 13 }}>{formatDate(sermon.created_at)}</span>
                  </div>
                  <h3 style={{ marginBottom: 8 }}>{sermon.title || sermon.theme || sermon.biblical_text}</h3>
                  <p className="muted" style={{ marginBottom: 6 }}>{sermon.biblical_text}</p>
                  <p className="kicker">{sermon.theme || 'Mensagem bíblica'}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
