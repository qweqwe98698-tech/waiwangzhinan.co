import { test, expect } from '@playwright/test';

test.describe('Homepage - Knowledge Navigation System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct brand title, meta and hero elements', async ({ page }) => {
    await expect(page).toHaveTitle(/外网指南/);
    
    // Hero verification
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toContainText('第一次上外网？');
    await expect(heroHeading).toContainText('从这里开始。');

    // CTAs
    const startBtn = page.getByRole('link', { name: '从零开始学习 (L0)' });
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toHaveAttribute('href', '/start/');
  });

  test('displays 6 beginner status cards and all original components', async ({ page }) => {
    // 6 Status cards
    await expect(page.getByText('我第一次想访问国外网站')).toBeVisible();
    await expect(page.getByText('别人说需要机场，但机场到底是什么？')).toBeVisible();
    await expect(page.getByText('我已经拿到了订阅链接，但不知道怎么用')).toBeVisible();
    await expect(page.getByText('我的手机或电脑应该下载哪个客户端？')).toBeVisible();
    await expect(page.getByText('我想找适合自己需求的服务商')).toBeVisible();
    await expect(page.getByText('节点全部超时、连不上、无法上网怎么办？')).toBeVisible();

    // JourneyMap
    await expect(page.getByText('从零到熟练的 6 个关键阶段')).toBeVisible();
    
    // QuestionCloud
    await expect(page.getByText('新手最常搜索的热门问题')).toBeVisible();

    // DevicePicker
    await expect(page.getByText('你正在使用什么设备？')).toBeVisible();

    // ScenarioPicker
    await expect(page.getByText('你想访问什么服务？')).toBeVisible();

    // AirportMatcher
    await expect(page.getByText('新手需求客观匹配器')).toBeVisible();
  });

  test('device picker switches tabs correctly', async ({ page }) => {
    const macBtn = page.locator('button[data-device="macos"]');
    await macBtn.click();
    
    const macPanel = page.locator('#device-panel-macos');
    await expect(macPanel).toBeVisible();
    await expect(macPanel).toContainText('macOS 推荐客户端');

    const iosBtn = page.locator('button[data-device="iphone"]');
    await iosBtn.click();
    const iosPanel = page.locator('#device-panel-iphone');
    await expect(iosPanel).toBeVisible();
    await expect(iosPanel).toContainText('Shadowrocket (小火箭)');
  });

  test('airport matcher updates dynamic advice', async ({ page }) => {
    const purposeSelect = page.locator('#matcher-purpose');
    await purposeSelect.selectOption('streaming');

    const adviceTitle = page.locator('#matcher-title');
    await expect(adviceTitle).toContainText('全流媒体');
  });
});
