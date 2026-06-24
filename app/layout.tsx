import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pregador.app',
  description: 'Assistente de preparação homilética cristocêntrica.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
