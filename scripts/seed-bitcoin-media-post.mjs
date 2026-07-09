import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function inferSupabaseUrlFromAssetBase(value) {
  if (!value) return '';
  const match = value.match(/^(https:\/\/[^/]+)\/storage\/v1\/object\/public\//);
  return match?.[1] || '';
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || inferSupabaseUrlFromAssetBase(process.env.VITE_SUPABASE_ASSET_BASE_URL);
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-assets';
const PREFIX = (process.env.SUPABASE_STORAGE_PREFIX || 'assets').replace(/^\/+|\/+$/g, '');
const bitcoinImageBasenames = ['port1', 'port2', 'port3', 'port4'];

const post = {
  id: 'media-bear-market-patience-wins',
  title: 'Navigating the Bear Market: Patience Wins the Long Game',
  category: 'Update',
  summary: 'With my good friend Bontox, a well-known forex and crypto trader now based in Japan',
  content: 'Today, Bitcoin continues to lead the direction of the crypto market. When Bitcoin goes down, most altcoins usually follow its movement, creating fear and uncertainty among many traders. This is why patience, discipline, and proper risk management are very important.\n\nAs a crypto trader, I believe that bear markets are not only moments of fear-they are also moments of learning, preparation, and opportunity. The key is not to panic, but to understand the cycle of the market.\n\nBitcoin has gone through many ups and downs before, yet it remains the strongest symbol of the crypto industry. When Bitcoin starts to recover, many altcoins often follow the same direction. That is why traders must stay calm, continue learning, protect their capital, and wait patiently for the right opportunity.\n\nBull markets create excitement, but bear markets build strong and experienced traders. Patience today can become opportunity tomorrow.',
  description: 'With my good friend Bontox, a well-known forex and crypto trader now based in Japan',
  date: '2026-07-05',
};

const contentTypes = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
]);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_SERVICE_ROLE in .env.');
  process.exit(1);
}

if (process.env.VITE_SUPABASE_SERVICE_ROLE) {
  console.warn('Warning: VITE_SUPABASE_SERVICE_ROLE can be exposed to the browser by Vite. Prefer SUPABASE_SERVICE_ROLE_KEY for server-only scripts.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureBucket() {
  const { data: bucket, error: getError } = await supabase.storage.getBucket(BUCKET);
  if (bucket && !getError) return;

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: Array.from(contentTypes.values()),
  });

  if (error && !error.message.toLowerCase().includes('already exists')) throw error;
}

async function findBitcoinDir() {
  const candidates = [path.join(root, 'assets', 'bitcoin'), path.join(root, 'src', 'assets', 'bitcoin')];
  return candidates.find((candidate) => existsSync(candidate));
}

async function findImageFile(dir, basename) {
  const entries = await readdir(dir);
  return entries.find((entry) => path.parse(entry).name.toLowerCase() === basename.toLowerCase());
}

async function uploadImage(dir, basename) {
  const filename = await findImageFile(dir, basename);
  if (!filename) throw new Error(`Missing image file for ${basename} in ${dir}`);

  const sourcePath = path.join(dir, filename);
  const extension = path.extname(filename).toLowerCase();
  const contentType = contentTypes.get(extension);
  if (!contentType) throw new Error(`Unsupported image type: ${filename}`);

  const destinationKey = `media/bitcoin/${filename}`;
  const destinationPath = PREFIX ? `${PREFIX}/${destinationKey}` : destinationKey;
  const [fileBuffer, fileStat] = await Promise.all([readFile(sourcePath), stat(sourcePath)]);

  const { error } = await supabase.storage.from(BUCKET).upload(destinationPath, fileBuffer, {
    cacheControl: '31536000',
    contentType,
    upsert: true,
  });

  if (error) throw new Error(`${filename}: ${error.message}`);
  return { key: destinationKey, bytes: fileStat.size };
}

async function findStoredImages() {
  const prefixes = ['assets/media/bitcoin', 'assets/bitcoin', 'media/bitcoin', 'bitcoin'];
  for (const prefix of prefixes) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 100 });
    if (error || !data?.length) continue;

    const keys = bitcoinImageBasenames.map((basename) => {
      const match = data.find((item) => path.parse(item.name).name.toLowerCase() === basename);
      return match ? `${prefix}/${match.name}`.replace(/^assets\//, '') : '';
    });

    if (keys.slice(0, 3).every(Boolean)) return keys.filter(Boolean);
  }

  return [];
}

function isSchemaCompatibilityError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();
  return error?.code === 'PGRST204' || error?.code === '42703' || text.includes('column') || text.includes('schema cache');
}

async function upsertPost(images) {
  const payload = {
    ...post,
    image: images[0],
    images,
  };

  const { error } = await supabase.from('gallery_items').upsert(payload, { onConflict: 'id' });
  if (!error) return;
  if (!isSchemaCompatibilityError(error)) throw error;

  const legacyPayload = {
    id: post.id,
    title: post.title,
    category: post.category,
    description: `${post.summary}\n\n${post.content}`,
    image: images[0],
    date: post.date,
  };
  const { error: legacyError } = await supabase.from('gallery_items').upsert(legacyPayload, { onConflict: 'id' });
  if (legacyError) throw legacyError;
}

async function main() {
  const bitcoinDir = await findBitcoinDir();

  console.log(`Using bucket: ${BUCKET}`);
  await ensureBucket();

  let images = await findStoredImages();

  if (!images.length) {
    if (!bitcoinDir) throw new Error('Missing assets/bitcoin or src/assets/bitcoin directory, and no port1-port3 images were found in Supabase storage.');

    console.log(`Using image directory: ${bitcoinDir}`);
    const uploaded = [];
    for (const basename of bitcoinImageBasenames) {
      const result = await uploadImage(bitcoinDir, basename);
      uploaded.push(result);
      console.log(`Uploaded ${basename} -> ${result.key} (${result.bytes} bytes)`);
    }
    images = uploaded.map((item) => item.key);
  } else {
    console.log(`Using existing Supabase images: ${images.join(', ')}`);
  }

  await upsertPost(images);
  console.log(`Upserted media post: ${post.title}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
