import express from 'express';
import { chromium } from 'playwright';

const app = express();
const port = Number(process.env.PORT) || 3001;
const host = '127.0.0.1';

app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'Playwright Screenshot Service' });
});

app.post('/api/screenshot', async (request, response) => {
  const rawUrl = typeof request.body?.url === 'string' ? request.body.url.trim() : '';
  if (!rawUrl) {
    return response.status(400).json({ error: 'A project link is required.' });
  }

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
  } catch {
    return response.status(400).json({
      error: 'Enter a valid website URL, including http:// or https://.',
    });
  }

  let browser;
  let context;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();
    await page.goto(targetUrl.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(500);

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });

    response
      .status(200)
      .type('png')
      .set('Cache-Control', 'no-store')
      .set('X-Screenshot-Url', encodeURIComponent(targetUrl.toString()))
      .send(screenshot);
  } catch (error) {
    console.error('Screenshot generation failed:', error);

    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    response.status(timedOut ? 504 : 502).json({
      error: timedOut
        ? 'The website took too long to load.'
        : 'Playwright could not reach or capture the project website.',
    });
  } finally {
    await context?.close().catch(() => {});
    await browser?.close().catch(() => {});
  }
});

app.listen(port, host, () => {
  console.log(`Playwright screenshot service listening on http://${host}:${port}`);
});
