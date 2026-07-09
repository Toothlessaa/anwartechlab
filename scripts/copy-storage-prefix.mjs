import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-assets';
const sourcePrefix = process.argv[2];
const destinationPrefix = process.argv[3];

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.');
  process.exit(1);
}

if (!sourcePrefix || !destinationPrefix) {
  console.error('Usage: node scripts/copy-storage-prefix.mjs <source-prefix> <destination-prefix>');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function copyPrefix(source, destination) {
  const { data, error } = await supabase.storage.from(bucket).list(source, { limit: 1000 });
  if (error) throw error;

  for (const item of data || []) {
    if (!item.name) continue;

    const sourcePath = `${source}/${item.name}`;
    const destinationPath = `${destination}/${item.name}`;
    const downloaded = await supabase.storage.from(bucket).download(sourcePath);
    if (downloaded.error) throw new Error(`${sourcePath}: ${downloaded.error.message}`);

    const uploaded = await supabase.storage.from(bucket).upload(destinationPath, downloaded.data, {
      upsert: true,
      contentType: item.metadata?.mimetype,
      cacheControl: '31536000',
    });
    if (uploaded.error) throw new Error(`${destinationPath}: ${uploaded.error.message}`);

    console.log(`${sourcePath} -> ${destinationPath}`);
  }
}

copyPrefix(sourcePrefix.replace(/^\/+|\/+$/g, ''), destinationPrefix.replace(/^\/+|\/+$/g, '')).catch((error) => {
  console.error(error);
  process.exit(1);
});
