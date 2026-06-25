import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
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
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #171124, #2e2440)', color: '#fff', padding: 24 }}>
      <section style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 22 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <Link href={`/mensagens/${id}`} style={{ color: 'rgba(255,255,255,.68)', fontWeight: 800 }}>← Voltar à preparação</Link>
            <h1 style={{ fontSize: 'clamp(34px, 6vw, 72px)', lineHeight: .95, letterSpacing: '-.06em', margin: '14px 0 8px' }}>{title}</h1>
            <p style={{ color: 'rgba(255,255,255,.68)', fontSize: 18 }}>{sermon.biblical_text} · Teleprompter pastoral</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-secondary" href={`/mensagens/${id}`}>Editar/revisar</Link>
            <Link className="btn" href="/dashboard">Painel</Link>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18 }}>
          <aside className="card" style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.14)', color: '#fff', position: 'sticky', top: 24, alignSelf: 'start' }}>
            <p className="kicker" style={{ color: '#a886f0' }}>Blocos</p>
            <div style={{ display: 'grid', gap: 8 }}>
              {blocks.map((block, index) => <a key={block.label} href={`#bloco-${index}`} style={{ color: 'rgba(255,255,255,.78)', fontWeight: 800 }}>{block.label}</a>)}
            </div>
            <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 13, lineHeight: 1.5, marginTop: 20 }}>Use esta tela como roteiro de apoio. Revise todo o conteúdo antes de usar no púlpito.</p>
          </aside>

          <section style={{ display: 'grid', gap: 18 }}>
            {blocks.map((block, index) => (
              <article id={`bloco-${index}`} key={`${block.label}-${index}`} style={{ border: '1px solid rgba(255,255,255,.13)', background: 'rgba(255,255,255,.07)', borderRadius: 28, padding: 'clamp(26px, 5vw, 54px)', boxShadow: '0 30px 80px -44px rgba(0,0,0,.7)' }}>
                <p style={{ color: '#a886f0', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 13 }}>{block.label}</p>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 'clamp(28px, 4.4vw, 56px)', lineHeight: 1.18, letterSpacing: '-.035em' }}>{block.text}</div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
