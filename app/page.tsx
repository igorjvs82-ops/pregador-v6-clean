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
          <a href="#confianca">Confiança</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#radar">Radar</a>
          <a href="#planos">Planos</a>
          <a href="#acesso">Acesso antecipado</a>
          <Link href="/login">Entrar no app</Link>
        </nav>
        <a className="btn" href="#acesso">Solicitar acesso</a>
      </header>

      <section className="marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Acesso antecipado para pregadores</span>
          <h1 className="marketing-title">Do texto à mensagem, com clareza.</h1>
          <p className="lead">Verbum é uma plataforma de preparação bíblica assistida que ajuda pregadores a organizar exegese, proposição, estrutura homilética, aplicações e alertas teológicos. Sempre como base revisável, nunca como substituto do pregador.</p>
          <div className="actions"><a className="btn btn-gold" href="#acesso">Solicitar acesso antecipado</a><a className="btn btn-secondary" href="#exemplo">Ver exemplo</a></div>
          <p className="trust-line">A ferramenta auxilia. O pregador estuda, ora, discerne, revisa e aprova.</p>
        </div>
        <div className="product-mockup">
          <div className="mockup-top"><span></span><span></span><span></span><strong>Verbum Prepare</strong></div>
          <div className="mockup-body">
            <div className="mockup-panel wide"><small>Texto bíblico</small><strong>Romanos 8.1</strong></div>
            <div className="mockup-panel"><small>Proposição</small><strong>Nenhuma condenação em Cristo</strong></div>
            <div className="mockup-panel"><small>Público</small><strong>Igreja local</strong></div>
            <div className="mockup-panel wide dark"><small>Radar teológico</small><strong>Contexto preservado · Cristo central · Aplicação pastoral</strong></div>
          </div>
        </div>
      </section>

      <section id="confianca" className="marketing-section split-section">
        <div>
          <span className="kicker">Posicionamento</span>
          <h2>Não é um gerador barato de sermões.</h2>
          <p className="lead">Ferramentas genéricas de IA podem gerar textos rápidos, mas o púlpito exige mais do que velocidade. Exige fidelidade bíblica, contexto, clareza, aplicação pastoral e responsabilidade.</p>
          <p>O Verbum apoia o processo de preparação. Ele não substitui estudo bíblico, oração ou discernimento pastoral.</p>
        </div>
        <div className="checklist">
          <p>✓ Não substitui o pregador</p>
          <p>✓ Não promete infalibilidade teológica</p>
          <p>✓ Entrega base revisável</p>
          <p>✓ Exige aprovação pastoral</p>
          <p>✓ Aponta riscos para revisão</p>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading"><span className="kicker">Problema real</span><h2>Preparar uma mensagem fiel exige tempo, estrutura e discernimento.</h2></div>
        <div className="feature-grid">
          <div className="feature-card"><b>01</b><h3>Pouco tempo</h3><p>Organizar texto, contexto, estrutura e aplicação pode consumir horas antes da escrita final.</p></div>
          <div className="feature-card"><b>02</b><h3>Aplicação forçada</h3><p>Nem toda ideia boa nasce do texto. O Verbum ajuda a revisar se a aplicação respeita a passagem.</p></div>
          <div className="feature-card"><b>03</b><h3>Responsabilidade teológica</h3><p>O pregador precisa revisar riscos doutrinários, exageros, moralismo e leituras fora de contexto.</p></div>
        </div>
      </section>

      <section id="como-funciona" className="marketing-section">
        <div className="section-heading"><span className="kicker">Fluxo</span><h2>Do texto à mensagem, com um processo sério de preparação.</h2></div>
        <div className="feature-grid">
          <div className="feature-card"><b>01</b><h3>Informe o texto e o contexto</h3><p>Passagem, tema, ocasião, público, duração e objetivo espiritual.</p></div>
          <div className="feature-card"><b>02</b><h3>Receba uma base revisável</h3><p>Exegese, proposição, estrutura homilética, aplicações, apelo e oração.</p></div>
          <div className="feature-card"><b>03</b><h3>Revise com critério</h3><p>Alertas sobre contexto, doutrina, moralismo, aplicação e clareza homilética.</p></div>
        </div>
      </section>

      <section id="radar" className="marketing-section split-section">
        <div>
          <span className="kicker">Verbum Radar</span>
          <h2>Um radar para revisar, não uma máquina para decidir.</h2>
          <p className="lead">O Radar Teológico ajuda o pregador a observar riscos comuns na preparação. Ele não substitui supervisão bíblica, confessional ou pastoral.</p>
        </div>
        <div className="checklist">
          <p>✓ Fidelidade textual</p>
          <p>✓ Contexto histórico-literário</p>
          <p>✓ Cristo no texto sem alegoria forçada</p>
          <p>✓ Risco de moralismo ou triunfalismo</p>
          <p>✓ Aplicação pastoral adequada ao público</p>
        </div>
      </section>

      <section id="exemplo" className="marketing-section">
        <div className="section-heading"><span className="kicker">Exemplo</span><h2>Veja como uma preparação pode começar.</h2></div>
        <div className="card">
          <span className="badge">Romanos 8.1 · Expositiva · Igreja local</span>
          <h3 style={{ fontSize: 32, marginBottom: 8 }}>Nenhuma condenação em Cristo</h3>
          <p className="lead" style={{ fontSize: 18 }}>Em Cristo, o crente não vive mais debaixo da condenação, mas da graça que justifica, liberta e conduz a uma nova vida no Espírito.</p>
          <div className="grid-3" style={{ marginTop: 22 }}>
            <div className="card-soft"><b>1. A condenação foi removida em Cristo</b><p className="muted">Romanos 8.1 anuncia a suficiência da obra de Cristo.</p></div>
            <div className="card-soft"><b>2. A segurança está em Cristo</b><p className="muted">A esperança cristã repousa na justiça de Cristo, não no desempenho humano.</p></div>
            <div className="card-soft"><b>3. A graça conduz a nova vida</b><p className="muted">A ausência de condenação gera gratidão, santidade e dependência do Espírito.</p></div>
          </div>
          <p className="footer-note" style={{ marginTop: 22 }}><strong>Radar:</strong> evitar transformar o texto em autoaceitação genérica. A segurança em Romanos 8.1 está ligada à união com Cristo.</p>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading"><span className="kicker">Limites claros</span><h2>O Verbum tem limites. E isso é parte da segurança.</h2></div>
        <div className="feature-grid">
          <div className="feature-card"><b>Não faz</b><h3>Substituir oração e estudo</h3><p>A ferramenta organiza a preparação, mas não remove o trabalho pastoral.</p></div>
          <div className="feature-card"><b>Não faz</b><h3>Garantir infalibilidade</h3><p>O Radar aponta riscos, mas a revisão bíblica e pastoral continua indispensável.</p></div>
          <div className="feature-card"><b>Não faz</b><h3>Decidir pelo pregador</h3><p>Nada é publicado, pregado ou exportado como final sem aprovação humana.</p></div>
        </div>
      </section>

      <section id="planos" className="marketing-section">
        <div className="section-heading"><span className="kicker">Oferta futura</span><h2>Planos pensados para pregadores e igrejas.</h2><p className="lead">Durante o acesso antecipado, os selecionados testam a plataforma antes da abertura pública. Na liberação comercial, os planos pagos serão apresentados com condição especial de fundador.</p></div>
        <div className="feature-grid">
          <div className="feature-card"><b>Essencial</b><h3>Para conhecer</h3><p>Acesso inicial limitado para entender o fluxo de preparação bíblica assistida.</p></div>
          <div className="feature-card"><b>Pregador</b><h3>Para uso individual</h3><p>Preparações, histórico, Radar Teológico, revisão e exportação para quem prega com frequência.</p></div>
          <div className="feature-card"><b>Igreja</b><h3>Para equipes</h3><p>Gestão de pregadores, séries, biblioteca da igreja e padronização de materiais de ensino.</p></div>
        </div>
      </section>

      <section id="acesso" className="marketing-section final-cta">
        <span className="eyebrow">Acesso antecipado</span>
        <h2>Teste o Verbum antes do lançamento público.</h2>
        <p>Estamos liberando acesso inicial para um grupo limitado de pastores, pregadores e líderes que desejam usar o Verbum na preparação real de mensagens. Os selecionados terão um período de teste inicial e poderão garantir uma condição especial de fundador quando os planos pagos forem abertos.</p>
        <div className="feature-grid" style={{ marginTop: 24, textAlign: 'left' }}>
          <div className="feature-card"><b>01</b><h3>Acesso antecipado</h3><p>Use a plataforma antes da abertura pública e teste o fluxo de preparação bíblica assistida.</p></div>
          <div className="feature-card"><b>02</b><h3>Condição de fundador</h3><p>Participantes selecionados terão prioridade e oferta especial quando a assinatura for liberada.</p></div>
          <div className="feature-card"><b>03</b><h3>Vagas limitadas</h3><p>A liberação será gradual para manter qualidade, estabilidade e acompanhamento do uso real.</p></div>
        </div>
        {betaStatus === 'ok' ? <p className="badge" style={{ margin: '24px auto 18px' }}>Solicitação recebida. Entraremos em contato.</p> : null}
        {betaStatus === 'invalid' ? <p className="badge" style={{ margin: '24px auto 18px' }}>Preencha nome, e-mail e WhatsApp.</p> : null}
        {betaStatus === 'error' ? <p className="badge" style={{ margin: '24px auto 18px' }}>Não foi possível salvar agora. Tente novamente.</p> : null}
        <form className="card" action="/api/beta-leads" method="post" style={{ maxWidth: 860, margin: '24px auto 0', textAlign: 'left' }}>
          <div className="form-grid">
            <div className="field"><label>Nome</label><input name="name" required /></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" required /></div>
            <div className="field"><label>WhatsApp</label><input name="whatsapp" required /></div>
            <div className="field"><label>Você é</label><select name="role" required><option>Pastor</option><option>Pregador</option><option>Líder de célula</option><option>Professor de EBD</option><option>Seminarista</option><option>Outro</option></select></div>
            <div className="field"><label>Frequência de pregação ou ensino</label><select name="frequency" required><option>Toda semana</option><option>A cada 15 dias</option><option>Uma vez por mês</option><option>Ocasionalmente</option><option>Ainda estou em formação</option></select></div>
            <div className="field"><label>Maior dificuldade</label><select name="main_challenge" required><option>Exegese</option><option>Estrutura da mensagem</option><option>Aplicação pastoral</option><option>Falta de tempo</option><option>Revisão teológica</option><option>Slides ou material de apoio</option><option>Clareza na comunicação</option></select></div>
            <div className="field full"><label>O que faria o Verbum valer uma assinatura para você ou sua igreja?</label><textarea name="expectation" rows={4} /></div>
          </div>
          <button className="btn btn-gold" type="submit">Solicitar acesso antecipado</button>
          <p className="muted" style={{ marginTop: 16 }}>Ao enviar, você concorda em ser contatado sobre o acesso antecipado, teste inicial e planos futuros. Leia também: <Link href="/uso-responsavel">uso responsável</Link> e <Link href="/privacidade">privacidade</Link>.</p>
        </form>
      </section>
    </main>
  );
}
