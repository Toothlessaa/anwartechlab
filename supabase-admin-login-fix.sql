-- =====================================================
-- Admin login repair script
-- Use this if /admin/login reaches admin_login but fails with:
--   function crypt(text, text) does not exist
--
-- This keeps the simple custom admin login. It does not use Supabase Auth.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.admin_login(p_email TEXT, p_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_admin public.admin_users%ROWTYPE;
  v_token TEXT;
BEGIN
  SELECT * INTO v_admin
  FROM public.admin_users
  WHERE lower(email) = lower(p_email)
    AND active = true
  LIMIT 1;

  IF NOT FOUND OR v_admin.password_hash <> crypt(p_password, v_admin.password_hash) THEN
    RAISE EXCEPTION 'Invalid email or password';
  END IF;

  DELETE FROM public.admin_sessions
  WHERE admin_user_id = v_admin.id
    AND expires_at <= now();

  v_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO public.admin_sessions (admin_user_id, token_hash, expires_at)
  VALUES (v_admin.id, encode(digest(v_token, 'sha256'), 'hex'), now() + interval '7 days');

  RETURN jsonb_build_object(
    'token', v_token,
    'admin', jsonb_build_object(
      'id', v_admin.id,
      'email', v_admin.email,
      'name', v_admin.name,
      'role', v_admin.role
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_admin_session(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_admin public.admin_users%ROWTYPE;
BEGIN
  SELECT au.* INTO v_admin
  FROM public.admin_sessions s
  JOIN public.admin_users au ON au.id = s.admin_user_id
  WHERE s.token_hash = encode(digest(p_token, 'sha256'), 'hex')
    AND s.expires_at > now()
    AND au.active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'id', v_admin.id,
    'email', v_admin.email,
    'name', v_admin.name,
    'role', v_admin.role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.require_admin(p_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT au.id INTO v_admin_id
  FROM public.admin_sessions s
  JOIN public.admin_users au ON au.id = s.admin_user_id
  WHERE s.token_hash = encode(digest(p_token, 'sha256'), 'hex')
    AND s.expires_at > now()
    AND au.active = true
    AND au.role = 'admin'
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired admin session';
  END IF;

  RETURN v_admin_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_logout(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM public.admin_sessions
  WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex');
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_login(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_session(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.require_admin(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_logout(TEXT) TO anon;

INSERT INTO public.admin_users (email, password_hash, name)
VALUES ('noel@gmail.com', extensions.crypt('adminadmin1234', extensions.gen_salt('bf')), 'Noel')
ON CONFLICT (email) DO UPDATE
SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  active = true,
  role = 'admin';

NOTIFY pgrst, 'reload schema';
