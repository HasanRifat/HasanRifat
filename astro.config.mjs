import { defineConfig } from 'astro/config';

// The site is served from https://hasanrifat.github.io/HasanRifat/ by default.
// Moving to a custom domain or a user-site repo? Set SITE_URL / SITE_BASE
// (or edit the two defaults below) — every internal link follows.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://hasanrifat.github.io',
  base: process.env.SITE_BASE ?? '/HasanRifat',
  trailingSlash: 'always',
});
