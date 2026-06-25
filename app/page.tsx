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
          <a href="#faq">FAQ</a>
          <Link href="/login">Entrar no app</Link>
        </nav>
        <a className="btn" href="#acesso">Solicitar acesso</a>
      </header>

      <section className="marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Preparação bíblica assistida</span>
          <h1 className="marketing-title">Do texto à mensagem, com clareza.</h1>
          <p className="lead">Organize exegese, estrutura homilética, aplicações e revisão teológica em um fluxo sério de preparação — sempre como base revisável, nunca como substituto do pregador.</p>
          <div className="actions"><a className="btn btn-gold" href="#acesso">Solicitar acesso antecipado</a><a className="btn btn-secondary" href="#planos">Ver planos</a></div>
          <p className="trust-line">Para pastores, pregadores e líderes que querem ganhar clareza sem terceirizar o púlpito.</p>
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
        <div className="section-heading"><span className="kicker">Comparativo</span><h2>Por que não usar apenas uma IA genérica?</h2></div>
        <div className="grid-2">
          <div className="card">
            <span className="badge">IA genérica</span>
            <h3 style={{ fontSize: 28 }}>Texto rápido, pouco controle pastoral.</h3>
            <p className="muted">Pode gerar ideias úteis, mas normalmente não trabalha com fluxo homilético, limites pastorais, histórico de mensagens, perfil da igreja e revisão de riscos teológicos.</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--primary-light)', boxShadow: 'var(--shadow-premium)' }}>
            <span className="badge">Verbum</span>
            <h3 style={{ fontSize: 28 }}>Preparação guiada, revisável e orientada ao púlpito.</h3>
            <p className="muted">O foco não é entregar um sermão pronto, mas organizar o processo: texto, contexto, proposição, estrutura, aplicação, Radar Teológico e aprovação final do pregador.</p>
          </div>
        </div>
      </section>

      <section id="planos" className="marketing-section">
        <div className="section-heading"><span className="kicker">Planos</span><h2>Comece com acesso antecipado. Evolua para o plano certo.</h2><p className="lead">Os valores abaixo são a oferta prevista para o lançamento. Participantes selecionados no acesso antecipado poderão receber condição especial de fundador.</p></div>
        <div className="feature-grid">
          <div className="feature-card"><b>Essencial</b><h3>R$ 0</h3><p>Para conhecer o fluxo. Inclui uso limitado, histórico básico e acesso inicial à preparação bíblica assistida.</p></div>
          <div className="feature-card" style={{ borderColor: 'var(--primary-light)', boxShadow: 'var(--shadow-premium)' }}><b>Pregador</b><h3>R$ 49/mês</h3><p>Para uso individual: preparações, Radar Teológico, revisão, histórico e exportação. Plano recomendado para quem prega com frequência.</p></div>
          <div className="feature-card"><b>Igreja</b><h3>R$ 149/mês</h3><p>Para equipes: múltiplos pregadores, séries, biblioteca da igreja e padronização de materiais de ensino.</p></div>
        </div>
      </section>

      <section id="faq" className="marketing-section">
        <div className="section-heading"><span className="kicker">FAQ</span><h2>Dúvidas antes de solicitar acesso.</h2></div>
        <div className="grid-2">
          <div className="card"><h3>O Verbum cria sermões prontos?</h3><p className="muted">Não. Ele gera uma base revisável para preparação. O pregador continua responsável por estudar, revisar, editar e aprovar.</p></div>
          <div className="card"><h3>O acesso antecipado será gratuito para sempre?</h3><p className="muted">Não. O acesso inicial serve para teste e validação. Os selecionados poderão receber condição especial quando os planos pagos forem abertos.</p></div>
          <div className="card"><h3>Posso usar para EBD, célula ou estudo bíblico?</h3><p className="muted">Sim. O foco inicial é pregação, mas o fluxo também atende ensino bíblico, pequenos grupos e estudos pastorais.</p></div>
          <div className="card"><h3>O Radar Teológico garante que não haverá erro?</h3><p className="muted">Não. Ele aponta riscos e pontos de atenção, mas não substitui Bíblia, confissão, supervisão pastoral ou discernimento do pregador.</p></div>
        </div>
      </section>

      <section id="acesso" className="marketing-section final-cta">
        <span className="eyebrow">Acesso antecipado</span>
        <h2>Entre na lista de acesso fundador.</h2>
        <p>Estamos liberando o Verbum gradualmente para pregadores e líderes que desejam testar a plataforma na preparação real de mensagens. A inscrição não garante gratuidade permanente; ela abre prioridade de acesso, período inicial de teste e possível condição especial de fundador.</p>
        <div className="feature-grid" style={{ marginTop: 24, textAlign: 'left' }}>
          <div className="feature-card"><b>01</b><h3>Acesso antes do público</h3><p>Teste o fluxo de preparação bíblica assistida antes do lançamento aberto.</p></div>
          <div className="feature-card"><b>02</b><h3>Oferta de fundador</h3><p>Usuários selecionados poderão receber preço ou condição especial no lançamento.</p></div>
          <div className="feature-card"><b>03</b><h3>Vagas limitadas</h3><p>A liberação será gradual para manter estabilidade, suporte e qualidade do produto.</p></div>
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
          <button className="btn btn-gold" type="submit">Solicitar acesso fundador</button>
          <p className="muted" style={{ marginTop: 16 }}>Ao enviar, você concorda em ser contatado sobre acesso antecipado, teste inicial e planos futuros. Leia também: <Link href="/uso-responsavel">uso responsável</Link> e <Link href="/privacidade">privacidade</Link>.</p>
        </form>
      </section>
    </main>
  );
}
