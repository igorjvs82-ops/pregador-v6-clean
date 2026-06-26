import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

const series = [
  { book: 'Romanos', title: 'Sem condenação', description: '8 mensagens sobre vida no Espírito.', progress: '5/8', color: 'linear-gradient(135deg, var(--hero-1), var(--hero-2))' },
  { book: 'Salmos', title: 'O Deus que consola', description: '6 mensagens para tempos de aflição.', progress: '6/6', color: 'linear-gradient(135deg, #245f50, #397a69)' },
  { book: 'Efésios', title: 'Pela graça, pela fé', description: 'Planejamento de 10 mensagens.', progress: '1/10', color: 'linear-gradient(135deg, #7b4d20, #9d6a32)' },
];

export default async function SeriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/series-biblicas" note="Planeje campanhas, livros bíblicos e calendários." />
      <section className="grid">
        <div className="section-title">
          <div>
            <p className="kicker">Biblioteca</p>
            <h1 className="h2">Suas séries de pregação</h1>
          </div>
          <button className="btn" type="button">Nova série</button>
        </div>

        <div className="feature-grid">
          {series.map((item) => (
            <section className="feature-card" key={item.title}>
              <div style={{ background: item.color, color: '#fff', borderRadius: 18, padding: 26, margin: '-8px -8px 22px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 28, margin: 0 }}>{item.book}</h3>
              </div>
              <div className="section-title">
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <span className="badge">{item.progress}</span>
              </div>
              <p className="muted">{item.description}</p>
            </section>
          ))}
          <section className="feature-card" style={{ display: 'grid', placeItems: 'center', minHeight: 220, borderStyle: 'dashed' }}>
            <div style={{ textAlign: 'center' }}>
              <h3>Planejar nova série</h3>
              <p className="muted">Em breve: calendário, temas e mensagens vinculadas.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
