import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserSite = repository.toLowerCase().endsWith('.github.io');
const base = process.env.GITHUB_ACTIONS && !isUserSite ? `/${repository}` : '/';

export default defineConfig({
  site: 'https://yifengz17.github.io',
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
