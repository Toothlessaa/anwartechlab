import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-assets';

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

for (const prefix of ['assets/projects', 'assets/team', 'assets/site']) {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 100 });
  if (error) {
    console.error(`[${prefix}] ${error.message}`);
    continue;
  }

  console.log(`\n[${prefix}]`);
  for (const item of data) console.log(item.name);
}
