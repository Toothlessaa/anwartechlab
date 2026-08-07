import chromium from '@sparticuz/chromium';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { chromium as playwright } from 'playwright-core';

const jsonHeaders = {
  'cache-control': 'no-store',
  'content-type': 'application/json; charset=utf-8',
};

function jsonResponse(status, error) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: jsonHeaders,
  });
}

function getRuntimeEnvironmentVariable(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value?.trim()) return value.trim();
  }

  return undefined;
}

function inferSupabaseUrlFromAssetBase() {
  const assetBaseUrl = getRuntimeEnvironmentVariable('VITE_SUPABASE_ASSET_BASE_URL');
  if (!assetBaseUrl) return undefined;

  try {
    const parsedUrl = new URL(assetBaseUrl);
    return parsedUrl.pathname.includes('/storage/v1/object/public/') ? parsedUrl.origin : undefined;
  } catch {
    return undefined;
  }
}

async function verifyAdmin(request) {
  const token = request.headers.get('x-admin-token')?.trim();
  if (!token) return jsonResponse(401, 'An active admin session is required.');

  const supabaseUrl =
    getRuntimeEnvironmentVariable('SUPABASE_URL', 'VITE_SUPABASE_URL') ??
    inferSupabaseUrlFromAssetBase();
  const supabaseAnonKey = getRuntimeEnvironmentVariable(
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables for the screenshot function.');
    return jsonResponse(
      503,
      'The screenshot service is missing its function-scoped Supabase configuration.',
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc('verify_admin_session', {
      p_token: token,
    });

    if (error || !data) return jsonResponse(401, 'The admin session is invalid or expired.');
    return null;
  } catch (error) {
    console.error('Admin-session verification failed for the screenshot function:', error);
    return jsonResponse(503, 'The screenshot service could not verify the admin session.');
  }
}

function isVercelRuntime() {
  if (process.platform === 'win32') return false;
  return process.env.VERCEL === '1';
}

async function launchContext(userDataDir) {
  const viewport = { width: 1440, height: 900 };

  if (!isVercelRuntime()) {
    return playwright.launchPersistentContext(userDataDir, {
      channel: process.platform === 'win32' ? 'msedge' : 'chrome',
      headless: true,
      viewport,
      deviceScaleFactor: 1,
    });
  }

  chromium.setGraphicsMode = false;
  return playwright.launchPersistentContext(userDataDir, {
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    viewport,
    deviceScaleFactor: 1,
  });
}

export default async function screenshot(request) {
  if (request.method !== 'POST') {
    return jsonResponse(405, 'Method not allowed.');
  }

  const authorizationError = await verifyAdmin(request);
  if (authorizationError) return authorizationError;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, 'A JSON request body is required.');
  }

  const rawUrl = typeof payload?.url === 'string' ? payload.url.trim() : '';
  if (!rawUrl) return jsonResponse(400, 'A project link is required.');

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
  } catch {
    return jsonResponse(400, 'Enter a valid website URL, including http:// or https://.');
  }

  const userDataDir = '/tmp/playwright-' + randomUUID();
  let context;
  let page;

  try {
    context = await launchContext(userDataDir);
    page = await context.newPage();

    await page.goto(targetUrl.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: 25_000,
    });
    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
    await page.waitForTimeout(500);

    const image = await page.screenshot({
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });

    return new Response(new Uint8Array(image), {
      status: 200,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'image/png',
        'x-screenshot-url': encodeURIComponent(targetUrl.toString()),
      },
    });
  } catch (error) {
    console.error('Screenshot generation failed:', error);
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return jsonResponse(
      timedOut ? 504 : 502,
      timedOut
        ? 'The website took too long to load.'
        : 'Playwright could not reach or capture the project website.',
    );
  } finally {
    await page?.close().catch(() => {});
    await context?.close().catch(() => {});
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}
