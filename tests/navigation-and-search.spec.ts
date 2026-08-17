import { test, expect } from '@playwright/test';

test.describe('Navigation and Instant Search', () => {
  test('opens search modal and filters results by query', async ({ page }) => {
    await page.goto('/');

    const searchOpenBtn = page.locator('#search-open-btn');
    await searchOpenBtn.click();

    const searchModal = page.locator('#search-modal');
    await expect(searchModal).toBeVisible();

    const searchInput = page.locator('#search-input');
    await searchInput.fill('ChatGPT');

    const searchResults = page.locator('#search-results');
    await expect(searchResults).toContainText('ChatGPT 国内怎么使用？');

    // Click result
    const resultLink = searchResults.getByRole('link', { name: /ChatGPT/ }).first();
    await resultLink.click();

    await expect(page).toHaveURL(/\/use\/chatgpt\//);
    await expect(page.locator('h1')).toContainText('ChatGPT');
  });

  test('desktop navigation bar links to all 6 category hubs', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: '从零开始' }).first().click();
    await expect(page).toHaveURL(/\/start\//);
    await expect(page.locator('h1')).toContainText('从零开始');

    await page.getByRole('link', { name: '机场入门' }).first().click();
    await expect(page).toHaveURL(/\/airport\//);
    await expect(page.locator('h1')).toContainText('机场入门');

    await page.getByRole('link', { name: '客户端' }).first().click();
    await expect(page).toHaveURL(/\/clients\//);
    await expect(page.locator('h1')).toContainText('客户端');

    await page.getByRole('link', { name: '使用场景' }).first().click();
    await expect(page).toHaveURL(/\/use\//);
    await expect(page.locator('h1')).toContainText('使用场景');

    await page.getByRole('link', { name: '故障排查' }).first().click();
    await expect(page).toHaveURL(/\/fix\//);
    await expect(page.locator('h1')).toContainText('故障排查');

    await page.getByRole('link', { name: '选型指南' }).first().click();
    await expect(page).toHaveURL(/\/choose\//);
    await expect(page.locator('h1')).toContainText('选型指南');

    await page.getByRole('link', { name: '工具箱' }).first().click();
    await expect(page).toHaveURL(/\/tools\//);
    await expect(page.locator('h1')).toContainText('网络工具箱');

    await page.getByRole('link', { name: '状态雷达' }).first().click();
    await expect(page).toHaveURL(/\/status\//);
    await expect(page.locator('h1')).toContainText('暗网天文台');
  });

  test('interactive node inspector and latency calculator work properly', async ({ page }) => {
    await page.goto('/tools/');

    // Test node inspector with VLESS
    const nodeInput = page.locator('#node-input');
    await nodeInput.fill('vless://123456@hk.example.com:443?security=reality');
    await page.locator('#inspect-btn').click();

    const inspectResult = page.locator('#inspect-result');
    await expect(inspectResult).toBeVisible();
    await expect(inspectResult).toContainText('VLESS 现代协议节点');

    // Test simulator
    const simIsp = page.locator('#sim-isp');
    await simIsp.selectOption('telecom');
    const calcPing = page.locator('#calc-ping');
    await expect(calcPing).toBeVisible();
  });
});
