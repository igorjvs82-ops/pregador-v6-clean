import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/mensagens/nova', label: 'Nova mensagem' },
  { href: '/revisar-texto', label: 'Revisar texto' },
  { href: '/versiculos', label: 'Versículos por tema' },
  { href: '/minhas-mensagens', label: 'Minhas mensagens' },
  { href: '/perfil-pregador', label: 'Perfil do pregador' },
  { href: '/perfil-igreja', label: 'Perfil da igreja' },
  { href: '/series-biblicas', label: 'Séries bíblicas' },
  { href: '/radar-teologico', label: 'Radar teológico' },
  { href: '/assinatura', label: 'Assinatura' },
  { href: '/configuracoes', label: 'Configurações' },
];

type InternalSidebarProps = {
  active?: string;
  note?: string;
};

export function InternalSidebar({ active, note }: InternalSidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo"><span className="logo-mark">V</span><span>Verbum</span></div>
        <nav className="nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={active === item.href ? { background: 'var(--soft)', color: 'var(--primary)', fontWeight: 800 } : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-note" style={{ background: 'linear-gradient(135deg, var(--hero-1), var(--hero-2))', color: '#fff' }}>
        <strong>Acesso inicial</strong>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,.72)' }}>{note ?? 'Recursos em validação progressiva.'}</p>
      </div>
    </aside>
  );
}
