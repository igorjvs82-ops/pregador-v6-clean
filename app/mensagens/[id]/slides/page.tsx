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
    { eyebrow: 'Mensagem', title, body: `${sermon.biblical_text ?? ''}` },
    proposition ? { eyebrow: 'Proposição', title: proposition, body: 'Ideia central da mensagem' } : null,
    ...points.map((item, index) => ({ eyebrow: `Ponto ${index + 1}`, title: pointTitle(item, index), body: pointBody(item) })),
    ...applications.slice(0, 3).map((item, index) => ({ eyebrow: `Aplicação ${index + 1}`, title: pointTitle(item, index), body: pointBody(item) })),
    conclusion ? { eyebrow: 'Conclusão', title: conclusion, body: 'Encerramento e resposta pastoral' } : null,
  ].filter(Boolean) as { eyebrow: string; title: string; body: string }[];

  return (
    <main style={{ minHeight: '100vh', background: '#171124', color: '#fff', padding: 24 }}>
      <section style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 24 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <Link href={`/mensagens/${id}`} style={{ color: 'rgba(255,255,255,.68)', fontWeight: 800 }}>← Voltar à preparação</Link>
            <h1 style={{ fontSize: 'clamp(34px, 5vw, 64px)', lineHeight: .96, letterSpacing: '-.055em', margin: '14px 0 8px' }}>Slides da mensagem</h1>
            <p style={{ color: 'rgba(255,255,255,.68)', fontSize: 18 }}>{title} · {sermon.biblical_text}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-secondary" href={`/mensagens/${id}/teleprompter`}>Teleprompter</Link>
            <Link className="btn" href={`/mensagens/${id}`}>Revisar</Link>
          </div>
        </header>

        <section style={{ display: 'grid', gap: 22 }}>
          {slides.map((slide, index) => (
            <article key={`${slide.eyebrow}-${index}`} style={{ aspectRatio: '16 / 9', border: '1px solid rgba(255,255,255,.14)', borderRadius: 30, padding: 'clamp(28px, 5vw, 64px)', background: index === 0 ? 'linear-gradient(135deg, #2e2440, #5b43a9)' : 'linear-gradient(135deg, #fffdfb, #f1ecf9)', color: index === 0 ? '#fff' : '#2e2440', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 34px 90px -50px rgba(0,0,0,.85)' }}>
              <div>
                <p style={{ color: index === 0 ? 'rgba(255,255,255,.72)' : '#7c5fd3', fontWeight: 900, letterSpacing: '.14em', textTransform: 'uppercase', fontSize: 13 }}>{slide.eyebrow}</p>
                <h2 style={{ fontSize: 'clamp(34px, 5.2vw, 74px)', lineHeight: .95, letterSpacing: '-.06em', margin: '18px 0' }}>{slide.title}</h2>
                {slide.body ? <p style={{ fontSize: 'clamp(18px, 2vw, 28px)', lineHeight: 1.4, color: index === 0 ? 'rgba(255,255,255,.76)' : '#6b6377', maxWidth: 920 }}>{slide.body}</p> : null}
              </div>
              <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: index === 0 ? 'rgba(255,255,255,.58)' : '#9890a4', fontWeight: 800 }}>
                <span>Verbum</span>
                <span>{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
              </footer>
            </article>
          ))}
        </section>

        <p style={{ color: 'rgba(255,255,255,.62)', lineHeight: 1.6 }}>Esta é uma visualização inicial dos slides. Revise, edite e aprove o conteúdo antes de usar em culto, célula ou estudo bíblico.</p>
      </section>
    </main>
  );
}
