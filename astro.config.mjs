import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function sitemapCompatibilityPlugin() {
  return {
    name: 'sitemap-compatibility-alias',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distPath = fileURLToPath(dir);
        const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
        const sitemapXmlPath = path.join(distPath, 'sitemap.xml');
        const sitemapUnderscorePath = path.join(distPath, 'sitemap_index.xml');

        if (fs.existsSync(sitemapIndexPath)) {
          fs.copyFileSync(sitemapIndexPath, sitemapXmlPath);
          fs.copyFileSync(sitemapIndexPath, sitemapUnderscorePath);
          console.log('✅ Generated sitemap.xml and sitemap_index.xml compatibility aliases.');
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://waiwangzhinan.co',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      lastmod: new Date(),
      changefreq: 'weekly',
      priority: 0.8,
      serialize(item) {
        if (item.url === 'https://waiwangzhinan.co/') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (
          item.url.includes('/clients/') ||
          item.url.includes('/recommend/') ||
          item.url.includes('/start/') ||
          item.url.includes('/tools/') ||
          item.url.includes('/status/')
        ) {
          item.changefreq = 'daily';
          item.priority = 0.9;
        } else {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        }
        item.lastmod = new Date();
        return item;
      },
    }),
    sitemapCompatibilityPlugin(),
    mdx(),
  ],
  build: {
    format: 'directory',
  },
});

