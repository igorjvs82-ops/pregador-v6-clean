import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

const topics = ['Amor', 'Graça', 'Perdão', 'Esperança', 'Ansiedade e medo', 'Fé', 'Gratidão', 'Perseverança', 'Arrependimento', 'Consolo'];

export default async function VersesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/versiculos" note="Encontre textos bíblicos por tema e uso pastoral." />
      <section className="grid">
        <div>
          <p className="kicker">Concordância temática</p>
          <h1 className="h2">Versículos por tema</h1>
          <p className="lead" style={{ fontSize: 17 }}>Digite um assunto e receba referências bíblicas para estudo, pregação ou meditação.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {topics.map((topic) => <span className="badge" key={topic}>{topic}</span>)}
        </div>

        <section className="card" style={{ maxWidth: 940 }}>
          <div className="card-soft" style={{ textAlign: 'center', borderStyle: 'dashed', padding: 58 }}>
            <h3>Sobre o que você quer pregar ou meditar?</h3>
            <p className="muted">Ex.: amor, graça, perdão, ansiedade, esperança...</p>
          </div>
          <div className="actions" style={{ marginTop: 20 }}>
            <input placeholder="Digite um tema..." style={{ flex: 1, padding: 16, borderRadius: 16, border: '1px solid var(--border)', font: 'inherit' }} />
            <button className="btn" type="button">Buscar</button>
          </div>
        </section>
      </section>
    </main>
  );
}
