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

function TextList({ items }: { items: unknown[] }) {
  if (!items.length) return <p className="muted">Nenhum item gerado nesta seção.</p>;

  return (
    <div className="grid">
      {items.map((item, index) => {
        const record = asRecord(item);
        const title = asText(record.title ?? record.point ?? record.heading, `Item ${index + 1}`);
        const body = asText(record.description ?? record.explanation ?? record.text ?? record.content, typeof item === 'string' ? item : '');
        return (
          <div className="card-soft" key={`${title}-${index}`}>
            <b>{title}</b>
            {body ? <p className="muted">{body}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function RadarList({ data }: { data: AnyRecord }) {
  const risks = asArray(data.risks ?? data.alerts ?? data.points ?? data.items);
  if (!risks.length) return <p className="muted">Nenhum alerta estruturado foi retornado. Ainda assim, revise texto, contexto e aplicações antes de usar.</p>;
  return <TextList items={risks} />;
}

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermon } = await supabase.from('sermons').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!sermon) notFound();

  const outline = asRecord(sermon.outline ?? sermon.preparation);
  const review = asRecord(sermon.theological_review ?? sermon.theological_radar);
  const title = asText(outline.title, sermon.title ?? 'Preparação bíblica');
  const proposition = asText(outline.proposition ?? outline.big_idea ?? outline.main_idea);
  const introduction = asText(outline.introduction);
  const conclusion = asText(outline.conclusion);
  const points = asArray(outline.points ?? outline.structure ?? outline.outline);
  const applications = asArray(outline.applications ?? outline.pastoral_applications);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div>
          <nav className="nav">
            <Link href="/dashboard">Painel</Link>
            <Link href="/mensagens/nova">Nova preparação</Link>
            <Link href="/#planos">Planos</Link>
            <Link href="/uso-responsavel">Uso responsável</Link>
          </nav>
        </div>
        <p className="sidebar-note">Leia, ajuste e aprove a preparação antes de usar no púlpito.</p>
      </aside>

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="badge">{sermon.status}</span>
          <h1 className="h2" style={{ marginTop: 14 }}>{title}</h1>
          <p className="lead" style={{ fontSize: 18 }}>{sermon.biblical_text} · {sermon.theme || 'Mensagem bíblica'}</p>
          {proposition ? <p className="footer-note"><strong>Proposição:</strong> {proposition}</p> : null}
          <div className="actions" style={{ marginTop: 22 }}>
            <Link className="btn btn-secondary" href="/dashboard">Voltar ao painel</Link>
            <Link className="btn" href={`/mensagens/${id}/teleprompter`}>Abrir teleprompter</Link>
            <Link className="btn btn-secondary" href={`/mensagens/${id}/slides`}>Ver slides</Link>
            <Link className="btn btn-secondary" href="/mensagens/nova">Nova preparação</Link>
          </div>
        </div>

        <div className="grid-3">
          <div className="stat"><strong>{sermon.duration_minutes ?? 30}min</strong><span className="muted">duração estimada</span></div>
          <div className="stat"><strong>{sermon.sermon_type ?? 'expositiva'}</strong><span className="muted">tipo de mensagem</span></div>
          <div className="stat"><strong>Radar</strong><span className="muted">revisão necessária</span></div>
        </div>

        <div className="grid-2">
          <section className="card">
            <p className="kicker">Base gerada</p>
            <h2>Estrutura da mensagem</h2>
            {introduction ? <div className="card-soft"><b>Introdução</b><p className="muted">{introduction}</p></div> : null}
            <div style={{ marginTop: 16 }}><TextList items={points} /></div>
            {conclusion ? <div className="card-soft" style={{ marginTop: 16 }}><b>Conclusão</b><p className="muted">{conclusion}</p></div> : null}
          </section>

          <section className="card">
            <p className="kicker">Verbum Radar</p>
            <h2>Alertas e ajustes</h2>
            <RadarList data={review} />
          </section>
        </div>

        <section className="card">
          <div className="section-title">
            <div>
              <p className="kicker">Aplicação pastoral</p>
              <h2 style={{ margin: 0 }}>Caminhos de resposta</h2>
            </div>
          </div>
          <TextList items={applications} />
        </section>

        <section className="card">
          <div className="section-title">
            <div>
              <p className="kicker">Próximas ações</p>
              <h2 style={{ margin: 0 }}>Preparar para apresentação</h2>
            </div>
          </div>
          <div className="feature-grid">
            <Link className="feature-card" href={`/mensagens/${id}/teleprompter`}><b>Teleprompter</b><h3>Roteiro de púlpito</h3><p>Abrir visualização limpa por blocos para ensaio e apoio durante a exposição.</p></Link>
            <Link className="feature-card" href={`/mensagens/${id}/slides`}><b>Slides</b><h3>Apoio visual</h3><p>Transformar título, pontos e aplicações em uma estrutura de slides para culto ou estudo.</p></Link>
            <Link className="feature-card" href={`/mensagens/${id}/exportar`}><b>Exportar</b><h3>Material final</h3><p>Salvar como roteiro, resumo, material de apoio ou conteúdo para compartilhar com a equipe.</p></Link>
          </div>
          <p className="footer-note" style={{ marginTop: 22 }}>Antes de exportar ou apresentar, revise e aprove pastoralmente a preparação.</p>
        </section>
      </section>
    </main>
  );
}
