-- Run in Supabase SQL Editor if migration was not applied yet

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Site settings: public read" on public.site_settings;
create policy "Site settings: public read"
  on public.site_settings for select using (true);

drop policy if exists "Site settings: admin insert" on public.site_settings;
create policy "Site settings: admin insert"
  on public.site_settings for insert with check (public.is_admin());

drop policy if exists "Site settings: admin update" on public.site_settings;
create policy "Site settings: admin update"
  on public.site_settings for update
  using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value)
select 'featured_artwork_id', id::text
from public.artworks
order by sort_order asc, created_at asc
limit 1
on conflict (key) do nothing;

-- Reliable save (bypasses RLS edge cases on upsert)
create or replace function public.set_featured_artwork(artwork_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  insert into public.site_settings (key, value, updated_at)
  values ('featured_artwork_id', artwork_id, now())
  on conflict (key) do update
    set value = excluded.value,
        updated_at = excluded.updated_at;
end;
$$;

grant execute on function public.set_featured_artwork(text) to authenticated;
