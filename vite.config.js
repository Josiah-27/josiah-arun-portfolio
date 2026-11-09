import { defineConfig } from 'vite';

// Public URL of the deployed site, used for canonical / Open Graph tags in index.html.
const SITE_URL = (process.env.SITE_URL || 'https://josiaharun.onrender.com').replace(/\/$/, '');

export default defineConfig({
  plugins: [
    {
      name: 'site-url',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
      },
    },
  ],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
});
