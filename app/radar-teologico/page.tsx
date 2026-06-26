import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

const checks = [
  { status: 'ok', title: 'Texto analisado no contexto histórico', detail: 'A passagem foi lida dentro do argumento bíblico imediato.' },
  { status: 'warn', title: 'Aplicação precisa nascer do texto', detail: 'Revise se a aplicação não está sendo importada de fora da passagem.' },
  { status: 'ok', title: 'Cristo central, sem alegoria forçada', detail: 'A mensagem aponta para a obra de Cristo de forma textual.' },
  { status: 'ok', title: 'Sem prosperidade ou triunfalismo', detail: 'Nenhuma promessa fora da base textual foi detectada.' },
];

export default async function TheologyRadarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/radar-teologico" note="Use o radar como revisão, não como autoridade final." />
      <section className="grid">
        <div className="section-title">
          <div>
            <p className="kicker">Revisão</p>
            <h1 className="h2">Radar teológico</h1>
          </div>
          <div style={{ textAlign: 'right' }}><strong style={{ color: 'var(--success)', fontSize: 42 }}>87%</strong><p className="muted">segurança da mensagem</p></div>
        </div>

        <div className="grid">
          {checks.map((check) => (
            <section className="card-soft" key={check.title} style={check.status === 'warn' ? { borderColor: '#f3d49b', background: '#fff9ef' } : { borderColor: '#cfeedd', background: '#f4fff8' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span className="badge">{check.status === 'warn' ? '!' : '✓'}</span>
                <div>
                  <h3 style={{ margin: 0 }}>{check.title}</h3>
                  <p className="muted" style={{ margin: '6px 0 0' }}>{check.detail}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
