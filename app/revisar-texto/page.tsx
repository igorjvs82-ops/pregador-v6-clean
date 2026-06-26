import { redirect } from 'next/navigation';
import { InternalSidebar } from '@/components/internal-sidebar';
import { requireActiveAccess } from '@/lib/access';

type ReviewObservation = {
  category: string;
  problem: string;
  suggestion: string;
  corrected_text: string;
};

type ReviewResult = {
  score: number;
  summary: string;
  strengths: string[];
  observations: ReviewObservation[];
  corrected_text: string;
  next_steps: string[];
};

async function reviewText(formData: FormData) {
  'use server';

  await requireActiveAccess();

  const text = String(formData.get('text') ?? '').trim();
  const goal = String(formData.get('goal') ?? '').trim();

  if (text.length < 40) {
    redirect('/revisar-texto?error=short');
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pregador-v6-clean-git-main-igor-santos-projects-cb9f18a1.vercel.app';
  const response = await fetch(`${baseUrl}/api/revisar-texto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, goal }),
  });

  if (!response.ok) {
    redirect('/revisar-texto?error=review');
  }

  const result = await response.json() as ReviewResult;
  const encoded = Buffer.from(JSON.stringify({ text, goal, result }), 'utf8').toString('base64url');
  redirect(`/revisar-texto?review=${encoded}`);
}

function parseReview(value?: string) {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as { text: string; goal: string; result: ReviewResult };
  } catch {
    return null;
  }
}

export default async function ReviewTextPage({ searchParams }: { searchParams?: Promise<{ review?: string; error?: string }> }) {
  await requireActiveAccess();
  const params = await searchParams;
  const review = parseReview(params?.review);

  return (
    <main className="app-shell">
      <InternalSidebar active="/revisar-texto" note="Cole um esboço para revisão pastoral e teológica." />
      <section className="grid">
        <div>
          <p className="kicker">Revisão</p>
          <h1 className="h2">Revisar e corrigir um texto</h1>
          <p className="lead" style={{ fontSize: 17 }}>Cole um esboço, sermão ou estudo. O Verbum apontará correções, pontos de atenção e melhorias.</p>
        </div>

        {params?.error === 'short' ? <p className="badge">Cole um texto com pelo menos 40 caracteres.</p> : null}
        {params?.error === 'review' ? <p className="badge">Não foi possível revisar agora. Tente novamente.</p> : null}

        <div className="grid-2">
          <form className="card" action={reviewText} style={{ boxShadow: 'var(--shadow-premium)' }}>
            <div className="section-title">
              <div>
                <p className="kicker">Texto original</p>
                <h2 style={{ margin: 0 }}>Material para revisão</h2>
              </div>
            </div>

            <div className="field">
              <label>Objetivo da revisão</label>
              <input name="goal" defaultValue={review?.goal ?? ''} placeholder="Ex.: melhorar aplicação pastoral, verificar doutrina, clarear estrutura..." />
            </div>
            <div className="field">
              <label>Texto</label>
              <textarea name="text" rows={16} defaultValue={review?.text ?? ''} placeholder="Cole aqui o esboço ou sermão a revisar..." required />
            </div>
            <button className="btn btn-gold" type="submit">Analisar e revisar</button>
            <p className="footer-note" style={{ marginTop: 16 }}>A revisão é apoio. Confira Bíblia, contexto, doutrina e tom pastoral antes de usar.</p>
          </form>

          <aside className="grid">
            {review ? (
              <>
                <section className="card" style={{ boxShadow: 'var(--shadow-premium)' }}>
                  <span className="badge">Índice de fidelidade</span>
                  <h2 style={{ fontSize: 54, margin: '12px 0' }}>{review.result.score}%</h2>
                  <p className="muted">{review.result.summary}</p>
                </section>

                <section className="card">
                  <p className="kicker">Pontos fortes</p>
                  <div className="checklist">
                    {review.result.strengths.map((item) => <p key={item}>✓ {item}</p>)}
                  </div>
                </section>
              </>
            ) : (
              <section className="card-soft" style={{ textAlign: 'center', borderStyle: 'dashed', padding: 42 }}>
                <span className="badge">Pronto para analisar</span>
                <h3>Cole um texto à esquerda.</h3>
                <p className="muted">A análise aparecerá aqui com índice, observações e texto corrigido.</p>
              </section>
            )}
          </aside>
        </div>

        {review ? (
          <>
            <section className="card">
              <div className="section-title">
                <div>
                  <p className="kicker">Observações</p>
                  <h2 style={{ margin: 0 }}>Correções sugeridas</h2>
                </div>
              </div>
              <div className="grid">
                {review.result.observations.map((item, index) => (
                  <div className="card-soft" key={`${item.category}-${index}`}>
                    <span className="badge">{item.category}</span>
                    <h3>{item.problem}</h3>
                    <p className="muted"><strong>Sugestão:</strong> {item.suggestion}</p>
                    <p className="footer-note"><strong>Texto sugerido:</strong> {item.corrected_text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="section-title">
                <div>
                  <p className="kicker">Texto corrigido</p>
                  <h2 style={{ margin: 0 }}>Base revisada</h2>
                </div>
              </div>
              <textarea readOnly rows={16} value={review.result.corrected_text} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 18, padding: 18, font: 'inherit', lineHeight: 1.7 }} />
              <div className="checklist" style={{ marginTop: 18 }}>
                {review.result.next_steps.map((step) => <p key={step}>→ {step}</p>)}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}
