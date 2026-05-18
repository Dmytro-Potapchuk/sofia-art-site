-- =============================================================================
-- NAPRAWA bledu 500 przy logowaniu ("Database error querying schema")
--
-- Przyczyna: konto utworzone recznie w auth.users przez SQL jest czesto
-- niekompletne. Supabase Auth wymaga konta z panelu Authentication.
--
-- KROK 1: Uruchom ten skrypt (czysci uszkodzone konto)
-- KROK 2: Dashboard -> Authentication -> Users -> Add user
--         Email: sophiabeshlei@gmail.com
--         Haslo: (twoje)
--         Auto Confirm User: ON
-- KROK 3: Uruchom sql-editor-admin-sophia.sql (tylko rola admin)
-- =============================================================================

delete from public.profiles
where id in (
  select id from auth.users where email = 'sophiabeshlei@gmail.com'
);

delete from auth.identities
where user_id in (
  select id from auth.users where email = 'sophiabeshlei@gmail.com'
);

delete from auth.users
where email = 'sophiabeshlei@gmail.com';

-- Po kroku 2 w Dashboard - uruchom:
-- insert into public.profiles (id, role)
-- select id, 'admin' from auth.users
-- where email = 'sophiabeshlei@gmail.com'
-- on conflict (id) do update set role = 'admin';

select 'Usunieto stare konto. Teraz utworz uzytkownika w Authentication -> Users.' as status;
