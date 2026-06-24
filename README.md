# Pregador.app v6 clean

Base Next.js para deploy na Vercel conectada ao Supabase.

## Variáveis de ambiente

Configure na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cvfnykfvmgltoaalmkno.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SB1PyM3hY4NXTKeobqcMMg_afACkeS2
OPENAI_API_KEY=sua_chave_openai
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

## Deploy

1. Vercel > Add New > Project
2. Import Git Repository
3. Selecione `igorjvs82-ops/pregador-v6-clean`
4. Framework: Next.js
5. Build command: `npm run build`
6. Output: deixe padrão
7. Deploy

## Supabase Auth

Depois do deploy, configure em Supabase > Authentication > URL Configuration:

- Site URL: `https://seu-projeto.vercel.app`
- Redirect URL: `https://seu-projeto.vercel.app/auth/callback`
