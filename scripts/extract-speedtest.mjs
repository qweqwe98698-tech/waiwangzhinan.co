import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const zipPath = 'C:\\Users\\Pro User\\Desktop\\博客第二阶段\\16个机场测速实测资料包_2026-08-11_发布整理版_V2.zip';
const targetDir = path.resolve('./public/images/speedtests');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Extracting zip archive to:', targetDir);
execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`);

console.log('Extraction complete! Files in destination:');
const files = fs.readdirSync(targetDir);
console.log(files);
