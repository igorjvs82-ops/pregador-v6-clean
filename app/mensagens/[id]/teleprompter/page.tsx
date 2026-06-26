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

function pointToText(item: unknown, index: number) {
  if (typeof item === 'string') return item;
  const record = asRecord(item);
  const title = asText(record.title ?? record.point ?? record.heading, `Ponto ${index + 1}`);
  const body = asText(record.description ?? record.explanation ?? record.text ?? record.content);
  return body ? `${title}\n${body}` : title;
}

export default async function TeleprompterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermon } = await supabase.from('sermons').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!sermon) notFound();

  const outline = asRecord(sermon.outline ?? sermon.preparation);
  const title = asText(outline.title, sermon.title ?? 'Preparação bíblica');
  const proposition = asText(outline.proposition ?? outline.big_idea ?? outline.main_idea);
  const introduction = asText(outline.introduction);
  const conclusion = asText(outline.conclusion);
  const points = asArray(outline.points ?? outline.structure ?? outline.outline).map(pointToText);
  const applications = asArray(outline.applications ?? outline.pastoral_applications).map(pointToText);

  const blocks = [
    { label: 'Texto bíblico', text: `${sermon.biblical_text ?? ''}` },
    proposition ? { label: 'Proposição', text: proposition } : null,
    introduction ? { label: 'Introdução', text: introduction } : null,
    ...points.map((text, index) => ({ label: `Ponto ${index + 1}`, text })),
    ...applications.map((text, index) => ({ label: `Aplicação ${index + 1}`, text })),
    conclusion ? { label: 'Conclusão', text: conclusion } : null,
  ].filter(Boolean) as { label: string; text: string }[];

  return (
    <main className="app-shell">
      <InternalSidebar active="/minhas-mensagens" note="Roteiro limpo para ensaio e apoio de púlpito." />

      <section className="grid">
        <div className="section-title">
          <div>
            <p className="kicker">Teleprompter pastoral</p>
            <h1 className="h2">{title}</h1>
            <p className="lead" style={{ fontSize: 17 }}>{sermon.biblical_text}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={`/mensagens/${id}`}>Editar/revisar</Link>
            <Link className="btn btn-secondary" href={`/mensagens/${id}/slides`}>Slides</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18 }}>
          <aside className="card" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <p className="kicker">Blocos</p>
            <div style={{ display: 'grid', gap: 8 }}>
              {blocks.map((block, index) => <a key={block.label} href={`#bloco-${index}`} style={{ fontWeight: 800 }}>{block.label}</a>)}
            </div>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 20 }}>Use como apoio. Revise tudo antes de pregar.</p>
          </aside>

          <section style={{ display: 'grid', gap: 18 }}>
            {blocks.map((block, index) => (
              <article id={`bloco-${index}`} key={`${block.label}-${index}`} className="card" style={{ background: 'linear-gradient(135deg, var(--hero-1), var(--hero-2))', color: '#fff', boxShadow: 'var(--shadow-premium)' }}>
                <p className="kicker" style={{ color: 'rgba(255,255,255,.68)' }}>{block.label}</p>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 'clamp(28px, 4vw, 50px)', lineHeight: 1.18, letterSpacing: '-.035em' }}>{block.text}</div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
