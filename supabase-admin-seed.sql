-- Run this after supabase-schema.sql to create the initial admin account.
-- The password is hashed by Postgres before being stored.

INSERT INTO public.admin_users (email, password_hash, name)
VALUES (
  'noel@gmail.com',
  extensions.crypt('adminadmin1234', extensions.gen_salt('bf')),
  'Noel'
)
ON CONFLICT (email) DO UPDATE
SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  active = true,
  role = 'admin';
