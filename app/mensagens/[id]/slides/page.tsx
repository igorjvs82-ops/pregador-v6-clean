import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

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

function pointTitle(item: unknown, index: number) {
  if (typeof item === 'string') return item;
  const record = asRecord(item);
  return asText(record.title ?? record.point ?? record.heading, `Ponto ${index + 1}`);
}

function pointBody(item: unknown) {
  if (typeof item === 'string') return '';
  const record = asRecord(item);
  return asText(record.description ?? record.explanation ?? record.text ?? record.content);
}

export default async function SlidesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermon } = await supabase.from('sermons').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!sermon) notFound();

  const outline = asRecord(sermon.outline ?? sermon.preparation);
  const title = asText(outline.title, sermon.title ?? 'Preparação bíblica');
  const proposition = asText(outline.proposition ?? outline.big_idea ?? outline.main_idea);
  const conclusion = asText(outline.conclusion);
  const points = asArray(outline.points ?? outline.structure ?? outline.outline);
  const applications = asArray(outline.applications ?? outline.pastoral_applications);

  const slides = [
    { eyebrow: 'Mensagem', title, body: `${sermon.biblical_text ?? ''}`, dark: true },
    proposition ? { eyebrow: 'Proposição', title: proposition, body: 'Ideia central da mensagem', dark: false } : null,
    ...points.map((item, index) => ({ eyebrow: `Ponto ${index + 1}`, title: pointTitle(item, index), body: pointBody(item), dark: false })),
    ...applications.slice(0, 3).map((item, index) => ({ eyebrow: `Aplicação ${index + 1}`, title: pointTitle(item, index), body: pointBody(item), dark: false })),
    conclusion ? { eyebrow: 'Conclusão', title: conclusion, body: 'Encerramento e resposta pastoral', dark: true } : null,
  ].filter(Boolean) as { eyebrow: string; title: string; body: string; dark: boolean }[];

  return (
    <main className="app-shell">
      <InternalSidebar active="/minhas-mensagens" note="Slides são apoio visual. Revise antes de apresentar." />

      <section className="grid">
        <div className="section-title">
          <div>
            <p className="kicker">Roteiro visual</p>
            <h1 className="h2">Slides · {sermon.biblical_text}</h1>
            <p className="lead" style={{ fontSize: 17 }}>{title}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={`/mensagens/${id}`}>Voltar ao esboço</Link>
            <Link className="btn btn-secondary" href={`/mensagens/${id}/teleprompter`}>Teleprompter</Link>
            <button className="btn" type="button">Exportar PPTX</button>
          </div>
        </div>

        <div className="feature-grid">
          {slides.map((slide, index) => (
            <article key={`${slide.eyebrow}-${index}`} className="feature-card" style={{ minHeight: 230, background: slide.dark ? 'linear-gradient(135deg, var(--hero-1), var(--hero-2))' : undefined, color: slide.dark ? '#fff' : undefined }}>
              <div className="section-title">
                <p className="kicker" style={slide.dark ? { color: 'rgba(255,255,255,.7)' } : undefined}>{slide.eyebrow}</p>
                <strong style={{ opacity: .35, fontSize: 34 }}>{String(index + 1).padStart(2, '0')}</strong>
              </div>
              <h3 style={{ fontSize: 26, marginTop: 28 }}>{slide.title}</h3>
              {slide.body ? <p style={{ color: slide.dark ? 'rgba(255,255,255,.72)' : undefined }}>{slide.body}</p> : null}
            </article>
          ))}
          <Link className="feature-card" href={`/mensagens/${id}/teleprompter`} style={{ display: 'grid', placeItems: 'center', minHeight: 230, borderStyle: 'dashed' }}>
            <div style={{ textAlign: 'center' }}><b>Apresentar</b><h3>Abrir apoio de púlpito</h3></div>
          </Link>
        </div>
      </section>
    </main>
  );
}
