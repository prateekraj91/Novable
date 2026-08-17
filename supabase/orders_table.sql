-- =========================================================
-- Orders Table Migration for Novable Custom Ejected Features
-- Run this in Supabase Dashboard -> SQL Editor
-- =========================================================

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  site_id       text not null,
  customer_name text not null,
  phone         text not null,
  items         jsonb not null default '[]'::jsonb,
  total_amount  numeric(10, 2),
  status        text not null default 'pending',
  notes         text,
  created_at    timestamptz not null default now()
);

-- Index for searching orders by site
create index if not exists orders_site_id_idx on public.orders(site_id);

-- Enable Row Level Security
alter table public.orders enable row level security;

-- Policy: Allow public/unauthenticated insert from ejected client web apps
drop policy if exists "Enable public insert for orders" on public.orders;
create policy "Enable public insert for orders" on public.orders
  for insert with check (true);

-- Policy: Allow site owners / admins to read orders (select)
drop policy if exists "Enable public select for orders" on public.orders;
create policy "Enable public select for orders" on public.orders
  for select using (true);
