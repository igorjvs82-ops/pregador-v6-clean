import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

export default async function PreacherProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const name = user.email?.split('@')[0] ?? 'Pregador';

  return (
    <main className="app-shell">
      <InternalSidebar active="/perfil-pregador" note="Personalize estilo, linha teológica e tom pastoral." />
      <section className="grid">
        <div className="section-title">
          <div>
            <p className="kicker">Perfil do pregador</p>
            <h1 className="h2">Pr. {name}</h1>
            <p className="lead" style={{ fontSize: 17 }}>Configure preferências para que a preparação soe menos genérica.</p>
          </div>
          <button className="btn btn-secondary" type="button">Editar perfil</button>
        </div>

        <div className="grid-2">
          <section className="card">
            <p className="kicker">Estilo de pregação</p>
            <div className="checklist">
              <p><strong>Expositivo</strong> · forte</p>
              <p><strong>Pastoral/consolador</strong> · médio-alto</p>
              <p><strong>Profundidade doutrinária</strong> · alta</p>
            </div>
          </section>
          <section className="card">
            <p className="kicker">Linha teológica e preferências</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['Reformado', 'Cristocêntrico', 'Aliança', 'ARA/NAA'].map((tag) => <span className="badge" key={tag}>{tag}</span>)}
            </div>
            <p className="kicker" style={{ marginTop: 22 }}>Sempre evitar</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['Prosperidade', 'Moralismo', 'Alegoria forçada'].map((tag) => <span className="badge" key={tag}>{tag}</span>)}
            </div>
          </section>
        </div>

        <section className="card" style={{ background: 'linear-gradient(135deg, var(--hero-1), var(--hero-2))', color: '#fff' }}>
          <p className="kicker">Como o motor usa este perfil</p>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 18 }}>Cada preparação herda seu estilo, linha teológica e pontos a evitar para que o esboço soe como apoio ao pregador, e não como texto genérico.</p>
        </section>
      </section>
    </main>
  );
}
