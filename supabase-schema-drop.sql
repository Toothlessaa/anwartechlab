-- Drop everything created by supabase-schema.sql
-- Run this in your Supabase SQL Editor to tear down the CMS tables

DROP TABLE IF EXISTS public.gallery_items CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP POLICY IF EXISTS "Admin can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Images are publicly readable" ON storage.objects;
