import Link from 'next/link';

export default function ResponsibleUsePage() {
  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link className="badge" href="/">← Voltar</Link>
        <p className="kicker" style={{ marginTop: 24 }}>Verbum</p>
        <h1 className="h2">Uso responsavel da IA na preparacao biblica</h1>
        <p className="lead" style={{ fontSize: 18 }}>O Verbum e uma ferramenta de apoio. Ele organiza ideias, sugere estrutura e aponta riscos para revisao. Ele nao substitui estudo biblico, oracao, discernimento pastoral, supervisao doutrinaria ou responsabilidade diante da igreja.</p>
        <div className="grid" style={{ marginTop: 24 }}>
          <div className="card-soft"><b>1. A Escritura permanece como autoridade</b><p className="muted">Toda sugestao deve ser conferida a luz do texto biblico, do contexto e da doutrina crista.</p></div>
          <div className="card-soft"><b>2. O pregador permanece responsavel</b><p className="muted">Nada gerado pelo Verbum deve ser usado sem revisao, edicao e aprovacao pastoral.</p></div>
          <div className="card-soft"><b>3. O Radar nao e infalivel</b><p className="muted">Alertas teologicos ajudam a identificar riscos, mas nao substituem conselho pastoral, confessional ou academico.</p></div>
          <div className="card-soft"><b>4. Nao use como sermao pronto</b><p className="muted">O objetivo e preparar uma base revisavel, nao terceirizar o pulpito.</p></div>
        </div>
      </section>
    </main>
  );
}
