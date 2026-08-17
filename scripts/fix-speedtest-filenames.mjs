import fs from 'fs';
import path from 'path';

const speedtestsDir = path.resolve('./public/images/speedtests');
const providersDir = path.resolve('./src/data/providers');

const brandMap = {
  'guangsu': '光速云-节点测速实测.png',
  'xingdaomeng': '星岛梦-节点测速实测.png',
  'lingmao': '灵猫网络-节点测速实测.png',
  'feimao': '飞猫云-节点测速实测.png',
  'weitu': '唯兔云-节点测速实测.png',
  'yuzhou': '宇宙云-节点测速实测.png',
  'u1s1': 'U1S1-节点测速实测.png',
  'jilian': '极连云-节点测速实测.png',
  'guangnianti': '光年梯-节点测速实测.png',
  'yifanyun': '一翻云-节点测速实测.png',
  'ermaoyun': '二猫云-节点测速实测.png',
  'sogoyun': 'SOGO云-节点测速实测.png',
  'kexinyun': '可信云-节点测速实测.png',
  'sujie': '速界-节点测速实测.png',
  'kuaili': '快狸-节点测速实测.png',
  'quanqiuyun': '全球云-节点测速实测.png',
};

for (const [slug, srcFile] of Object.entries(brandMap)) {
  const srcPath = path.join(speedtestsDir, srcFile);
  const destAsciiFile = `${slug}-speedtest.png`;
  const destPath = path.join(speedtestsDir, destAsciiFile);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcFile} -> ${destAsciiFile}`);
  }

  // Update provider json
  const providerFile = path.join(providersDir, `${slug}.json`);
  if (fs.existsSync(providerFile)) {
    const data = JSON.parse(fs.readFileSync(providerFile, 'utf-8'));
    data.speedtestImage = `/images/speedtests/${destAsciiFile}`;
    fs.writeFileSync(providerFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Updated ${slug}.json to use ${data.speedtestImage}`);
  }
}

console.log('Successfully configured ASCII speedtest image assets!');
