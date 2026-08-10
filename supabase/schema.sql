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
  is_paid    boolean not null default false,
  created_at timestamptz not null default now()
);

-- Added after launch — existing projects get the column here, defaulting every
-- current user to the free plan.
alter table public.profiles
  add column if not exists is_paid boolean not null default false;

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

-- Anyone who signed up before the trigger existed (or whose insert was rolled
-- back) still needs a row — without one there is no is_paid flag to read, and
-- the gates below would have nothing to check.
insert into public.profiles (id, email)
select u.id, u.email from auth.users u
on conflict (id) do nothing;

-- =========================================================
-- Freemium gating
--
-- The paid flag is set BY HAND: Supabase dashboard → Table editor → profiles
-- → tick is_paid for the user who paid. Everything below reacts to that flag.
--
--   free (is_paid = false) : one website, AI restyling. No publishing, no agents.
--   paid (is_paid = true)  : everything.
--
-- These live in the database on purpose. The UI hides the locked features, but
-- the rules here are what actually hold — a free user talking straight to the
-- REST API with their anon key still can't create a second site, publish, or
-- record an agent run.
-- =========================================================

-- Reads the flag for any user. security definer so it still answers when it is
-- called from a trigger on a row that RLS wouldn't otherwise let you read.
create or replace function public.is_paid_user(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_paid from public.profiles where id = uid), false);
$$;

-- --- Only you can grant the paid flag ------------------------------------
-- The "own profile" policy lets a user update their own row, which would
-- otherwise let them hand themselves is_paid = true from the browser in one
-- line. Any change to the flag that arrives with an end-user JWT is reverted;
-- auth.uid() is null for the Supabase dashboard and the service role, so your
-- manual tick still lands.
create or replace function public.protect_paid_flag()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_paid is distinct from old.is_paid and auth.uid() is not null then
    new.is_paid := old.is_paid;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_paid_flag on public.profiles;
create trigger profiles_protect_paid_flag
  before update on public.profiles
  for each row execute function public.protect_paid_flag();

-- --- One site on the free plan -------------------------------------------
create or replace function public.enforce_free_plan_site_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_paid_user(new.user_id) then
    return new;
  end if;

  if (select count(*) from public.sites where user_id = new.user_id) >= 1 then
    -- The frontend matches on this code to show the upgrade prompt.
    raise exception 'FREE_PLAN_SITE_LIMIT: the free plan includes one website'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists sites_free_plan_limit on public.sites;
create trigger sites_free_plan_limit
  before insert on public.sites
  for each row execute function public.enforce_free_plan_site_limit();

-- --- Publishing is a paid feature ----------------------------------------
-- Forces published = false for free users rather than raising: generation
-- inserts published = true, and that insert must keep succeeding. The site is
-- saved and editable, it just isn't public yet.
create or replace function public.enforce_publish_entitlement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.published and not public.is_paid_user(new.user_id) then
    new.published := false;
  end if;
  return new;
end;
$$;

drop trigger if exists sites_publish_entitlement on public.sites;
create trigger sites_publish_entitlement
  before insert or update on public.sites
  for each row execute function public.enforce_publish_entitlement();

-- --- Marketing agents are a paid feature ---------------------------------
create or replace function public.enforce_agent_entitlement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_paid_user(new.user_id) then
    raise exception 'FREE_PLAN_AGENTS_LOCKED: marketing agents need the Standard plan'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists agent_outputs_entitlement on public.agent_outputs;
create trigger agent_outputs_entitlement
  before insert on public.agent_outputs
  for each row execute function public.enforce_agent_entitlement();

-- --- Ticking is_paid takes the customer's site live ----------------------
-- So the manual flip in the dashboard is the only step after they pay.
create or replace function public.publish_sites_on_upgrade()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_paid and not coalesce(old.is_paid, false) then
    update public.sites
       set published = true, updated_at = now()
     where user_id = new.id and published = false;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_publish_on_upgrade on public.profiles;
create trigger profiles_publish_on_upgrade
  after update of is_paid on public.profiles
  for each row execute function public.publish_sites_on_upgrade();
