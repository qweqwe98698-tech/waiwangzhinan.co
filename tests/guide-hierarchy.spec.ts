import { test, expect } from '@playwright/test';

test.describe('Guide Page Hierarchy and Structure', () => {
  test('article page contains QuickAnswer, prose content, FAQ and NextStep', async ({ page }) => {
    await page.goto('/start/what-is-proxy/');

    // H1
    const h1 = page.locator('h1');
    await expect(h1).toContainText('代理（Proxy）是什么？');

    // 30s Quick Answer Card
    const quickAnswer = page.getByText('30 秒极速解答');
    await expect(quickAnswer).toBeVisible();
    await expect(page.getByText('跑腿代购员')).toBeVisible();

    // Prose article content
    const article = page.locator('article.prose-guide');
    await expect(article).toBeVisible();
    await expect(article.locator('h2').first()).toBeVisible();

    // NextStep Component
    const nextStep = page.locator('div:has-text("知识进度已达成")').first();
    await expect(nextStep).toBeVisible();
    await expect(page.getByText('VPN 和代理有什么区别？')).toBeVisible();
  });

  test('Pillar hub lists all cluster guides with direct links', async ({ page }) => {
    await page.goto('/airport/');
    
    await expect(page.locator('h1')).toContainText('机场入门');
    await expect(page.getByText('网络「机场」到底是什么？')).toBeVisible();
    await expect(page.getByText('代理「节点」是什么？')).toBeVisible();
    await expect(page.getByText('机场「订阅」是什么？')).toBeVisible();
    await expect(page.getByText('机场怎么使用？新手三步上手完整教程')).toBeVisible();
  });
});
