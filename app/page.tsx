import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="marketing-page">
      <header className="marketing-nav">
        <Link href="/" className="brand-lockup"><span className="logo-mark">P</span><span>Pregador.app</span></Link>
        <nav className="marketing-links"><a href="#como-funciona">Como funciona</a><a href="#recursos">Recursos</a><a href="#seguranca">Teologia</a><Link href="/login">Entrar</Link></nav>
        <Link className="btn" href="/login">Começar</Link>
      </header>

      <section className="marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Motor de preparação homilética</span>
          <h1 className="marketing-title">Pregações bíblicas mais claras, organizadas e revisadas.</h1>
          <p className="lead">Um sistema para pregadores, líderes e pastores criarem esboços com contexto, tese, aplicações, oração final e revisão cristocêntrica.</p>
          <div className="actions"><Link className="btn btn-gold" href="/login">Criar primeira mensagem</Link><Link className="btn btn-secondary" href="/dashboard">Abrir sistema</Link></div>
          <p className="trust-line">Não substitui oração, estudo bíblico, mentoria pastoral nem a aprovação final do pregador.</p>
        </div>
        <div className="product-mockup">
          <div className="mockup-top"><span></span><span></span><span></span><strong>Nova mensagem</strong></div>
          <div className="mockup-body">
            <div className="mockup-panel wide"><small>Texto bíblico</small><strong>Efésios 2.1-10</strong></div>
            <div className="mockup-panel"><small>Tese</small><strong>Salvos pela graça</strong></div>
            <div className="mockup-panel"><small>Público</small><strong>Igreja local</strong></div>
            <div className="mockup-panel wide dark"><small>Revisão teológica</small><strong>Contexto preservado · Cristo central · Aplicação pastoral</strong></div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="marketing-section">
        <div className="section-heading"><span className="kicker">Fluxo</span><h2>Do texto ao esboço em três etapas.</h2></div>
        <div className="feature-grid"><div className="feature-card"><b>01</b><h3>Informe o contexto</h3><p>Texto bíblico, público, ocasião, duração, tom e tipo de mensagem.</p></div><div className="feature-card"><b>02</b><h3>Receba a estrutura</h3><p>Título, tese, introdução, contexto bíblico, pontos, aplicações e conclusão.</p></div><div className="feature-card"><b>03</b><h3>Revise com critério</h3><p>Alertas contra moralismo, legalismo, triunfalismo e aplicações rasas.</p></div></div>
      </section>

      <section id="recursos" className="marketing-section split-section">
        <div><span className="kicker">Sistema interno</span><h2>Painel separado da landing.</h2><p className="lead">A landing vende e explica. O sistema fica protegido por login, com dashboard, histórico de mensagens e formulário de criação.</p></div>
        <div className="checklist"><p>✓ Dashboard privado</p><p>✓ Histórico por usuário</p><p>✓ RLS no Supabase</p><p>✓ Geração server-side</p><p>✓ Revisão pastoral em JSON</p></div>
      </section>

      <section id="seguranca" className="marketing-section final-cta">
        <span className="eyebrow">Pronto para testar</span>
        <h2>Entre no sistema e crie a primeira mensagem.</h2>
        <p>A v6 já separa a página pública do app interno. O próximo passo é refinar experiência, geração e exportação.</p>
        <Link className="btn btn-gold" href="/login">Acessar agora</Link>
      </section>
    </main>
  );
}
