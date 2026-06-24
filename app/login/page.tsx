'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` },
    });

    setLoading(false);
    setMessage(error ? error.message : 'Enviamos um link de acesso para seu e-mail.');
  }

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1>Entrar</h1>
        <p style={{ color: '#475569' }}>Acesse com magic link para preparar suas mensagens.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar link de acesso'}</button>
        </form>
        {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
      </section>
    </main>
  );
}
