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

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/gerar-mensagem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Falha ao gerar mensagem.');
  const generated = await response.json();

  const { data, error } = await supabase
    .from('sermons')
    .insert({
      user_id: user.id,
      title: generated.outline?.title ?? payload.theme ?? 'Nova mensagem',
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
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  redirect(`/mensagens/${data.id}`);
}

export default async function NewSermonPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1>Nova mensagem</h1>
        <p style={{ color: '#475569' }}>Preencha os campos principais. O pregador continua responsável pela revisão final.</p>
        <form action={createSermon}>
          <div className="field"><label>Texto bíblico</label><input name="biblical_text" placeholder="Ex.: Efésios 2.1-10" required /></div>
          <div className="field"><label>Tema</label><input name="theme" placeholder="Ex.: Salvos pela graça" required /></div>
          <div className="field"><label>Público</label><input name="audience" placeholder="Ex.: Igreja local, jovens, célula" required /></div>
          <div className="field"><label>Tipo</label><select name="sermon_type" defaultValue="expositiva"><option value="expositiva">Expositiva</option><option value="tematica">Temática</option><option value="evangelistica">Evangelística</option><option value="doutrinaria">Doutrinária</option><option value="devocional">Devocional</option><option value="celula">Célula</option></select></div>
          <div className="field"><label>Duração em minutos</label><input name="duration_minutes" type="number" defaultValue="30" min="5" max="90" /></div>
          <div className="field"><label>Ocasião</label><input name="occasion" placeholder="Ex.: culto de domingo" /></div>
          <div className="field"><label>Tom</label><input name="tone" placeholder="Ex.: pastoral, claro, confrontador com graça" /></div>
          <button className="btn" type="submit">Gerar mensagem</button>
        </form>
      </section>
    </main>
  );
}
