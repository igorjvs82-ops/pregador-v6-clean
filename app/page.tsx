import Link from 'next/link';

type HomePageProps = {
  searchParams?: Promise<{ beta?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const betaStatus = params?.beta;

  return (
    <main className="marketing-page">
      <header className="marketing-nav">
        <Link href="/" className="brand-lockup"><span className="logo-mark">V</span><span>Verbum</span></Link>
        <nav className="marketing-links">
          <a href="#confianca">Confianca</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#radar">Radar</a>
          <a href="#beta">Beta</a>
          <Link href="/login">Entrar</Link>
        </nav>
        <a className="btn" href="#beta">Entrar no beta</a>
      </header>

      <section className="marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Beta pastoral fechado</span>
          <h1 className="marketing-title">Prepare mensagens biblicas com clareza, revisao teologica e fidelidade ao texto.</h1>
          <p className="lead">Verbum e uma plataforma de preparacao biblica assistida que ajuda pregadores a organizar exegese, proposicao, estrutura homiletica, aplicacoes e alertas teologicos. Sempre como base revisavel, nunca como substituto do pregador.</p>
          <div className="actions"><a className="btn btn-gold" href="#beta">Entrar no beta pastoral</a><a className="btn btn-secondary" href="#exemplo">Ver exemplo</a></div>
          <p className="trust-line">A ferramenta auxilia. O pregador estuda, ora, discerne, revisa e aprova.</p>
        </div>
        <div className="product-mockup">
          <div className="mockup-top"><span></span><span></span><span></span><strong>Verbum Prepare</strong></div>
          <div className="mockup-body">
            <div className="mockup-panel wide"><small>Texto biblico</small><strong>Romanos 8.1</strong></div>
            <div className="mockup-panel"><small>Proposicao</small><strong>Nenhuma condenacao em Cristo</strong></div>
            <div className="mockup-panel"><small>Publico</small><strong>Igreja local</strong></div>
            <div className="mockup-panel wide dark"><small>Radar teologico</small><strong>Contexto preservado · Cristo central · Aplicacao pastoral</strong></div>
          </div>
        </div>
      </section>

      <section id="confianca" className="marketing-section split-section">
        <div>
          <span className="kicker">Posicionamento</span>
          <h2>Nao e um gerador barato de sermoes.</h2>
          <p className="lead">Ferramentas genericas de IA podem gerar textos rapidos, mas o pulpito exige mais do que velocidade. Exige fidelidade biblica, contexto, clareza, aplicacao pastoral e responsabilidade.</p>
          <p>O Verbum apoia o processo de preparacao. Ele nao substitui estudo biblico, oracao ou discernimento pastoral.</p>
        </div>
        <div className="checklist">
          <p>✓ Nao substitui o pregador</p>
          <p>✓ Nao promete infalibilidade teologica</p>
          <p>✓ Entrega base revisavel</p>
          <p>✓ Exige aprovacao pastoral</p>
          <p>✓ Aponta riscos para revisao</p>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading"><span className="kicker">Problema real</span><h2>Preparar uma mensagem fiel exige tempo, estrutura e discernimento.</h2></div>
        <div className="feature-grid">
          <div className="feature-card"><b>01</b><h3>Pouco tempo</h3><p>Organizar texto, contexto, estrutura e aplicacao pode consumir horas antes da escrita final.</p></div>
          <div className="feature-card"><b>02</b><h3>Aplicacao forcada</h3><p>Nem toda ideia boa nasce do texto. O Verbum ajuda a revisar se a aplicacao respeita a passagem.</p></div>
          <div className="feature-card"><b>03</b><h3>Responsabilidade teologica</h3><p>O pregador precisa revisar riscos doutrinarios, exageros, moralismo e leituras fora de contexto.</p></div>
        </div>
      </section>

      <section id="como-funciona" className="marketing-section">
        <div className="section-heading"><span className="kicker">Fluxo</span><h2>Do texto a mensagem, com um processo serio de preparacao.</h2></div>
        <div className="feature-grid">
          <div className="feature-card"><b>01</b><h3>Informe o texto e o contexto</h3><p>Passagem, tema, ocasiao, publico, duracao e objetivo espiritual.</p></div>
          <div className="feature-card"><b>02</b><h3>Receba uma base revisavel</h3><p>Exegese, proposicao, estrutura homiletica, aplicacoes, apelo e oracao.</p></div>
          <div className="feature-card"><b>03</b><h3>Revise com criterio</h3><p>Alertas sobre contexto, doutrina, moralismo, aplicacao e clareza homiletica.</p></div>
        </div>
      </section>

      <section id="radar" className="marketing-section split-section">
        <div>
          <span className="kicker">Verbum Radar</span>
          <h2>Um radar para revisar, nao uma maquina para decidir.</h2>
          <p className="lead">O Radar Teologico ajuda o pregador a observar riscos comuns na preparacao. Ele nao substitui supervisao biblica, confessional ou pastoral.</p>
        </div>
        <div className="checklist">
          <p>✓ Fidelidade textual</p>
          <p>✓ Contexto historico-literario</p>
          <p>✓ Cristo no texto sem alegoria forcada</p>
          <p>✓ Risco de moralismo ou triunfalismo</p>
          <p>✓ Aplicacao pastoral adequada ao publico</p>
        </div>
      </section>

      <section id="exemplo" className="marketing-section">
        <div className="section-heading"><span className="kicker">Exemplo</span><h2>Veja como uma preparacao pode comecar.</h2></div>
        <div className="card">
          <span className="badge">Romanos 8.1 · Expositiva · Igreja local</span>
          <h3 style={{ fontSize: 32, marginBottom: 8 }}>Nenhuma condenacao em Cristo</h3>
          <p className="lead" style={{ fontSize: 18 }}>Em Cristo, o crente nao vive mais debaixo da condenacao, mas da graca que justifica, liberta e conduz a uma nova vida no Espirito.</p>
          <div className="grid-3" style={{ marginTop: 22 }}>
            <div className="card-soft"><b>1. A condenacao foi removida em Cristo</b><p className="muted">Romanos 8.1 anuncia a suficiencia da obra de Cristo.</p></div>
            <div className="card-soft"><b>2. A seguranca esta em Cristo</b><p className="muted">A esperanca crista repousa na justica de Cristo, nao no desempenho humano.</p></div>
            <div className="card-soft"><b>3. A graca conduz a nova vida</b><p className="muted">A ausencia de condenacao gera gratidao, santidade e dependencia do Espirito.</p></div>
          </div>
          <p className="footer-note" style={{ marginTop: 22 }}><strong>Radar:</strong> evitar transformar o texto em autoaceitacao generica. A seguranca em Romanos 8.1 esta ligada a uniao com Cristo.</p>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading"><span className="kicker">Limites claros</span><h2>O Verbum tem limites. E isso e parte da seguranca.</h2></div>
        <div className="feature-grid">
          <div className="feature-card"><b>Nao faz</b><h3>Substituir oracao e estudo</h3><p>A ferramenta organiza a preparacao, mas nao remove o trabalho pastoral.</p></div>
          <div className="feature-card"><b>Nao faz</b><h3>Garantir infalibilidade</h3><p>O Radar aponta riscos, mas a revisao biblica e pastoral continua indispensavel.</p></div>
          <div className="feature-card"><b>Nao faz</b><h3>Decidir pelo pregador</h3><p>Nada e publicado, pregado ou exportado como final sem aprovacao humana.</p></div>
        </div>
      </section>

      <section id="beta" className="marketing-section final-cta">
        <span className="eyebrow">Candidatura ao beta</span>
        <h2>Ajude a construir uma ferramenta seria para pregadores fieis ao texto.</h2>
        <p>Estamos formando o primeiro grupo de usuarios do Verbum. As vagas sao limitadas para manter acompanhamento proximo e coletar feedback pastoral real.</p>
        {betaStatus === 'ok' ? <p className="badge" style={{ margin: '0 auto 18px' }}>Candidatura recebida. Entraremos em contato.</p> : null}
        {betaStatus === 'invalid' ? <p className="badge" style={{ margin: '0 auto 18px' }}>Preencha nome, e-mail e WhatsApp.</p> : null}
        {betaStatus === 'error' ? <p className="badge" style={{ margin: '0 auto 18px' }}>Nao foi possivel salvar agora. Tente novamente.</p> : null}
        <form className="card" action="/api/beta-leads" method="post" style={{ maxWidth: 860, margin: '24px auto 0', textAlign: 'left' }}>
          <div className="form-grid">
            <div className="field"><label>Nome</label><input name="name" required /></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" required /></div>
            <div className="field"><label>WhatsApp</label><input name="whatsapp" required /></div>
            <div className="field"><label>Voce e</label><select name="role" required><option>Pastor</option><option>Pregador</option><option>Lider de celula</option><option>Professor de EBD</option><option>Seminarista</option><option>Outro</option></select></div>
            <div className="field"><label>Frequencia de pregacao ou ensino</label><select name="frequency" required><option>Toda semana</option><option>A cada 15 dias</option><option>Uma vez por mes</option><option>Ocasionalmente</option><option>Ainda estou em formacao</option></select></div>
            <div className="field"><label>Maior dificuldade</label><select name="main_challenge" required><option>Exegese</option><option>Estrutura da mensagem</option><option>Aplicacao pastoral</option><option>Falta de tempo</option><option>Revisao teologica</option><option>Slides ou material de apoio</option><option>Clareza na comunicacao</option></select></div>
            <div className="field full"><label>O que voce espera de uma ferramenta como o Verbum?</label><textarea name="expectation" rows={4} /></div>
          </div>
          <button className="btn btn-gold" type="submit">Enviar candidatura ao beta</button>
          <p className="muted" style={{ marginTop: 16 }}>Ao enviar, voce concorda em ser contatado sobre o beta. Leia tambem: <Link href="/uso-responsavel">uso responsavel</Link> e <Link href="/privacidade">privacidade</Link>.</p>
        </form>
      </section>
    </main>
  );
}
