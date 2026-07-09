-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/.../sql/new)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- 1. CUSTOM ADMIN AUTH TABLES (no Supabase Auth required)
-- =====================================================
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create your first admin after running this schema:
-- INSERT INTO public.admin_users (email, password_hash, name)
-- VALUES ('admin@example.com', crypt('change-this-password', gen_salt('bf')), 'Admin');

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================
CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  filter TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  story TEXT,
  challenge TEXT,
  solution TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  tech JSONB DEFAULT '[]'::jsonb,
  image TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT 'medium',
  link TEXT,
  github TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read access (for the frontend site)
CREATE POLICY "Projects are publicly readable"
  ON public.projects FOR SELECT
  USING (true);

-- Writes happen through custom admin RPC functions below.

-- =====================================================
-- 3. GALLERY ITEMS TABLE
-- =====================================================
CREATE TABLE public.gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Gallery items are publicly readable"
  ON public.gallery_items FOR SELECT
  USING (true);

-- Writes happen through custom admin RPC functions below.

-- =====================================================
-- 4. STORAGE RLS (for image uploads)
-- =====================================================
-- Storage policies cannot read the custom admin session token from browser uploads.
-- These keep the current admin upload UI working without Supabase Auth, but a fully
-- locked-down production setup should move uploads/deletes to an Edge Function.
CREATE POLICY "Admin UI can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-assets'
  );

CREATE POLICY "Admin UI can update images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-assets'
  );

CREATE POLICY "Admin UI can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-assets'
  );

-- Public read access for images
CREATE POLICY "Images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

-- =====================================================
-- 5. CUSTOM ADMIN AUTH + CRUD RPC FUNCTIONS
-- =====================================================
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

CREATE OR REPLACE FUNCTION public.admin_create_project(p_token TEXT, p_project JSONB)
RETURNS public.projects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_row public.projects;
BEGIN
  PERFORM public.require_admin(p_token);

  INSERT INTO public.projects (id, title, category, filter, description, story, challenge, solution, features, tech, image, size, link, github)
  VALUES (
    p_project->>'id',
    p_project->>'title',
    COALESCE(p_project->>'category', ''),
    COALESCE(p_project->>'filter', ''),
    COALESCE(p_project->>'description', ''),
    NULLIF(p_project->>'story', ''),
    NULLIF(p_project->>'challenge', ''),
    NULLIF(p_project->>'solution', ''),
    COALESCE(p_project->'features', '[]'::jsonb),
    COALESCE(p_project->'tech', '[]'::jsonb),
    COALESCE(p_project->>'image', ''),
    COALESCE(p_project->>'size', 'medium'),
    NULLIF(p_project->>'link', ''),
    NULLIF(p_project->>'github', '')
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_project(p_token TEXT, p_id TEXT, p_project JSONB)
RETURNS public.projects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_row public.projects;
BEGIN
  PERFORM public.require_admin(p_token);

  UPDATE public.projects
  SET
    title = p_project->>'title',
    category = COALESCE(p_project->>'category', ''),
    filter = COALESCE(p_project->>'filter', ''),
    description = COALESCE(p_project->>'description', ''),
    story = NULLIF(p_project->>'story', ''),
    challenge = NULLIF(p_project->>'challenge', ''),
    solution = NULLIF(p_project->>'solution', ''),
    features = COALESCE(p_project->'features', '[]'::jsonb),
    tech = COALESCE(p_project->'tech', '[]'::jsonb),
    image = COALESCE(p_project->>'image', ''),
    size = COALESCE(p_project->>'size', 'medium'),
    link = NULLIF(p_project->>'link', ''),
    github = NULLIF(p_project->>'github', ''),
    updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_project(p_token TEXT, p_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public.require_admin(p_token);
  DELETE FROM public.projects WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_gallery_item(p_token TEXT, p_item JSONB)
RETURNS public.gallery_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_row public.gallery_items;
BEGIN
  PERFORM public.require_admin(p_token);

  INSERT INTO public.gallery_items (id, title, category, summary, content, description, image, images, date)
  VALUES (
    p_item->>'id',
    p_item->>'title',
    COALESCE(p_item->>'category', ''),
    COALESCE(p_item->>'summary', ''),
    COALESCE(p_item->>'content', ''),
    COALESCE(p_item->>'description', ''),
    COALESCE(p_item->>'image', ''),
    COALESCE(p_item->'images', '[]'::jsonb),
    COALESCE(NULLIF(p_item->>'date', '')::date, CURRENT_DATE)
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_gallery_item(p_token TEXT, p_id TEXT, p_item JSONB)
RETURNS public.gallery_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_row public.gallery_items;
BEGIN
  PERFORM public.require_admin(p_token);

  UPDATE public.gallery_items
  SET
    title = p_item->>'title',
    category = COALESCE(p_item->>'category', ''),
    summary = COALESCE(p_item->>'summary', ''),
    content = COALESCE(p_item->>'content', ''),
    description = COALESCE(p_item->>'description', ''),
    image = COALESCE(p_item->>'image', ''),
    images = COALESCE(p_item->'images', '[]'::jsonb),
    date = COALESCE(NULLIF(p_item->>'date', '')::date, CURRENT_DATE),
    updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Media post not found';
  END IF;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_gallery_item(p_token TEXT, p_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public.require_admin(p_token);
  DELETE FROM public.gallery_items WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_login(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_logout(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_session(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_create_project(TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_update_project(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_project(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_create_gallery_item(TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_update_gallery_item(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_gallery_item(TEXT, TEXT) TO anon;
