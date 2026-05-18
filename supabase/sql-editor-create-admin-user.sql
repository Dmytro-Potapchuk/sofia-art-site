-- =============================================================================
-- NIE UZYWAJ do tworzenia hasla / uzytkownika (powoduje blad 500 przy logowaniu)
--
-- Poprawna procedura:
-- 1) sql-editor-fix-auth-login.sql  (jesli bylo zle konto)
-- 2) Authentication -> Users -> Add user (email + haslo + Auto Confirm)
-- 3) sql-editor-admin-sophia.sql    (rola admin)
-- =============================================================================

-- Tylko nadanie roli admin (uzytkownik MUSI istniec w Authentication):
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where email = 'sophiabeshlei@gmail.com'
on conflict (id) do update set role = 'admin';

select
  u.id,
  u.email,
  p.role
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'sophiabeshlei@gmail.com';
