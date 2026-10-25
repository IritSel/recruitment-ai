-- HOW? controlled taxonomy database schema (run in Supabase SQL editor)
-- Reference data are curated/imported by server-side admin process; no public inserts.
create table if not exists public.israeli_localities (
  id bigint generated always as identity primary key,
  official_code text unique,
  name_he text not null,
  name_en text,
  locality_type text,
  is_active boolean not null default true,
  source_name text not null default 'Israel government open data',
  source_updated_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists israeli_localities_he_search on public.israeli_localities (name_he);
create index if not exists israeli_localities_en_search on public.israeli_localities (name_en);
create table if not exists public.occupation_families (
  id bigint generated always as identity primary key,
  name_he text not null,
  name_en text,
  parent_id bigint references public.occupation_families(id)
);
create table if not exists public.occupations (
  id bigint generated always as identity primary key,
  family_id bigint references public.occupation_families(id),
  name_he text not null,
  name_en text,
  source_code text,
  is_active boolean not null default true,
  unique (family_id,name_he)
);
create table if not exists public.occupation_aliases (
  id bigint generated always as identity primary key,
  occupation_id bigint not null references public.occupations(id) on delete cascade,
  alias text not null,
  language text not null default 'he',
  unique (occupation_id,alias,language)
);
alter table public.israeli_localities enable row level security;
alter table public.occupation_families enable row level security;
alter table public.occupations enable row level security;
alter table public.occupation_aliases enable row level security;
drop policy if exists "public read official localities" on public.israeli_localities;
create policy "public read official localities" on public.israeli_localities for select to anon, authenticated using (is_active);
drop policy if exists "public read occupation families" on public.occupation_families;
create policy "public read occupation families" on public.occupation_families for select to anon, authenticated using (true);
drop policy if exists "public read active occupations" on public.occupations;
create policy "public read active occupations" on public.occupations for select to anon, authenticated using (is_active);
drop policy if exists "public read occupation aliases" on public.occupation_aliases;
create policy "public read occupation aliases" on public.occupation_aliases for select to anon, authenticated using (exists (select 1 from public.occupations o where o.id=occupation_id and o.is_active));
-- User-entered free text remains a profile value and must not be inserted into canonical dictionaries automatically.
