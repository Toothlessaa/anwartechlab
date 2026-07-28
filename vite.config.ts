import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? new URL(req.url, 'http://localhost').pathname : '';
        if (url === '/api/screenshot') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              (req as any).body = body ? JSON.parse(body) : {};
            } catch {
              (req as any).body = null;
            }

            if (!(res as any).status) {
              (res as any).status = function (code: number) {
                res.statusCode = code;
                return res;
              };
            }
            if (!(res as any).send) {
              (res as any).send = function (data: any) {
                res.end(data);
              };
            }

            try {
              const module = await server.ssrLoadModule('/api/screenshot.mjs');
              await module.default(req, res);
            } catch (err) {
              console.error('Local API dev server error:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify({ error: 'Local API handler failed' }));
              }
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'VITE_'));

  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
  };
});
