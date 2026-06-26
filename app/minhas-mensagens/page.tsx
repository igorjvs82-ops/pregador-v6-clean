import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

function formatDate(value?: string | null) {
  if (!value) return 'agora';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value));
}

export default async function MyMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: sermons } = await supabase
    .from('sermons')
    .select('id,title,biblical_text,theme,type,duration,created_at,status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <main className="app-shell">
      <InternalSidebar active="/minhas-mensagens" note="Biblioteca das preparações bíblicas salvas." />
      <section className="grid">
        <div className="section-title">
          <div>
            <p className="kicker">Biblioteca</p>
            <h1 className="h2">Minhas mensagens</h1>
          </div>
          <Link className="btn" href="/mensagens/nova">Nova mensagem</Link>
        </div>

        <div className="actions">
          <span className="badge">Todas · {(sermons ?? []).length}</span>
          <span className="badge">Aprovadas</span>
          <span className="badge">Rascunhos</span>
        </div>

        {(sermons ?? []).length === 0 ? (
          <section className="card-soft">
            <h3>Nenhuma mensagem criada ainda.</h3>
            <p className="muted">Crie sua primeira preparação para iniciar a biblioteca pastoral.</p>
            <Link className="btn" href="/mensagens/nova">Criar mensagem</Link>
          </section>
        ) : (
          <div className="grid">
            {sermons?.map((sermon) => (
              <Link className="card-soft sermon-card" key={sermon.id} href={`/mensagens/${sermon.id}`}>
                <div className="section-title">
                  <div>
                    <h3 style={{ margin: 0 }}>{sermon.title || sermon.theme || sermon.biblical_text}</h3>
                    <p className="muted" style={{ margin: '6px 0 0' }}>{sermon.biblical_text} · {sermon.type || 'Mensagem'} · {sermon.duration || '35 minutos'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge">{sermon.status}</span>
                    <p className="muted" style={{ margin: '8px 0 0', fontSize: 13 }}>{formatDate(sermon.created_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
