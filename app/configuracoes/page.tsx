import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/configuracoes" note="Preferências gerais do ambiente Verbum." />
      <section className="grid">
        <div>
          <p className="kicker">Preferências</p>
          <h1 className="h2">Configurações</h1>
        </div>

        <section className="card" style={{ maxWidth: 820 }}>
          <div className="section-title"><div><h3>Tradução padrão</h3><p className="muted">Usada nas citações e preparações geradas.</p></div><span className="badge">NAA / ARA</span></div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '22px 0' }} />
          <div className="section-title"><div><h3>Tema escuro</h3><p className="muted">Reduz cansaço visual em preparos noturnos.</p></div><span className="badge">Desativado</span></div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '22px 0' }} />
          <div className="section-title"><div><h3>Alertas do radar mais rígidos</h3><p className="muted">Sinaliza riscos teológicos mesmo de baixa probabilidade.</p></div><span className="badge">Ativado</span></div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '22px 0' }} />
          <div className="section-title"><div><h3>Profundidade da preparação</h3><p className="muted">Quanto detalhe a IA produz em cada esboço.</p></div><span className="badge">Aprofundada</span></div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '22px 0' }} />
          <div className="section-title"><div><h3>{user.email}</h3><p className="muted">Usuário autenticado</p></div><form action="/auth/signout" method="post"><button className="btn btn-secondary" type="submit">Sair</button></form></div>
        </section>
      </section>
    </main>
  );
}
