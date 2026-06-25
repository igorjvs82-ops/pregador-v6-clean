create table if not exists public.beta_leads (
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

alter table public.beta_leads enable row level security;

drop policy if exists "Allow public beta lead insert" on public.beta_leads;

create policy "Allow public beta lead insert"
  on public.beta_leads
  for insert
  to anon
  with check (true);

create index if not exists beta_leads_created_at_idx
  on public.beta_leads (created_at desc);

create index if not exists beta_leads_email_idx
  on public.beta_leads (email);
