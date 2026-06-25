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
    <section className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <p style={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#7c5fd3' }}>Verbum</p>
      <h1>Entrar no app</h1>
      <p style={{ color: '#6b6377' }}>Use este acesso se você já foi liberado para testar o Verbum. O link enviado por e-mail só funciona uma vez e pode expirar.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar novo link de acesso'}</button>
      </form>
      {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
      <p className="muted" style={{ marginTop: 24 }}>Ainda não foi liberado? <Link href="/#beta">Solicite acesso antecipado</Link>.</p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="container">
      <Suspense fallback={<section className="card" style={{ maxWidth: 560, margin: '0 auto' }}>Carregando acesso...</section>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
