import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

export default async function ChurchProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/perfil-igreja" note="Contexto pastoral para aplicação mais precisa." />
      <section className="grid">
        <div>
          <p className="kicker">Contexto pastoral</p>
          <h1 className="h2">Perfil da igreja</h1>
          <p className="lead" style={{ fontSize: 17 }}>O motor adapta linguagem e aplicação à realidade da comunidade.</p>
        </div>

        <div className="grid-3">
          <div className="stat"><span className="muted">Público predominante</span><strong>Famílias</strong><span className="muted">adultos 30–55, com jovens</span></div>
          <div className="stat"><span className="muted">Maturidade bíblica</span><strong>Intermediária</strong><span className="muted">discipulado ativo</span></div>
          <div className="stat"><span className="muted">Contexto social</span><strong>Urbano misto</strong><span className="muted">classe média</span></div>
        </div>

        <section className="card">
          <p className="kicker">Realidade pastoral</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Famílias em reconstrução', 'Ansiedade e culpa', 'Busca por pertencimento', 'Trabalho intenso'].map((item) => <span className="badge" key={item}>{item}</span>)}
          </div>
        </section>
      </section>
    </main>
  );
}
