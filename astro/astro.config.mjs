// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Custom plugin to rewrite .php URLs to clean URLs
const phpRewritePlugin = () => ({
  name: 'php-rewrite',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Rewrite .php URLs to clean URLs
      if (req.url && req.url.endsWith('.php')) {
        req.url = req.url.replace(/\.php$/, '/');
      }
      next();
    });
  }
});

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  base: '/',
  vite: {
    plugins: [tailwindcss(), phpRewritePlugin()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:80',
          changeOrigin: true,
        }
      }
    }
  }
});
