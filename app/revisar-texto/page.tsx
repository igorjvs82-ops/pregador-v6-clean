import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

export default async function ReviewTextPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/revisar-texto" note="Cole um esboço para revisão pastoral e teológica." />
      <section className="grid">
        <div>
          <p className="kicker">Revisão</p>
          <h1 className="h2">Revisar e corrigir um texto</h1>
          <p className="lead" style={{ fontSize: 17 }}>Importe ou cole um esboço, sermão ou estudo. O Verbum apontará correções, pontos de atenção e melhorias.</p>
        </div>

        <section className="card" style={{ maxWidth: 880 }}>
          <div className="card-soft" style={{ textAlign: 'center', borderStyle: 'dashed', padding: 42 }}>
            <span className="badge">Importar arquivo</span>
            <h3>Arquivo .txt ou .md</h3>
            <p className="muted">Em breve: upload direto. Por enquanto, cole o texto abaixo.</p>
          </div>
          <textarea rows={12} placeholder="Cole aqui o esboço ou sermão a revisar..." style={{ width: '100%', marginTop: 18, padding: 18, borderRadius: 18, border: '1px solid var(--border)', background: 'var(--surface-soft)', font: 'inherit' }} />
          <button className="btn btn-gold" type="button" style={{ marginTop: 18 }}>Analisar e revisar</button>
        </section>
      </section>
    </main>
  );
}
