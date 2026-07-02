const assetBaseUrl = import.meta.env.VITE_SUPABASE_ASSET_BASE_URL?.replace(/\/$/, '');

export function storageAsset(path: string) {
  if (!assetBaseUrl) {
    console.warn('Missing VITE_SUPABASE_ASSET_BASE_URL. Supabase asset URLs will be empty.');
    return '';
  }

  return `${assetBaseUrl}/${path}`;
}
