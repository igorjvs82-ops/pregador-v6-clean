import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pregador-v6-clean-igor-santos-projects-cb9f18a1.vercel.app';
  const response = await fetch(`${baseUrl}/api/gerar-mensagem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

  if (!response.ok) throw new Error('Falha ao gerar preparacao.');
  const generated = await response.json();

  const { data, error } = await supabase.from('sermons').insert({
    user_id: user.id,
    title: generated.outline?.title ?? payload.theme ?? 'Nova preparacao',
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
      <aside className="sidebar"><div><div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div><nav className="nav"><Link href="/dashboard">Painel</Link><Link href="/mensagens/nova">Nova preparacao</Link><Link href="/">Landing</Link></nav></div><p className="sidebar-note">Gere uma base revisavel. Revise texto, contexto e aplicacoes antes de pregar.</p></aside>
      <section className="grid">
        <div><span className="eyebrow">Verbum Prepare</span><h1 className="h2" style={{ marginTop: 12 }}>Nova preparacao biblica</h1><p className="muted">Preencha os dados essenciais para gerar uma base biblica estruturada e uma revisao teologica inicial.</p></div>
        <form className="card" action={createSermon}>
          <div className="form-grid">
            <div className="field full"><label>Texto biblico</label><input name="biblical_text" placeholder="Ex.: Efesios 2.1-10" required /></div>
            <div className="field"><label>Tema</label><input name="theme" placeholder="Ex.: Salvos pela graca" required /></div>
            <div className="field"><label>Publico</label><input name="audience" placeholder="Ex.: jovens, igreja local, celula" required /></div>
            <div className="field"><label>Tipo</label><select name="sermon_type" defaultValue="expositiva"><option value="expositiva">Expositiva</option><option value="tematica">Tematica</option><option value="evangelistica">Evangelistica</option><option value="doutrinaria">Doutrinaria</option><option value="devocional">Devocional</option><option value="celula">Celula</option></select></div>
            <div className="field"><label>Duracao</label><input name="duration_minutes" type="number" defaultValue="30" min="5" max="90" /></div>
            <div className="field"><label>Ocasiao</label><input name="occasion" placeholder="Ex.: culto de domingo" /></div>
            <div className="field"><label>Tom</label><input name="tone" placeholder="Ex.: pastoral e claro" /></div>
          </div>
          <div className="actions" style={{ marginTop: 10 }}><button className="btn" type="submit">Gerar base revisavel</button><Link className="btn btn-secondary" href="/dashboard">Cancelar</Link></div>
        </form>
      </section>
    </main>
  );
}
