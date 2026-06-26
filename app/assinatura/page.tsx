import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';

const plans = [
  {
    name: 'Acesso inicial',
    price: 'R$ 0',
    description: 'Para testar o Verbum durante a fase inicial, com limite de uso.',
    features: ['Teste inicial do fluxo', 'Preparações limitadas', 'Histórico básico', 'Base revisável para estudo'],
    cta: 'Plano atual',
    href: '/dashboard',
  },
  {
    name: 'Essencial',
    price: 'R$ 39/mês',
    description: 'Para pregadores que precisam de preparação básica e organização.',
    features: ['Preparações básicas', 'Radar limitado', 'Histórico de mensagens', 'Exportação simples'],
    cta: 'Selecionar Essencial',
    href: '/checkout?plan=essencial',
  },
  {
    name: 'Pregador',
    price: 'R$ 79/mês',
    description: 'Para quem prega, ensina ou lidera com frequência.',
    features: ['Preparações ampliadas', 'Radar Teológico completo', 'Teleprompter pastoral', 'Slides e exportação textual', 'Biblioteca de mensagens'],
    cta: 'Selecionar Pregador',
    href: '/checkout?plan=pregador',
    featured: true,
  },
  {
    name: 'Igreja',
    price: 'R$ 149/mês',
    description: 'Para equipes pastorais, professores e séries da igreja.',
    features: ['Múltiplos pregadores', 'Séries e calendário', 'Biblioteca da igreja', 'Materiais para ensino', 'Fluxo futuro de aprovação'],
    cta: 'Selecionar Igreja',
    href: '/checkout?plan=igreja',
  },
];

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="app-shell">
      <InternalSidebar active="/assinatura" note="Acesso inicial durante validação. Planos pagos serão ativados após o checkout." />

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="eyebrow">Assinatura</span>
          <h1 className="h2" style={{ marginTop: 16 }}>Planos do Verbum</h1>
          <p className="lead" style={{ fontSize: 17 }}>Durante o acesso inicial, os planos pagos servem como referência comercial. A cobrança será ativada somente quando o checkout estiver liberado.</p>
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
              <h2 style={{ margin: 0 }}>Checkout em preparação</h2>
            </div>
          </div>
          <p className="muted">Os botões de plano já levam para uma tela de checkout placeholder. O próximo passo técnico será integrar provedor de pagamento, assinatura e controle de limites por plano.</p>
        </section>
      </section>
    </main>
  );
}
