'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function getErrorMessage(error: string | null) {
  if (error === 'expired') return 'O link de acesso expirou ou já foi usado. Entre com senha ou solicite um novo link.';
  if (error === 'invalid_link') return 'Não foi possível validar este link. Entre com senha ou solicite um novo acesso.';
  if (error === 'missing_code') return 'Link incompleto. Entre com senha ou solicite um novo acesso.';
  if (error === 'denied') return 'Acesso negado pelo provedor de autenticação. Entre com senha ou solicite um novo link.';
  if (error === 'signup_ok') return 'Conta criada. Verifique seu e-mail se a confirmação estiver ativa ou entre com sua senha.';
  return '';
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = getErrorMessage(searchParams.get('error'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(initialError);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);

  async function handlePasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingPassword(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(`Erro: ${error.message}`);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Erro desconhecido.';
      setMessage(`Erro ao entrar: ${detail}`);
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setMessage('Informe seu e-mail antes de pedir um link.');
      return;
    }

    setLoadingLink(true);
    setMessage('');

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` },
      });

      setMessage(error ? `Erro: ${error.message}` : 'Enviamos um novo link de acesso para seu e-mail. Use apenas o e-mail mais recente.');
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Erro desconhecido.';
      setMessage(`Erro ao enviar link: ${detail}`);
    } finally {
      setLoadingLink(false);
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
          <h2 style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '12px 0' }}>Entre com e-mail e senha</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>Use senha para evitar limite de envio de magic link. O link por e-mail continua disponível como alternativa.</p>

          <form onSubmit={handlePasswordLogin} style={{ marginTop: 24 }}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" required minLength={6} />
            </div>
            <button className="btn" disabled={loadingPassword}>{loadingPassword ? 'Entrando...' : 'Entrar'}</button>
          </form>

          <div className="actions" style={{ marginTop: 18 }}>
            <Link className="btn btn-secondary" href="/cadastro">Criar conta</Link>
            <button className="btn btn-secondary" type="button" onClick={handleMagicLink} disabled={loadingLink}>{loadingLink ? 'Enviando...' : 'Enviar link por e-mail'}</button>
          </div>

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
