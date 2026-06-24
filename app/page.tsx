import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container hero">
      <section className="hero-grid">
        <div>
          <span className="eyebrow">Assistente homilético cristocêntrico</span>
          <h1 className="h1">Prepare mensagens bíblicas com clareza, contexto e revisão pastoral.</h1>
          <p className="lead">
            Pregador.app ajuda pregadores, líderes e pastores a organizar esboços, aplicações e revisões teológicas sem substituir oração, estudo bíblico ou responsabilidade espiritual.
          </p>
          <div className="actions" style={{ marginTop: 26 }}>
            <Link className="btn" href="/login">Começar agora</Link>
            <Link className="btn btn-secondary" href="/dashboard">Acessar painel</Link>
          </div>
          <p className="footer-note" style={{ marginTop: 28 }}>
            A ferramenta não aprova mensagens sozinha. O pregador revisa, corrige e assume a responsabilidade final diante de Deus e da igreja.
          </p>
        </div>

        <div className="card" style={{ display: 'grid', gap: 16 }}>
          <div className="logo"><span className="logo-mark">P</span><span>Pregador.app</span></div>
          <div className="card-soft">
            <p className="kicker">Motor da mensagem</p>
            <h2 className="h2">Do texto bíblico ao esboço revisado.</h2>
            <p className="muted">Informe texto, público, ocasião e tipo de mensagem. O app estrutura o sermão com tese, introdução, pontos, aplicações e oração final.</p>
          </div>
          <div className="grid-3">
            <div className="stat"><strong>1</strong><span className="muted">Texto bíblico</span></div>
            <div className="stat"><strong>2</strong><span className="muted">Esboço</span></div>
            <div className="stat"><strong>3</strong><span className="muted">Revisão</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
