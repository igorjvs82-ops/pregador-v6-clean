'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function getErrorMessage(error: string | null) {
  if (error === 'expired') return 'O link de acesso expirou ou ja foi usado. Solicite um novo link abaixo.';
  if (error === 'invalid_link') return 'Nao foi possivel validar este link. Solicite um novo acesso.';
  if (error === 'missing_code') return 'Link incompleto. Solicite um novo acesso.';
  if (error === 'denied') return 'Acesso negado pelo provedor de autenticacao. Solicite um novo link.';
  return '';
}

export default function LoginPage() {
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

      setMessage(error ? `Erro: ${error.message}` : 'Enviamos um novo link de acesso para seu e-mail. Abra o link mais recente e verifique tambem spam e promocoes.');
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Erro desconhecido.';
      setMessage(`Erro ao enviar link: ${detail}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#475569' }}>Verbum</p>
        <h1>Entrar no app</h1>
        <p style={{ color: '#475569' }}>Use este acesso se voce ja foi liberado para testar o Verbum. O link enviado por e-mail so funciona uma vez e pode expirar.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar novo link de acesso'}</button>
        </form>
        {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
        <p className="muted" style={{ marginTop: 24 }}>Ainda nao foi liberado? <Link href="/#beta">Candidate-se ao beta pastoral</Link>.</p>
      </section>
    </main>
  );
}
