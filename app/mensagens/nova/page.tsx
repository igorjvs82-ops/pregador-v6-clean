import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

async function createSermon(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const payload = {
    biblical_text: String(formData.get('biblical_text') ?? ''),
    theme: String(formData.get('theme') ?? ''),
    audience: String(formData.get('audience') ?? ''),
    sermon_type: String(formData.get('sermon_type') ?? 'expositiva'),
    duration_minutes: Number(formData.get('duration_minutes') ?? 30),
    occasion: String(formData.get('occasion') ?? ''),
    tone: String(formData.get('tone') ?? ''),
    spiritual_goal: String(formData.get('spiritual_goal') ?? ''),
    sensitive_points: String(formData.get('sensitive_points') ?? ''),
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pregador-v6-clean-git-main-igor-santos-projects-cb9f18a1.vercel.app';
  const response = await fetch(`${baseUrl}/api/gerar-mensagem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

  if (!response.ok) throw new Error('Falha ao gerar preparação.');
  const generated = await response.json();

  const { data, error } = await supabase.from('sermons').insert({
    user_id: user.id,
    title: generated.outline?.title ?? payload.theme ?? 'Nova preparação',
    biblical_text: payload.biblical_text,
    theme: payload.theme,
    audience: payload.audience,
    sermon_type: payload.sermon_type,
    duration_minutes: payload.duration_minutes,
    occasion: payload.occasion,
    tone: payload.tone,
    input: payload,
    outline: generated.outline,
    theological_review: generated.theological_review,
    preparation: generated.outline ?? {},
    theological_radar: generated.theological_review ?? {},
    church_message: {},
    status: 'generated',
  }).select('id').single();

  if (error) throw new Error(error.message);
  redirect(`/mensagens/${data.id}`);
}

export default async function NewSermonPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/mensagens/nova" note="Gere uma base revisável. Revise texto, contexto e aplicações antes de pregar." />

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="eyebrow">Verbum Prepare</span>
          <h1 className="h2" style={{ marginTop: 16 }}>Nova preparação bíblica</h1>
          <p className="lead" style={{ fontSize: 17 }}>Informe o texto, o público e a intenção pastoral. O Verbum organizará uma base inicial com estrutura homilética e revisão teológica para você avaliar.</p>
        </div>

        <div className="grid-2">
          <form className="card" action={createSermon} style={{ boxShadow: 'var(--shadow-premium)' }}>
            <div className="section-title">
              <div>
                <p className="kicker">Dados da mensagem</p>
                <h2 style={{ margin: 0 }}>Contexto bíblico e pastoral</h2>
              </div>
            </div>

            <div className="form-grid">
              <div className="field full"><label>Texto bíblico</label><input name="biblical_text" placeholder="Ex.: Efésios 2.1-10" required /></div>
              <div className="field"><label>Tema ou direção</label><input name="theme" placeholder="Ex.: Salvos pela graça" required /></div>
              <div className="field"><label>Público</label><input name="audience" placeholder="Ex.: igreja local, jovens, célula" required /></div>
              <div className="field"><label>Tipo</label><select name="sermon_type" defaultValue="expositiva"><option value="expositiva">Expositiva</option><option value="textual">Textual</option><option value="tematica">Temática</option><option value="evangelistica">Evangelística</option><option value="doutrinaria">Doutrinária</option><option value="devocional">Devocional</option><option value="estudo_biblico">Estudo bíblico</option><option value="celula">Célula</option></select></div>
              <div className="field"><label>Duração estimada</label><input name="duration_minutes" type="number" defaultValue="30" min="5" max="90" /></div>
              <div className="field"><label>Ocasião</label><input name="occasion" placeholder="Ex.: culto de domingo" /></div>
              <div className="field"><label>Tom desejado</label><input name="tone" placeholder="Ex.: pastoral, claro e expositivo" /></div>
              <div className="field full"><label>Objetivo espiritual</label><textarea name="spiritual_goal" rows={3} placeholder="Ex.: levar a igreja a descansar na graça de Cristo e responder com gratidão." /></div>
              <div className="field full"><label>Pontos sensíveis para considerar</label><textarea name="sensitive_points" rows={3} placeholder="Ex.: evitar moralismo, considerar visitantes, tratar culpa com cuidado pastoral." /></div>
            </div>

            <div className="actions" style={{ marginTop: 10 }}><button className="btn" type="submit">Gerar base revisável</button><Link className="btn btn-secondary" href="/dashboard">Cancelar</Link></div>
            <p className="footer-note" style={{ marginTop: 20 }}>A geração é ponto de partida. Leia, corrija, ajuste aplicações e aprove somente o que estiver fiel ao texto.</p>
          </form>

          <aside className="grid">
            <div className="card">
              <span className="badge">Como funciona</span>
              <h3>O que será gerado?</h3>
              <p className="muted">Uma base com título, proposição, estrutura, aplicações, oração e Radar Teológico. Nada deve ser usado sem revisão pastoral.</p>
            </div>
            <div className="card">
              <span className="badge">Critério pastoral</span>
              <h3>Revise antes de pregar.</h3>
              <p className="muted">Confira contexto, doutrina, tom, aplicações e possíveis exageros. O Verbum apoia o processo, mas não decide pelo pregador.</p>
            </div>
            <div className="card">
              <span className="badge">Sugestão</span>
              <h3>Quanto mais contexto, melhor.</h3>
              <p className="muted">Inclua ocasião, público, objetivo espiritual e pontos sensíveis para que a base seja mais útil à sua realidade.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
