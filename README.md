# Verbum

Preparacao biblica assistida para pregadores fieis ao texto.

Base Next.js para deploy na Vercel conectada ao Supabase. O projeto foi reposicionado de Pregador.app para Verbum, com landing de captacao para beta pastoral e fluxo interno de preparacao biblica.

## Posicionamento

Verbum ajuda pregadores a organizar exegese, proposicao, estrutura homiletica, aplicacoes e alertas teologicos. Sempre como base revisavel, nunca como substituto do estudo, da oracao e do discernimento pastoral.

## Variaveis de ambiente

Configure na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key
OPENAI_API_KEY=sua_chave_openai
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

## Captacao do beta pastoral

A landing envia candidaturas para:

```txt
POST /api/beta-leads
```

O endpoint insere os dados na tabela `beta_leads`. Crie a tabela no Supabase antes de ativar trafego.

```sql
create table if not exists beta_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  role text,
  frequency text,
  main_challenge text,
  expectation text,
  source text not null default 'verbum-landing-beta',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table beta_leads enable row level security;

create policy "Allow public beta lead insert"
  on beta_leads
  for insert
  to anon
  with check (true);
```

Recomendacao posterior: trocar a insercao publica por endpoint server-side com service role, validacao anti-spam e notificacao por e-mail ou CRM.

## Deploy

1. Vercel > Add New > Project
2. Import Git Repository
3. Selecione `igorjvs82-ops/pregador-v6-clean`
4. Framework: Next.js
5. Build command: `npm run build`
6. Output: deixe padrao
7. Configure as variaveis de ambiente
8. Deploy

## Supabase Auth

Depois do deploy, configure em Supabase > Authentication > URL Configuration:

- Site URL: `https://seu-projeto.vercel.app`
- Redirect URL: `https://seu-projeto.vercel.app/auth/callback`

## Proximas prioridades

1. Validar acesso ao projeto Supabase usado pelo app.
2. Criar tabela `beta_leads`.
3. Configurar dominio e URL final na Vercel.
4. Testar magic link.
5. Testar geracao de mensagem.
6. Testar formulario beta.
7. Criar politica de privacidade e aviso de uso responsavel da IA.
