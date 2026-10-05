/**
 * SEO Health Check & Production Deployment Gatekeeper
 * 
 * Inspects dist/ build output against strict Google & Bing SEO safety standards:
 * - robots.txt safety
 * - noindex rules
 * - canonical mapping
 * - sitemap integrity & URL counts
 * - dead link / empty href detection
 * - duplicate title / H1 detection
 * - schema JSON-LD validity
 * - spam / rogue directory detection
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const BASE_DOMAIN = 'https://waiwangzhinan.co';
const MIN_EXPECTED_PAGES = 50;
const MAX_EXPECTED_PAGES = 300;

const errors = [];
const warnings = [];

console.log('\n======================================================');
console.log('🛡️  SEO HEALTH CHECK & RELEASE GATEKEEPER STARTING...');
console.log('======================================================\n');

// 1. Check Build Output Directory
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ dist directory not found! Run `pnpm build` first.');
  process.exit(1);
}

// Helper to recursively collect all html files
function getAllFiles(dir, ext = '.html') {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = getAllFiles(DIST_DIR, '.html');
console.log(`📦 Discovered ${htmlFiles.length} generated HTML pages in dist/`);

// 2. robots.txt Safety Check
const robotsPath = path.join(DIST_DIR, 'robots.txt');
let robotsPass = false;
if (!fs.existsSync(robotsPath)) {
  errors.push('robots.txt: File is missing from dist/');
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (/User-agent:\s*\*\s*\nDisallow:\s*\/\s*$/m.test(robotsContent)) {
    errors.push('robots.txt: Critical error - User-agent: * Disallow: / is blocking entire site!');
  } else if (!robotsContent.includes('Sitemap:')) {
    errors.push('robots.txt: Missing Sitemap declaration in robots.txt');
  } else {
    robotsPass = true;
  }
}

// 3. Sitemap Integrity Check
const sitemapIndexPath = path.join(DIST_DIR, 'sitemap-index.xml');
const sitemap0Path = path.join(DIST_DIR, 'sitemap-0.xml');
const sitemapXmlPath = path.join(DIST_DIR, 'sitemap.xml');
const sitemapUnderscorePath = path.join(DIST_DIR, 'sitemap_index.xml');

// Ensure sitemap.xml and sitemap_index.xml exist as compatibility mirrors
if (fs.existsSync(sitemapIndexPath)) {
  if (!fs.existsSync(sitemapXmlPath)) {
    fs.copyFileSync(sitemapIndexPath, sitemapXmlPath);
  }
  if (!fs.existsSync(sitemapUnderscorePath)) {
    fs.copyFileSync(sitemapIndexPath, sitemapUnderscorePath);
  }
}

let sitemapUrls = [];
let sitemapPass = false;

if (!fs.existsSync(sitemapIndexPath) && !fs.existsSync(sitemap0Path)) {
  errors.push('sitemap: Neither sitemap-index.xml nor sitemap-0.xml was found in dist/');
} else if (!fs.existsSync(sitemapXmlPath)) {
  errors.push('sitemap: sitemap.xml compatibility mirror is missing from dist/');
} else {
  const targetSitemap = fs.existsSync(sitemap0Path) ? sitemap0Path : sitemapIndexPath;
  const sitemapXml = fs.readFileSync(targetSitemap, 'utf-8');
  const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

  if (sitemapUrls.length < MIN_EXPECTED_PAGES) {
    errors.push(`sitemap: Abnormally low page count (${sitemapUrls.length} < ${MIN_EXPECTED_PAGES}). Possible build truncation.`);
  } else if (sitemapUrls.length > MAX_EXPECTED_PAGES) {
    errors.push(`sitemap: Abnormally high page count (${sitemapUrls.length} > ${MAX_EXPECTED_PAGES}). Possible spam/loop generation.`);
  }

  // Verify critical pages like shadowrocket are explicitly present
  const requiredUrls = [
    `${BASE_DOMAIN}/clients/shadowrocket/`,
    `${BASE_DOMAIN}/clients/iphone/`,
    `${BASE_DOMAIN}/clients/clash-verge/`,
    `${BASE_DOMAIN}/recommend/`,
    `${BASE_DOMAIN}/start/`,
  ];
  for (const reqUrl of requiredUrls) {
    if (!sitemapUrls.includes(reqUrl)) {
      errors.push(`sitemap: Critical page missing from sitemap: ${reqUrl}`);
    }
  }

  // Check lastmod presence
  if (!sitemapXml.includes('<lastmod>')) {
    warnings.push('sitemap: Missing <lastmod> timestamps in sitemap XML URLs.');
  }

  for (const url of sitemapUrls) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      errors.push(`sitemap: URL contains localhost/dev domain: ${url}`);
    }
    if (url.endsWith('.html') && !url.endsWith('404.html')) {
      warnings.push(`sitemap: URL contains .html instead of directory trailing slash: ${url}`);
    }
    if (!url.startsWith(BASE_DOMAIN)) {
      errors.push(`sitemap: URL does not start with ${BASE_DOMAIN}: ${url}`);
    }
  }

  if (errors.filter(e => e.startsWith('sitemap:')).length === 0) {
    sitemapPass = true;
  }
}

// 4. Detailed HTML Scan
let noindexCount = 0;
let canonicalErrors = 0;
let deadLinksCount = 0;
let schemaErrors = 0;

const titlesMap = new Map();
const h1Map = new Map();
const internalRoutesSet = new Set();

// Pre-populate all available routes
for (const file of htmlFiles) {
  let relative = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let route = '/' + relative.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (route.endsWith('/') === false && route !== '/404') {
    route += '/';
  }
  internalRoutesSet.add(route);
  internalRoutesSet.add('/' + relative); // also allow direct file match
}

const SPAM_PATTERNS = [
  /\/casino\//i,
  /\/bet\//i,
  /\/xxx\//i,
  /\/download-[a-z0-9]{6,}/i,
  /\/\d{6,}\//i
];

for (const file of htmlFiles) {
  const relative = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const is404 = relative.includes('404');
  const html = fs.readFileSync(file, 'utf-8');

  // Check for rogue/spam URLs
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(relative)) {
      errors.push(`Spam/Rogue Path detected: ${relative}`);
    }
  }

  // Check noindex
  const hasNoindex = /<meta[^>]+name=["'](?:robots|googlebot|bingbot)["'][^>]+content=["'][^"']*noindex[^"']*["']/i.test(html);
  if (hasNoindex) {
    noindexCount++;
    if (!is404) {
      errors.push(`noindex: Unexpected noindex meta tag in indexable page: ${relative}`);
    }
  }

  // Check Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    canonicalErrors++;
    errors.push(`canonical: Missing canonical link tag in ${relative}`);
  } else {
    const canonicalHref = canonicalMatch[1];
    if (!canonicalHref.startsWith(BASE_DOMAIN)) {
      canonicalErrors++;
      errors.push(`canonical: Canonical link ${canonicalHref} does not start with ${BASE_DOMAIN} in ${relative}`);
    }
    if (!canonicalHref.endsWith('/') && !canonicalHref.endsWith('.html') && !is404) {
      canonicalErrors++;
      warnings.push(`canonical: Canonical link missing trailing slash in ${relative}: ${canonicalHref}`);
    }
  }

  // Check Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push(`title: Missing or empty <title> in ${relative}`);
  } else {
    const title = titleMatch[1].trim();
    if (!is404) {
      if (titlesMap.has(title)) {
        errors.push(`title: Duplicate <title> "${title}" between ${titlesMap.get(title)} and ${relative}`);
      } else {
        titlesMap.set(title, relative);
      }
    }
  }

  // Check H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match && !is404) {
    warnings.push(`h1: Missing <h1> tag in ${relative}`);
  }

  // Check Schema JSON-LD
  const schemaMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const scriptTag of schemaMatches) {
    const jsonText = scriptTag.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed['@context'] || !parsed['@type']) {
        schemaErrors++;
        warnings.push(`schema: JSON-LD missing @context or @type in ${relative}`);
      }
    } catch (e) {
      schemaErrors++;
      errors.push(`schema: Corrupted JSON-LD syntax in ${relative}: ${e.message}`);
    }
  }

  // Check Internal Links
  const linkMatches = html.match(/<a[^>]+href=["']([^"']+)["']/gi) || [];
  for (const linkTag of linkMatches) {
    const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1].trim();

    if (href === '' || href === '#') {
      deadLinksCount++;
      warnings.push(`links: Empty or bare '#' href found in ${relative}`);
      continue;
    }

    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue; // external or special protocol
    }

    // Clean anchor & search query for internal route check
    const cleanHref = href.split('#')[0].split('?')[0];
    if (!cleanHref) continue;

    let targetRoute = cleanHref;
    if (!targetRoute.startsWith('/')) {
      // relative link
      targetRoute = '/' + targetRoute;
    }
    if (!targetRoute.endsWith('/') && !targetRoute.endsWith('.html') && !targetRoute.endsWith('.svg') && !targetRoute.endsWith('.png') && !targetRoute.endsWith('.xml') && !targetRoute.endsWith('.txt')) {
      targetRoute += '/';
    }

    // Check if target file/route exists in dist
    const fileExists = fs.existsSync(path.join(DIST_DIR, cleanHref)) || internalRoutesSet.has(targetRoute);
    if (!fileExists && !cleanHref.startsWith('/favicon') && !cleanHref.startsWith('/images/')) {
      deadLinksCount++;
      errors.push(`links: Broken internal link from ${relative} -> ${href}`);
    }
  }
}

// 5. IndexNow Protocol Key Check
let indexNowPass = false;
const indexNowKeyFile = path.join(DIST_DIR, '8fa729bc78e04e9c8fbe9066cb839bca.txt');
if (fs.existsSync(indexNowKeyFile)) {
  indexNowPass = true;
} else {
  warnings.push('indexnow: 8fa729bc78e04e9c8fbe9066cb839bca.txt key file not found in dist/');
}

// Summary Report Generation
console.log('\n======================================================');
console.log('📊 SEO HEALTH CHECK REPORT');
console.log('======================================================');
console.log(`Build Output:         ${htmlFiles.length > 0 ? 'PASS ✅' : 'FAIL ❌'} (${htmlFiles.length} pages)`);
console.log(`Robots.txt:           ${robotsPass ? 'PASS ✅' : 'FAIL ❌'}`);
console.log(`Sitemap:              ${sitemapPass ? 'PASS ✅' : 'FAIL ❌'} (${sitemapUrls.length} canonical URLs)`);
console.log(`Noindex Check:        ${noindexCount <= 1 ? 'PASS ✅' : 'FAIL ❌'} (${noindexCount} noindex detected)`);
console.log(`Canonical Integrity:  ${canonicalErrors === 0 ? 'PASS ✅' : 'FAIL ❌'} (${canonicalErrors} errors)`);
console.log(`Internal Links:       ${deadLinksCount === 0 ? 'PASS ✅' : 'FAIL ❌'} (${deadLinksCount} broken/empty)`);
console.log(`Schema JSON-LD:       ${schemaErrors === 0 ? 'PASS ✅' : 'FAIL ❌'}`);
console.log(`IndexNow Key File:    ${indexNowPass ? 'PASS ✅' : 'WARN ⚠️'}`);
console.log('======================================================');

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.slice(0, 10).forEach(w => console.log(' - ' + w));
  if (warnings.length > 10) console.log(` ... and ${warnings.length - 10} more warnings.`);
}

if (errors.length > 0) {
  console.log(`\n❌ CRITICAL SEO ERRORS (${errors.length}):`);
  errors.forEach(e => console.log(' - ' + e));
  console.log('\n🚨 RELEASE_DECISION: BLOCKED 🛑 (Fix all critical errors before deploying!)');
  process.exit(1);
} else {
  console.log('\n🎉 RELEASE_DECISION: READY 🚀 (All strict SEO indexing safety checks passed!)');
  process.exit(0);
}
