-- Drop everything created by supabase-schema.sql
-- Run this in your Supabase SQL Editor to tear down the CMS tables

DROP TABLE IF EXISTS public.gallery_items CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.admin_sessions CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

DROP FUNCTION IF EXISTS public.admin_delete_gallery_item(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.admin_update_gallery_item(TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.admin_create_gallery_item(TEXT, JSONB);
DROP FUNCTION IF EXISTS public.admin_delete_project(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.admin_update_project(TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.admin_create_project(TEXT, JSONB);
DROP FUNCTION IF EXISTS public.admin_logout(TEXT);
DROP FUNCTION IF EXISTS public.admin_login(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.require_admin(TEXT);
DROP FUNCTION IF EXISTS public.verify_admin_session(TEXT);

DROP POLICY IF EXISTS "Admin UI can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin UI can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin UI can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Images are publicly readable" ON storage.objects;
