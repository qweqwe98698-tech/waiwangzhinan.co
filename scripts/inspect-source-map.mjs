import fs from 'fs';
import path from 'path';

const sourcePath = 'C:\\Users\\Pro User\\Desktop\\小白关键词SEO内容地图-优化版.txt';

if (!fs.existsSync(sourcePath)) {
  console.error(`Source file not found at ${sourcePath}`);
  process.exit(1);
}

const content = fs.readFileSync(sourcePath, 'utf-8');
const lines = content.split('\n');

console.log(`Read ${lines.length} lines from source map.`);

// Let's preview the first 100 lines to inspect structure
console.log(lines.slice(0, 100).join('\n'));
