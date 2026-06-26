do $$ begin
  create type app_role as enum ('preacher', 'leader', 'admin', 'super_admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type user_status as enum ('active', 'beta', 'blocked');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type subscription_plan as enum ('initial', 'essential', 'preacher', 'church');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role app_role not null default 'preacher',
  status user_status not null default 'beta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists plan subscription_plan not null default 'initial';
alter table public.subscriptions add column if not exists status subscription_status not null default 'trialing';
alter table public.subscriptions add column if not exists provider text;
alter table public.subscriptions add column if not exists provider_customer_id text;
alter table public.subscriptions add column if not exists provider_subscription_id text;
alter table public.subscriptions add column if not exists current_period_start timestamptz;
alter table public.subscriptions add column if not exists current_period_end timestamptz;
alter table public.subscriptions add column if not exists cancel_at_period_end boolean not null default false;
alter table public.subscriptions add column if not exists metadata jsonb not null default '{}'::jsonb;

create unique index if not exists subscriptions_user_id_unique on public.subscriptions(user_id);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, role, status)
  values (new.id, coalesce(new.email, ''), 'preacher', 'beta')
  on conflict (user_id) do update set email = excluded.email;

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'initial', 'trialing')
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists create_profile_for_new_user on auth.users;
create trigger create_profile_for_new_user
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

insert into public.profiles (user_id, email, role, status)
select id, coalesce(email, ''), 'preacher', 'beta'
from auth.users
on conflict (user_id) do update set email = excluded.email;

insert into public.subscriptions (user_id, plan, status)
select id, 'initial', 'trialing'
from auth.users
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own subscription" on public.subscriptions;
create policy "Users can read own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own initial subscription" on public.subscriptions;
create policy "Users can insert own initial subscription"
  on public.subscriptions
  for insert
  to authenticated
  with check (auth.uid() = user_id and plan = 'initial');
