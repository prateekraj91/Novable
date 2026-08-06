-- Novable — Supabase schema
-- Run this in your Supabase project: SQL Editor → paste → Run.
-- Safe to re-run (idempotent).

-- =========================================================
-- Tables
-- =========================================================

-- profiles: 1:1 with auth.users
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  created_at timestamptz not null default now()
);

-- businesses: the onboarding input for a user's business
create table if not exists public.businesses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  category        text,
  city            text,
  target_audience text,
  tone            text,
  phone           text,
  email           text,
  address         text,
  description     text,
  social_links    jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

-- sites: the AI-generated website content for a business
create table if not exists public.sites (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  slug        text unique not null,
  content     jsonb not null,            -- the GeneratedWebsite JSON
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- agent_outputs: results from the other agents (reviews/campaign/social/analytics/chat)
create table if not exists public.agent_outputs (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  agent_type  text not null,             -- 'reviews' | 'campaign' | 'social' | 'analytics' | 'chat'
  input       jsonb,
  output      jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists businesses_user_idx     on public.businesses(user_id);
create index if not exists sites_user_idx          on public.sites(user_id);
create index if not exists sites_slug_idx          on public.sites(slug);
create index if not exists agent_outputs_biz_idx   on public.agent_outputs(business_id);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.profiles      enable row level security;
alter table public.businesses    enable row level security;
alter table public.sites         enable row level security;
alter table public.agent_outputs enable row level security;

-- profiles: a user manages only their own row
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- businesses: owner-only
drop policy if exists "own businesses" on public.businesses;
create policy "own businesses" on public.businesses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- sites: owner has full access...
drop policy if exists "own sites" on public.sites;
create policy "own sites" on public.sites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ...and anyone can READ a published site (this powers the public /site/[slug] pages)
drop policy if exists "public read published sites" on public.sites;
create policy "public read published sites" on public.sites
  for select using (published = true);

-- agent_outputs: owner-only
drop policy if exists "own agent outputs" on public.agent_outputs;
create policy "own agent outputs" on public.agent_outputs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- Auto-create a profile row when a user signs up
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
