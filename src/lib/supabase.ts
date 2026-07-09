import { createClient } from '@supabase/supabase-js';

function inferSupabaseUrlFromAssetBase(value?: string): string {
  if (!value) return '';
  const match = value.match(/^(https:\/\/[^/]+)\/storage\/v1\/object\/public\//);
  return match?.[1] || '';
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || inferSupabaseUrlFromAssetBase(import.meta.env.VITE_SUPABASE_ASSET_BASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL/VITE_SUPABASE_ASSET_BASE_URL or VITE_SUPABASE_ANON_KEY in environment');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
