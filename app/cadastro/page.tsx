'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (password.length < 6) {
      setMessage('Erro: use uma senha com pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Erro: as senhas não conferem.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` },
      });

      if (error) {
        setMessage(`Erro: ${error.message}`);
        return;
      }

      setMessage('Conta criada. Se o Supabase exigir confirmação, verifique seu e-mail. Caso contrário, você já pode entrar.');
      setTimeout(() => router.push('/login?error=signup_ok'), 1200);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Erro desconhecido.';
      setMessage(`Erro ao criar conta: ${detail}`);
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
            <span className="eyebrow">Criar acesso</span>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 66px)', lineHeight: 0.95, letterSpacing: '-0.065em', margin: '22px 0 18px' }}>Uma conta simples para preparar melhor.</h1>
            <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 18, lineHeight: 1.65, maxWidth: 640 }}>Crie seu acesso com senha e evite os limites temporários de envio de magic link.</p>
          </div>
          <div className="checklist" style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.16)' }}>
            <p>✓ Acesso por senha</p>
            <p>✓ Preparações vinculadas ao usuário</p>
            <p>✓ Fluxo pronto para assinatura</p>
          </div>
        </div>

        <div className="card" style={{ padding: 34, alignSelf: 'center', boxShadow: 'var(--shadow-premium)' }}>
          <p className="kicker">Cadastro</p>
          <h2 style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '12px 0' }}>Crie sua conta</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>Use um e-mail válido e uma senha com pelo menos 6 caracteres.</p>

          <form onSubmit={handleSignup} style={{ marginTop: 24 }}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required minLength={6} />
            </div>
            <button className="btn" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
          </form>

          {message ? <p style={{ marginTop: 18, color: message.startsWith('Erro') ? 'var(--error)' : 'var(--success)', lineHeight: 1.45 }}>{message}</p> : null}
          <p className="muted" style={{ marginTop: 24 }}>Já tem conta? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Entrar</Link>.</p>
        </div>
      </section>
    </main>
  );
}
