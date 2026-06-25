create type if not exists subscription_plan as enum ('initial', 'essential', 'preacher', 'church');
create type if not exists subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan subscription_plan not null default 'initial',
  status subscription_status not null default 'trialing',
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own initial subscription"
  on public.subscriptions
  for insert
  to authenticated
  with check (auth.uid() = user_id and plan = 'initial');

create policy "Users can update own subscription metadata"
  on public.subscriptions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row
  execute function public.touch_updated_at();
