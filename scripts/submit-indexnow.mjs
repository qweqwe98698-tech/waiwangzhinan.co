/**
 * IndexNow Batch URL Submission Script
 * Submits all canonical URLs of waiwangzhinan.co to Bing & Yandex IndexNow API
 */
import fs from 'node:fs';
import path from 'node:path';

const HOST = 'waiwangzhinan.co';
const KEY = '3c5f894c44be4ac38d9e983149de18ca';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.resolve('dist/sitemap-0.xml');

async function submitIndexNow() {
  console.log('🔍 Reading sitemap to extract URLs...');
  
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ dist/sitemap-0.xml not found. Run `pnpm build` first.');
    process.exit(1);
  }

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = [];
  const locRegex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(sitemapXml)) !== null) {
    urls.push(match[1]);
  }

  console.log(`📋 Found ${urls.length} canonical URLs in sitemap.`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    console.log('🚀 Submitting to https://api.indexnow.org/indexnow ...');
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`✅ Successfully submitted ${urls.length} URLs to IndexNow! (Status: ${response.status})`);
    } else {
      const errorText = await response.text();
      console.warn(`⚠️ IndexNow responded with status ${response.status}:`, errorText);
    }
  } catch (error) {
    console.error('❌ Network error submitting to IndexNow:', error.message);
  }
}

submitIndexNow();
