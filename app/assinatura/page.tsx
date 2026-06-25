import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const plans = [
  {
    name: 'Essencial',
    price: 'R$ 0',
    description: 'Para conhecer o fluxo de preparação bíblica assistida.',
    features: ['Preparação básica limitada', 'Histórico inicial', 'Uso responsável obrigatório', 'Base revisável para estudo'],
    cta: 'Plano atual',
    href: '/dashboard',
  },
  {
    name: 'Pregador',
    price: 'R$ 49/mês',
    description: 'Para quem prega, ensina ou lidera com frequência.',
    features: ['Preparações ampliadas', 'Radar Teológico', 'Teleprompter pastoral', 'Slides e exportação textual', 'Biblioteca de mensagens'],
    cta: 'Entrar na lista',
    href: '/#acesso',
    featured: true,
  },
  {
    name: 'Igreja',
    price: 'R$ 149/mês',
    description: 'Para equipes pastorais, professores e séries da igreja.',
    features: ['Múltiplos pregadores', 'Séries e calendário', 'Biblioteca da igreja', 'Materiais para ensino', 'Fluxo futuro de aprovação'],
    cta: 'Falar sobre igreja',
    href: '/#acesso',
  },
];

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div>
          <nav className="nav">
            <Link href="/dashboard">Painel</Link>
            <Link href="/mensagens/nova">Nova preparação</Link>
            <Link href="/assinatura">Assinatura</Link>
            <Link href="/uso-responsavel">Uso responsável</Link>
          </nav>
        </div>
        <p className="sidebar-note">Acesso antecipado. Planos pagos serão ativados após validação do produto.</p>
      </aside>

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="eyebrow">Assinatura</span>
          <h1 className="h2" style={{ marginTop: 16 }}>Planos do Verbum</h1>
          <p className="lead" style={{ fontSize: 17 }}>Durante o acesso antecipado, os planos servem como referência comercial. A cobrança será ativada somente quando o checkout estiver liberado.</p>
        </div>

        <div className="feature-grid">
          {plans.map((plan) => (
            <div className="feature-card" key={plan.name} style={plan.featured ? { borderColor: 'var(--primary-light)', boxShadow: 'var(--shadow-premium)' } : undefined}>
              <b>{plan.name}</b>
              <h2 style={{ margin: '10px 0 8px' }}>{plan.price}</h2>
              <p className="muted">{plan.description}</p>
              <div className="checklist" style={{ marginTop: 18 }}>
                {plan.features.map((feature) => <p key={feature}>✓ {feature}</p>)}
              </div>
              <Link className={plan.featured ? 'btn btn-gold' : 'btn btn-secondary'} href={plan.href} style={{ marginTop: 20 }}>{plan.cta}</Link>
            </div>
          ))}
        </div>

        <section className="card">
          <div className="section-title">
            <div>
              <p className="kicker">Status comercial</p>
              <h2 style={{ margin: 0 }}>Checkout ainda não ativado</h2>
            </div>
          </div>
          <p className="muted">Esta tela prepara a experiência de assinatura, mas ainda não processa pagamento. O próximo passo técnico será integrar checkout, assinatura e controle de limites por plano.</p>
        </section>
      </section>
    </main>
  );
}
