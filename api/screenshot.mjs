import chromium from '@sparticuz/chromium';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { chromium as playwright } from 'playwright-core';

export const config = {
  maxDuration: 60,
};

const jsonHeaders = {
  'cache-control': 'no-store',
  'content-type': 'application/json; charset=utf-8',
};

function jsonResponse(res, status, error) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify({ error }));
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

async function verifyAdmin(req, res) {
  const token = req.headers['x-admin-token']?.trim();
  if (!token) {
    jsonResponse(res, 401, 'An active admin session is required.');
    return false;
  }

  const supabaseUrl =
    getRuntimeEnvironmentVariable('SUPABASE_URL', 'VITE_SUPABASE_URL') ??
    inferSupabaseUrlFromAssetBase();
  const supabaseAnonKey = getRuntimeEnvironmentVariable(
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables for the screenshot function.');
    jsonResponse(
      res,
      503,
      'The screenshot service is missing its function-scoped Supabase configuration.',
    );
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc('verify_admin_session', {
      p_token: token,
    });

    if (error || !data) {
      jsonResponse(res, 401, 'The admin session is invalid or expired.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Admin-session verification failed for the screenshot function:', error);
    jsonResponse(res, 503, 'The screenshot service could not verify the admin session.');
    return false;
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, 'Method not allowed.');
  }

  const authorized = await verifyAdmin(req, res);
  if (!authorized) return;

  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return jsonResponse(res, 400, 'A JSON request body is required.');
  }

  const rawUrl = typeof payload?.url === 'string' ? payload.url.trim() : '';
  if (!rawUrl) return jsonResponse(res, 400, 'A project link is required.');

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
  } catch {
    return jsonResponse(res, 400, 'Enter a valid website URL, including http:// or https://.');
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
    await page.waitForTimeout(1_000);

    const image = await page.screenshot({
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });

    res.setHeader('cache-control', 'no-store');
    res.setHeader('content-type', 'image/png');
    res.setHeader('x-screenshot-url', encodeURIComponent(targetUrl.toString()));
    res.status(200).send(Buffer.from(image));
  } catch (error) {
    console.error('Screenshot generation failed:', error);
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    jsonResponse(
      res,
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
