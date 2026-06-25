import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPreparationLimit, getPlanBySlug } from '@/lib/plans';

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const selectedPlan = getPlanBySlug(params?.plan);

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
        <p className="sidebar-note">Checkout preparado para integração futura com pagamento recorrente.</p>
      </aside>

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="eyebrow">Checkout</span>
          <h1 className="h2" style={{ marginTop: 16 }}>Confirmar plano {selectedPlan.name}</h1>
          <p className="lead" style={{ fontSize: 17 }}>Esta etapa ainda não processa pagamento. Ela deixa o fluxo comercial pronto para receber Stripe, Mercado Pago ou outro provedor.</p>
        </div>

        <div className="grid-2">
          <section className="card" style={{ boxShadow: 'var(--shadow-premium)' }}>
            <span className="badge">Plano selecionado</span>
            <h2 style={{ marginTop: 14 }}>{selectedPlan.name}</h2>
            <h3 style={{ fontSize: 34, margin: '8px 0' }}>{selectedPlan.price}</h3>
            <p className="muted">Limite de preparações: {formatPreparationLimit(selectedPlan)}</p>
            <div className="checklist" style={{ marginTop: 22 }}>
              {selectedPlan.features.map((feature) => <p key={feature}>✓ {feature}</p>)}
              <p>✓ Cobrança recorrente mensal futuramente</p>
              <p>✓ Controle de limites por assinatura</p>
            </div>
          </section>

          <section className="card">
            <span className="badge">Próxima integração</span>
            <h2 style={{ marginTop: 14 }}>Pagamento ainda não ativado</h2>
            <p className="muted">Quando o provedor for definido, este botão criará uma sessão real de checkout e retornará para o Verbum após pagamento aprovado.</p>
            <button className="btn" type="button" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>Pagamento em breve</button>
            <div className="actions" style={{ marginTop: 18 }}>
              <Link className="btn btn-secondary" href="/assinatura">Trocar plano</Link>
              <Link className="btn btn-secondary" href="/dashboard">Voltar ao painel</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
