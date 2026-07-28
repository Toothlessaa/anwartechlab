# Vercel deployment

The project screenshot endpoint is deployed as a Vercel Serverless Function at `api/screenshot.mjs`.
The public route remains `POST /api/screenshot`.

## Vercel dashboard

1. Connect this repository to a new Vercel project. The framework is auto-detected as **Vite**.
2. The committed `vercel.json` supplies the build command (`npm run build`), output directory (`dist`), and SPA fallback rewrite.
3. In **Settings → Environment Variables**, add the following:

   | Variable | Scope |
   |---|---|
   | `VITE_SUPABASE_URL` | Build + Function |
   | `VITE_SUPABASE_ANON_KEY` | Build + Function |
   | `VITE_SUPABASE_ASSET_BASE_URL` | Build + Function |
   | `SUPABASE_URL` | Function only (optional alias) |
   | `SUPABASE_ANON_KEY` | Function only (optional alias) |

4. Trigger a new deploy after adding environment variables.

Do not add environment files to the deployment or repository.

## Serverless function notes

- The screenshot function uses `@sparticuz/chromium` (~66.5 MB) and `playwright-core` (~12.1 MB). The combined bundle is well under Vercel's 250 MB uncompressed limit.
- `maxDuration` is set to 60 seconds. The Hobby plan supports up to 300 seconds with Fluid Compute.
- The function detects the Vercel runtime via `process.env.VERCEL === '1'` and uses `@sparticuz/chromium` for the browser executable. Locally, it falls back to a system-installed Chrome or Edge.

## Local development

1. Use Node 22.17 or newer (the committed `.nvmrc` selects 22.17.0).
2. Install dependencies with `npm install`.
3. Install the Vercel CLI: `npm i -g vercel` (or use `npx vercel dev`).
4. Run `vercel dev`. This starts the Vite dev server and serves the API function locally at `/api/screenshot`.
5. Keep Chrome installed on macOS/Linux or Microsoft Edge installed on Windows for local Playwright captures. Vercel production uses the bundled `@sparticuz/chromium` runtime.

The endpoint requires the existing admin-session token in the `X-Admin-Token` header. The admin UI supplies this automatically.
