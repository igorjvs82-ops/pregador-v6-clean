import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <section className="card" style={{ display: 'grid', gap: 20 }}>
        <p style={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#475569' }}>Pregador.app</p>
        <h1 style={{ fontSize: 48, lineHeight: 1, margin: 0 }}>Prepare mensagens bíblicas com clareza, estrutura e revisão cristocêntrica.</h1>
        <p style={{ fontSize: 20, color: '#475569', maxWidth: 760 }}>
          Um assistente de preparação homilética para pregadores, líderes e pastores. A ferramenta organiza o processo, mas a aprovação final continua sendo responsabilidade do pregador.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn" href="/login">Começar agora</Link>
          <Link className="btn btn-secondary" href="/dashboard">Ir para o painel</Link>
        </div>
      </section>
    </main>
  );
}
