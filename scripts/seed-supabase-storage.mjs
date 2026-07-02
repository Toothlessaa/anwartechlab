import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'src', 'assets');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-assets';
const PREFIX = (process.env.SUPABASE_STORAGE_PREFIX || 'assets').replace(/^\/+|\/+$/g, '');

const assets = [
  { file: 'bg.png', key: 'site/bg.png' },
  { file: 'car.png', key: 'projects/car.png' },
  { file: 'hotel.jpg', key: 'projects/hotel.jpg' },
  { file: 'venueproject.png', key: 'projects/venueproject.png' },
  { file: 'lawoffice.png', key: 'projects/lawoffice.png' },
  { file: 'success.png', key: 'projects/success.png' },
  { file: 'jayanne.jpg', key: 'team/jayanne.jpg' },
  { file: 'jean.jpg', key: 'team/jean.jpg' },
  { file: 'noel.png', key: 'team/noel.png' },
  { file: 'khalifa.jpg', key: 'team/khalifa.jpg' },
  { file: 'felbert.JPG', key: 'team/felbert.JPG' },
  { file: 'ivar.jpg', key: 'team/ivar.jpg' },
];

const contentTypes = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.svg', 'image/svg+xml'],
]);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials. Fill SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureBucket() {
  const { data: bucket, error: getError } = await supabase.storage.getBucket(BUCKET);
  if (bucket && !getError) return;

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
  });

  if (createError && !createError.message.toLowerCase().includes('already exists')) throw createError;
}

async function uploadAsset(asset) {
  const sourcePath = path.join(assetsDir, asset.file);
  if (!existsSync(sourcePath)) {
    console.warn(`Skipped missing asset: ${asset.file}`);
    return null;
  }

  const extension = path.extname(asset.file).toLowerCase();
  const contentType = contentTypes.get(extension) || 'application/octet-stream';
  const destinationPath = PREFIX ? `${PREFIX}/${asset.key}` : asset.key;
  const fileStat = await stat(sourcePath);
  const fileBuffer = await readFile(sourcePath);

  const { error } = await supabase.storage.from(BUCKET).upload(destinationPath, fileBuffer, {
    cacheControl: '31536000',
    contentType,
    upsert: true,
  });

  if (error) throw new Error(`${asset.file}: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(destinationPath);
  return { file: asset.file, path: destinationPath, bytes: fileStat.size, publicUrl: data.publicUrl };
}

async function main() {
  console.log(`Using bucket: ${BUCKET}`);
  await ensureBucket();

  const uploaded = [];
  for (const asset of assets) {
    const result = await uploadAsset(asset);
    if (result) {
      uploaded.push(result);
      console.log(`Uploaded ${result.file} -> ${result.publicUrl}`);
    }
  }

  console.log('\nPublic URL map:');
  console.log(JSON.stringify(Object.fromEntries(uploaded.map((item) => [item.file, item.publicUrl])), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
