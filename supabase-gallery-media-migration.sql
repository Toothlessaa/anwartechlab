-- Run this once in Supabase SQL Editor to upgrade existing media posts for admin editing.

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

UPDATE public.gallery_items
SET
  summary = COALESCE(NULLIF(summary, ''), split_part(description, E'\n\n', 1), ''),
  content = COALESCE(NULLIF(content, ''), description, ''),
  images = CASE
    WHEN images IS NULL OR images = '[]'::jsonb THEN to_jsonb(ARRAY[image])
    ELSE images
  END
WHERE description <> '' OR image <> '';
