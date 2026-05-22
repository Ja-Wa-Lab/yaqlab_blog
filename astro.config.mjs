import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ja-wa-lab.github.io',
  base: '/yaqlab_blog',
  integrations: [sitemap()]
});
