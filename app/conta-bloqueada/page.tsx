import Link from 'next/link';

export default function BlockedAccountPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section className="card" style={{ maxWidth: 620, padding: 36, textAlign: 'center', boxShadow: 'var(--shadow-premium)' }}>
        <span className="eyebrow">Acesso suspenso</span>
        <h1 className="h2" style={{ marginTop: 16 }}>Conta bloqueada</h1>
        <p className="lead" style={{ fontSize: 17 }}>Seu acesso ao Verbum foi temporariamente bloqueado. Entre em contato com a administração para revisar o status da conta.</p>
        <div className="actions" style={{ justifyContent: 'center', marginTop: 22 }}>
          <Link className="btn btn-secondary" href="/login">Voltar ao login</Link>
          <Link className="btn" href="/#acesso">Solicitar suporte</Link>
        </div>
      </section>
    </main>
  );
}
