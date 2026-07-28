# Netlify screenshot deployment

The project screenshot endpoint is deployed as the Netlify Function at `netlify/functions/screenshot.mjs`.
The public route remains `POST /api/screenshot`.

## Netlify dashboard

1. Connect this repository to the Netlify site and deploy the production branch.
2. The committed `netlify.toml` supplies the build command (`npm run build`), publish directory (`dist`), Functions directory, bundler settings, and Node version.
3. In **Project configuration -> Environment variables**, make these existing variables available to both **Builds** and **Functions**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   The Function also accepts function-only aliases named `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Keep `VITE_SUPABASE_ASSET_BASE_URL` available to **Builds** for the existing frontend asset URLs.
5. Trigger a new deploy after changing environment-variable scopes.

Do not add environment files to the deployment or repository.

## Local development

1. Use Node 22.17 or newer (the committed `.nvmrc` selects 22.17.0).
2. Install dependencies with `npm install`.
3. Run `npm run dev`. The Netlify Vite plugin emulates Functions and routing at the Vite URL, so no separate Express process is needed.
4. Keep Chrome installed on macOS/Linux or Microsoft Edge installed on Windows for local Playwright captures. Netlify production uses the bundled serverless Chromium runtime.

The endpoint requires the existing admin-session token in the `X-Admin-Token` header. The admin UI supplies this automatically.
