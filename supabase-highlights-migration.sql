-- Run this once in Supabase SQL Editor after supabase-schema.sql has been installed.

CREATE TABLE IF NOT EXISTS public.highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  date_text TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_highlights_active_order
  ON public.highlights (is_active, sort_order ASC, created_at ASC);

ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active highlights are publicly readable" ON public.highlights;
CREATE POLICY "Active highlights are publicly readable"
  ON public.highlights FOR SELECT
  USING (is_active = true);

CREATE OR REPLACE FUNCTION public.admin_list_highlights(p_token TEXT)
RETURNS SETOF public.highlights
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public.require_admin(p_token);
  RETURN QUERY SELECT * FROM public.highlights ORDER BY sort_order ASC, created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_highlight(p_token TEXT, p_highlight JSONB)
RETURNS public.highlights
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE v_row public.highlights;
BEGIN
  PERFORM public.require_admin(p_token);
  INSERT INTO public.highlights (title, subtitle, description, date_text, location, href, image_url, sort_order, is_active)
  VALUES (
    p_highlight->>'title', COALESCE(p_highlight->>'subtitle', ''),
    COALESCE(p_highlight->>'description', ''), COALESCE(p_highlight->>'date_text', ''),
    COALESCE(p_highlight->>'location', ''), COALESCE(p_highlight->>'href', ''),
    COALESCE(p_highlight->>'image_url', ''), COALESCE((p_highlight->>'sort_order')::integer, 0),
    COALESCE((p_highlight->>'is_active')::boolean, true)
  ) RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_highlight(p_token TEXT, p_id UUID, p_highlight JSONB)
RETURNS public.highlights
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE v_row public.highlights;
BEGIN
  PERFORM public.require_admin(p_token);
  UPDATE public.highlights SET
    title = COALESCE(p_highlight->>'title', title),
    subtitle = COALESCE(p_highlight->>'subtitle', subtitle),
    description = COALESCE(p_highlight->>'description', description),
    date_text = COALESCE(p_highlight->>'date_text', date_text),
    location = COALESCE(p_highlight->>'location', location),
    href = COALESCE(p_highlight->>'href', href),
    image_url = COALESCE(p_highlight->>'image_url', image_url),
    sort_order = COALESCE((p_highlight->>'sort_order')::integer, sort_order),
    is_active = COALESCE((p_highlight->>'is_active')::boolean, is_active),
    updated_at = now()
  WHERE id = p_id RETURNING * INTO v_row;
  IF NOT FOUND THEN RAISE EXCEPTION 'Highlight not found'; END IF;
  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_highlight(p_token TEXT, p_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public.require_admin(p_token);
  DELETE FROM public.highlights WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reorder_highlights(p_token TEXT, p_ids UUID[])
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public.require_admin(p_token);
  IF cardinality(p_ids) <> (SELECT count(*) FROM public.highlights)
    OR cardinality(p_ids) <> (SELECT count(DISTINCT value) FROM unnest(p_ids) AS ids(value))
    OR EXISTS (
      SELECT 1 FROM unnest(p_ids) AS ids(value)
      WHERE NOT EXISTS (SELECT 1 FROM public.highlights h WHERE h.id = value)
    ) THEN
    RAISE EXCEPTION 'Highlight order must contain every highlight exactly once';
  END IF;
  UPDATE public.highlights AS h
  SET sort_order = ordered.position - 1, updated_at = now()
  FROM unnest(p_ids) WITH ORDINALITY AS ordered(highlight_id, position)
  WHERE h.id = ordered.highlight_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_highlights(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_create_highlight(TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_update_highlight(TEXT, UUID, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_highlight(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_reorder_highlights(TEXT, UUID[]) TO anon;
