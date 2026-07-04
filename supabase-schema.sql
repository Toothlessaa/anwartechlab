-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/.../sql/new)

-- =====================================================
-- 1. PROFILES TABLE (linked to auth.users)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Automatically create a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

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

-- Admin write access (authenticated users)
CREATE POLICY "Admin can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update projects"
  ON public.projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete projects"
  ON public.projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. GALLERY ITEMS TABLE
-- =====================================================
CREATE TABLE public.gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Gallery items are publicly readable"
  ON public.gallery_items FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admin can insert gallery items"
  ON public.gallery_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update gallery items"
  ON public.gallery_items FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete gallery items"
  ON public.gallery_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. STORAGE RLS (for image uploads)
-- =====================================================
-- Allow authenticated users to upload files to portfolio-assets bucket
CREATE POLICY "Admin can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-assets'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin can update images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-assets'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-assets'
    AND auth.role() = 'authenticated'
  );

-- Public read access for images
CREATE POLICY "Images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');
