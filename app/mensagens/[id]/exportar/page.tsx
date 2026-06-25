import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as AnyRecord : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function itemToText(item: unknown, index: number) {
  if (typeof item === 'string') return `${index + 1}. ${item}`;
  const record = asRecord(item);
  const title = asText(record.title ?? record.point ?? record.heading, `Ponto ${index + 1}`);
  const explanation = asText(record.explanation ?? record.description ?? record.text ?? record.content);
  const christ = asText(record.christ_connection);
  const application = asText(record.application);

  return [
    `${index + 1}. ${title}`,
    explanation ? `   Explicação: ${explanation}` : '',
    christ ? `   Conexão com Cristo: ${christ}` : '',
    application ? `   Aplicação: ${application}` : '',
  ].filter(Boolean).join('\n');
}

function listToText(items: unknown[]) {
  return items.length ? items.map(itemToText).join('\n\n') : 'Nenhum item estruturado gerado.';
}

export default async function ExportSermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermon } = await supabase.from('sermons').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!sermon) notFound();

  const outline = asRecord(sermon.outline ?? sermon.preparation);
  const review = asRecord(sermon.theological_review ?? sermon.theological_radar);
  const title = asText(outline.title, sermon.title ?? 'Preparação bíblica');
  const proposition = asText(outline.proposition ?? outline.big_idea ?? outline.main_idea ?? outline.main_thesis);
  const points = asArray(outline.points ?? outline.structure ?? outline.outline);
  const applications = asArray(outline.applications ?? outline.pastoral_applications);
  const risks = asArray(review.risks ?? review.alerts ?? review.points ?? review.items);
  const adjustments = asArray(review.necessary_adjustments ?? review.adjustments);

  const exportText = [
    `VERBUM — PREPARAÇÃO BÍBLICA`,
    ``,
    `Título: ${title}`,
    `Texto bíblico: ${sermon.biblical_text ?? ''}`,
    `Tema: ${sermon.theme ?? ''}`,
    `Público: ${sermon.audience ?? ''}`,
    `Tipo: ${sermon.sermon_type ?? ''}`,
    `Duração estimada: ${sermon.duration_minutes ?? 30} minutos`,
    ``,
    `PROPOSIÇÃO / TESE`,
    proposition || 'Não informado.',
    ``,
    `OBJETIVO ESPIRITUAL`,
    asText(outline.spiritual_objective) || 'Não informado.',
    ``,
    `INTRODUÇÃO`,
    asText(outline.introduction) || 'Não informado.',
    ``,
    `CONTEXTO BÍBLICO`,
    asText(outline.biblical_context) || 'Não informado.',
    ``,
    `ESTRUTURA`,
    listToText(points),
    ``,
    `APLICAÇÕES PASTORAIS`,
    listToText(applications),
    ``,
    `CONCLUSÃO`,
    asText(outline.conclusion) || 'Não informado.',
    ``,
    `ORAÇÃO FINAL`,
    asText(outline.final_prayer) || 'Não informado.',
    ``,
    `RADAR TEOLÓGICO — RISCOS`,
    listToText(risks),
    ``,
    `AJUSTES NECESSÁRIOS`,
    listToText(adjustments),
    ``,
    `NOTA AO PREGADOR`,
    asText(outline.preacher_note) || 'Base revisável. Revise antes de usar no púlpito.',
  ].join('\n');

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div>
          <nav className="nav">
            <Link href="/dashboard">Painel</Link>
            <Link href={`/mensagens/${id}`}>Resultado</Link>
            <Link href={`/mensagens/${id}/teleprompter`}>Teleprompter</Link>
            <Link href={`/mensagens/${id}/slides`}>Slides</Link>
          </nav>
        </div>
        <p className="sidebar-note">Exportação textual para copiar, revisar e transformar em material final.</p>
      </aside>

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="eyebrow">Verbum Export</span>
          <h1 className="h2" style={{ marginTop: 16 }}>Exportar preparação</h1>
          <p className="lead" style={{ fontSize: 17 }}>Copie o roteiro abaixo para revisar em documento, enviar à equipe ou transformar em material de apoio.</p>
          <div className="actions" style={{ marginTop: 22 }}>
            <Link className="btn btn-secondary" href={`/mensagens/${id}`}>Voltar ao resultado</Link>
            <Link className="btn" href={`/mensagens/${id}/slides`}>Ver slides</Link>
          </div>
        </div>

        <section className="card">
          <div className="section-title">
            <div>
              <p className="kicker">Texto estruturado</p>
              <h2 style={{ margin: 0 }}>Roteiro para revisão</h2>
            </div>
          </div>
          <textarea readOnly value={exportText} rows={34} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 18, padding: 18, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 14, lineHeight: 1.65, color: 'var(--text)', background: '#fff' }} />
          <p className="footer-note" style={{ marginTop: 18 }}>Este material ainda exige revisão bíblica, teológica e pastoral antes de uso público.</p>
        </section>
      </section>
    </main>
  );
}
