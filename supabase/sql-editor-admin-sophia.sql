-- =============================================================================
-- Admin: sophiabeshlei@gmail.com
-- Uruchom w Supabase → SQL Editor
--
-- WYMAGANE: użytkownik musi już istnieć w Authentication → Users
-- (Add user → sophiabeshlei@gmail.com + hasło)
-- =============================================================================

-- Profil (jeśli brak — np. konto sprzed migracji)
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where email = 'sophiabeshlei@gmail.com'
on conflict (id) do update set role = 'admin';

-- Sprawdzenie
select
  u.id,
  u.email,
  p.role,
  p.created_at
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'sophiabeshlei@gmail.com';
