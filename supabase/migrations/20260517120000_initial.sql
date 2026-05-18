-- Profiles (roles: admin | client)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles: users read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles: users update own (not role)"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'client');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Artworks gallery
create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  url text not null,
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.artworks enable row level security;

create policy "Artworks: public read"
  on public.artworks for select
  using (true);

create policy "Artworks: admin insert"
  on public.artworks for insert
  with check (public.is_admin());

create policy "Artworks: admin update"
  on public.artworks for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Artworks: admin delete"
  on public.artworks for delete
  using (public.is_admin());

-- Seed existing collection (public folder images)
insert into public.artworks (title, description, url, sort_order) values
  ('Morning Light', 'Delicate interplay of dawn hues on canvas - a quiet meditation on light and stillness.', '/images/IMG_20230420_063717.jpg', 1),
  ('Urban Echo', 'Bold strokes capture the rhythm of the city - movement frozen in pigment.', '/images/1682015760703.jpg', 2),
  ('Forest Whisper', 'Layers of green and shadow evoke the hush of woodland paths at dusk.', '/images/1682015744120.jpg', 3),
  ('Horizon Line', 'A sweeping vista where sky meets earth - color fields in harmonious tension.', '/images/1682015771796.jpg', 4),
  ('Portrait Study', 'Intimate character study exploring form, gaze, and emotional depth.', '/images/Carlik.png', 5),
  ('Nature Suite', 'Organic textures and botanical forms rendered with expressive brushwork.', '/images/nat.png', 6),
  ('Coastal Dream', 'Sea and sky merge in fluid blues - a cinematic seascape in oil.', '/images/morze.png', 7),
  ('Ethereal Form', 'Abstract figuration dissolving into atmosphere - dreamlike and luminous.', '/images/feja.png', 8);

-- Storage bucket for uploaded artworks
insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do nothing;

create policy "Artworks storage: public read"
  on storage.objects for select
  using (bucket_id = 'artworks');

create policy "Artworks storage: admin upload"
  on storage.objects for insert
  with check (bucket_id = 'artworks' and public.is_admin());

create policy "Artworks storage: admin update"
  on storage.objects for update
  using (bucket_id = 'artworks' and public.is_admin());

create policy "Artworks storage: admin delete"
  on storage.objects for delete
  using (bucket_id = 'artworks' and public.is_admin());
