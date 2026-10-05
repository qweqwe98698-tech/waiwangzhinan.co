import { test, expect } from '@playwright/test';

const urlsToAudit = [
  '/',
  '/start/',
  '/start/how-to-access-overseas-websites/',
  '/start/what-is-proxy/',
  '/start/proxy-vs-vpn/',
  '/airport/',
  '/airport/what-is-airport/',
  '/airport/how-to-use/',
  '/clients/',
  '/clients/windows/',
  '/clients/iphone/',
  '/clients/clash-verge/',
  '/use/',
  '/use/chatgpt/',
  '/use/claude/',
  '/use/github/',
  '/fix/',
  '/fix/cannot-connect/',
  '/fix/timeout/',
  '/choose/',
  '/choose/beginner/',
  '/choose/ai/',
  '/recommend/',
  '/compare/',
  '/brands/guangsu/',
  '/brands/lingmao/',
  '/brands/xingdaomeng/',
  '/brands/feimao/',
  '/brands/weitu/',
  '/brands/yuzhou/',
  '/brands/u1s1/',
  '/brands/jilian/',
  '/brands/guangnianti/',
  '/brands/yifanyun/',
  '/brands/ermaoyun/',
  '/brands/sogoyun/',
  '/brands/kexinyun/',
  '/brands/sujie/',
  '/brands/kuaili/',
  '/start/scientific-surfing-guide/',
  '/start/protocols-explained/',
  '/start/iplc-vs-iepl-transit/',
  '/airport/node-multiplier/',
  '/airport/subscription-security/',
  '/airport/free-vs-paid/',
  '/clients/macos-guide/',
  '/clients/android-guide/',
  '/clients/tun-mode-guide/',
  '/clients/subscription-convert/',
  '/use/midjourney/',
  '/use/tiktok/',
  '/use/netflix/',
  '/use/steam-gaming/',
  '/use/cross-border-ecommerce/',
  '/fix/domestic-slow-bypass/',
  '/fix/chatgpt-blocked-solution/',
  '/fix/port-conflict-solution/',
  '/choose/gaming/',
  '/choose/avoid-scams/',
  '/about/',
  '/editorial/',
  '/privacy/',
  '/terms/',
  '/contact/',
  '/sitemap/',
  '/tools/',
  '/status/',
  '/404/',
];

test.describe('SEO, Canonical & Dead Link Audit', () => {
  for (const url of urlsToAudit) {
    test(`auditing SEO on ${url}`, async ({ page }) => {
      const response = await page.goto(url);
      if (url === '/404/') {
        expect(response?.status()).toBe(404);
      } else {
        expect(response?.status()).toBe(200);
      }

      // Title
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      expect(title).toContain('外网指南');

      // Meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
      const descContent = await metaDescription.getAttribute('content');
      expect(descContent && descContent.length > 10).toBeTruthy();

      // Canonical link
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);

      // Schema script
      const schemaScript = page.locator('script[type="application/ld+json"]');
      const count = await schemaScript.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // Zero empty href or href="#"
      const links = page.locator('a');
      const linkCount = await links.count();
      for (let i = 0; i < linkCount; i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).not.toBe('');
        expect(href).not.toBe('#');
      }
    });
  }
});
