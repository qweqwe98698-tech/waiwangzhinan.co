import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/start/scientific-surfing-guide/index.astro',
  'src/pages/start/protocols-explained/index.astro',
  'src/pages/start/iplc-vs-iepl-transit/index.astro',
  'src/pages/airport/node-multiplier/index.astro',
  'src/pages/airport/subscription-security/index.astro',
  'src/pages/airport/free-vs-paid/index.astro',
  'src/pages/clients/macos-guide/index.astro',
  'src/pages/clients/android-guide/index.astro',
  'src/pages/clients/tun-mode-guide/index.astro',
  'src/pages/clients/subscription-convert/index.astro',
  'src/pages/use/midjourney/index.astro',
  'src/pages/use/tiktok/index.astro',
  'src/pages/use/netflix/index.astro',
  'src/pages/use/steam-gaming/index.astro',
  'src/pages/use/cross-border-ecommerce/index.astro',
  'src/pages/fix/domestic-slow-bypass/index.astro',
  'src/pages/fix/chatgpt-blocked-solution/index.astro',
  'src/pages/fix/port-conflict-solution/index.astro',
  'src/pages/choose/gaming/index.astro',
  'src/pages/choose/avoid-scams/index.astro',
];

for (const relPath of files) {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    content = content.replace("import ArticleLayout from '../../layouts/ArticleLayout.astro';", "import ArticleLayout from '../../../layouts/ArticleLayout.astro';");
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Updated import path in ${relPath}`);
  }
}

console.log('Done fixing layout import paths!');
