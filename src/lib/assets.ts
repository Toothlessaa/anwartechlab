const assetBaseUrl = import.meta.env.VITE_SUPABASE_ASSET_BASE_URL?.replace(/\/$/, '');

export function storageAsset(path: string) {
  if (!assetBaseUrl) {
    console.warn('Missing VITE_SUPABASE_ASSET_BASE_URL. Supabase asset URLs will be empty.');
    return path;
  }

  if (path.startsWith('http')) return path;
  return `${assetBaseUrl}/${path}`;
}

export function relativeStoragePath(url: string): string {
  if (!assetBaseUrl || !url.startsWith(assetBaseUrl)) return url;
  return url.slice(assetBaseUrl.length + 1);
}
