import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link className="badge" href="/">Voltar</Link>
        <p className="kicker" style={{ marginTop: 24 }}>Verbum</p>
        <h1 className="h2">Privacidade e dados</h1>
        <p className="lead" style={{ fontSize: 18 }}>Esta pagina resume o tratamento inicial de dados no beta do Verbum. Antes do lancamento comercial, esta politica deve ser revisada juridicamente.</p>
        <div className="grid" style={{ marginTop: 24 }}>
          <div className="card-soft"><b>Dados de candidatura</b><p className="muted">Nome, e-mail, WhatsApp, funcao ministerial, frequencia de ensino e informacoes fornecidas no formulario beta.</p></div>
          <div className="card-soft"><b>Finalidade</b><p className="muted">Selecionar participantes do beta, entrar em contato, coletar feedback e melhorar o produto.</p></div>
          <div className="card-soft"><b>Conteudo gerado</b><p className="muted">Preparacoes, textos e revisoes sao usados para entregar a funcionalidade ao usuario e melhorar a experiencia.</p></div>
          <div className="card-soft"><b>Solicitacoes</b><p className="muted">O usuario pode solicitar atualizacao ou remocao dos dados pelo canal oficial informado pela equipe do Verbum.</p></div>
        </div>
      </section>
    </main>
  );
}
