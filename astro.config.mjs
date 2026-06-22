// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://eminenthospicewebsite.pages.dev', // Cloudflare Pages URL (no custom domain yet)
  trailingSlash: 'never',

  // Emit `en.html` instead of `en/index.html` so Cloudflare Pages serves
  // no-slash URLs (/en, /en/services) at 200 — matching trailingSlash:'never'
  // and the no-slash canonical tags, avoiding 308 redirect hops.
  build: {
    format: 'file',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: {
      prefixDefaultLocale: true, // /en and /ko both prefixed
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) => ![
        'https://eminenthospicewebsite.pages.dev',
        'https://eminenthospicewebsite.pages.dev/',
      ].includes(page),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ko: 'ko-KR',
        },
      },
    }),
  ],
});
