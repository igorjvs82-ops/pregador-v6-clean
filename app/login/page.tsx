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
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ width: '100%', maxWidth: 1120, display: 'grid', gridTemplateColumns: '1fr 0.86fr', gap: 24 }}>
        <div className="card" style={{ padding: 34, minHeight: 560, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, var(--hero-1), var(--hero-2))', color: '#fff', boxShadow: 'var(--shadow-premium)' }}>
          <Link href="/" className="brand-lockup" style={{ color: '#fff' }}><span className="logo-mark">V</span><span>Verbum</span></Link>
          <div>
            <span className="eyebrow">Acesso antecipado</span>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 66px)', lineHeight: 0.95, letterSpacing: '-0.065em', margin: '22px 0 18px' }}>Prepare com ordem. Revise com discernimento.</h1>
            <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 18, lineHeight: 1.65, maxWidth: 640 }}>Acesse o ambiente do Verbum para organizar preparações bíblicas, revisar riscos teológicos e salvar suas mensagens como bases revisáveis.</p>
          </div>
          <div className="checklist" style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.16)' }}>
            <p>✓ Base revisável, nunca sermão pronto</p>
            <p>✓ Radar Teológico para pontos de atenção</p>
            <p>✓ Aprovação final sempre do pregador</p>
          </div>
        </div>

        <div className="card" style={{ padding: 34, alignSelf: 'center', boxShadow: 'var(--shadow-premium)' }}>
          <p className="kicker">Entrar no app</p>
          <h2 style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '12px 0' }}>Receba seu link de acesso</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>Use este acesso se você já foi liberado para testar o Verbum. O link enviado por e-mail funciona uma vez e pode expirar.</p>
          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
            </div>
            <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar novo link de acesso'}</button>
          </form>
          {message ? <p style={{ marginTop: 18, color: message.startsWith('Erro') ? 'var(--error)' : 'var(--success)', lineHeight: 1.45 }}>{message}</p> : null}
          <p className="muted" style={{ marginTop: 24 }}>Ainda não foi liberado? <Link href="/#acesso" style={{ color: 'var(--primary)', fontWeight: 800 }}>Solicite acesso antecipado</Link>.</p>
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
