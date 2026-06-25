'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function getErrorMessage(error: string | null) {
  if (error === 'expired') return 'O link de acesso expirou ou já foi usado. Solicite um novo link abaixo.';
  if (error === 'invalid_link') return 'Não foi possível validar este link. Solicite um novo acesso.';
  if (error === 'missing_code') return 'Link incompleto. Solicite um novo acesso.';
  if (error === 'denied') return 'Acesso negado pelo provedor de autenticação. Solicite um novo link.';
  return '';
}

function LoginForm() {
  const searchParams = useSearchParams();
  const initialError = getErrorMessage(searchParams.get('error'));
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` },
      });

      setMessage(error ? `Erro: ${error.message}` : 'Enviamos um novo link de acesso para seu e-mail. Abra o link mais recente e verifique também spam e promoções.');
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Erro desconhecido.';
      setMessage(`Erro ao enviar link: ${detail}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-brand-panel">
          <Link href="/" className="brand-lockup"><span className="logo-mark">V</span><span>Verbum</span></Link>
          <div>
            <span className="eyebrow">Acesso antecipado</span>
            <h1 className="auth-title">Prepare com ordem. Revise com discernimento.</h1>
            <p className="lead">Acesse o ambiente do Verbum para organizar preparações bíblicas, revisar riscos teológicos e salvar suas mensagens como bases revisáveis.</p>
          </div>
          <div className="checklist auth-checklist">
            <p>✓ Base revisável, nunca sermão pronto</p>
            <p>✓ Radar Teológico para pontos de atenção</p>
            <p>✓ Aprovação final sempre do pregador</p>
          </div>
        </div>

        <div className="auth-panel auth-form-panel">
          <p className="kicker">Entrar no app</p>
          <h2>Receba seu link de acesso</h2>
          <p className="muted">Use este acesso se você já foi liberado para testar o Verbum. O link enviado por e-mail funciona uma vez e pode expirar.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
            </div>
            <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar novo link de acesso'}</button>
          </form>
          {message ? <p className="auth-message">{message}</p> : null}
          <p className="muted" style={{ marginTop: 24 }}>Ainda não foi liberado? <Link href="/#acesso">Solicite acesso antecipado</Link>.</p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="container"><section className="card" style={{ maxWidth: 560, margin: '0 auto' }}>Carregando acesso...</section></main>}>
      <LoginForm />
    </Suspense>
  );
}
