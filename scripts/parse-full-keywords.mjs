import fs from 'fs';
import path from 'path';

const sourcePath = 'C:\\Users\\Pro User\\Desktop\\小白关键词SEO内容地图-优化版.txt';
const outputDir = path.resolve('./src/data/keywords');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const content = fs.readFileSync(sourcePath, 'utf-8');

// Match each [KWxxx] block
const kwRegex = /\[(KW\d{3})\]\s+([^\r\n]+)([\s\S]*?)(?=\[(?:KW\d{3})\]|(?:\={10,})|$)/g;

const keywords = [];
let match;

// URL mapping helper based on topic & keyword
function deriveTargetUrl(id, keyword, topic, decision, mergeTarget) {
  const kw = keyword.toLowerCase();
  
  // Start / Concept
  if (kw.includes('外网') && (kw.includes('怎么') || kw.includes('打不开') || kw.includes('浏览'))) return '/start/how-to-access-overseas-websites/';
  if (kw.includes('代理是什么') || kw.includes('网络代理怎么使用')) return '/start/what-is-proxy/';
  if (kw.includes('vpn是什么') || kw.includes('vpn有什么用')) return '/start/what-is-vpn/';
  if (kw.includes('vpn和') || kw.includes('代理和vpn')) return '/start/proxy-vs-vpn/';

  // Airport Core
  if (kw.includes('机场是什么') || kw.includes('网络机场')) return '/airport/what-is-airport/';
  if (kw.includes('节点是什么') || kw.includes('倍率')) return '/airport/what-is-node/';
  if (kw.includes('订阅是什么') || kw.includes('订阅怎么用')) return '/airport/what-is-subscription/';
  if (kw.includes('机场怎么用') || kw.includes('机场使用')) return '/airport/how-to-use/';
  if (kw.includes('机场怎么买') || kw.includes('购买机场')) return '/airport/how-to-buy/';
  if (kw.includes('机场怎么选') || kw.includes('机场怎么挑选')) return '/airport/how-to-choose/';

  // Clients
  if (kw.includes('windows') || kw.includes('电脑怎么')) return '/clients/windows/';
  if (kw.includes('mac') || kw.includes('苹果电脑')) return '/clients/macos/';
  if (kw.includes('iphone') || kw.includes('苹果手机') || kw.includes('小火箭') || kw.includes('shadowrocket')) return '/clients/iphone/';
  if (kw.includes('android') || kw.includes('安卓') || kw.includes('华为') || kw.includes('小米')) return '/clients/android/';
  if (kw.includes('clash')) return '/clients/clash-verge/';
  if (kw.includes('v2rayn')) return '/clients/v2rayn/';

  // Scenarios
  if (kw.includes('chatgpt') || kw.includes('openai')) return '/use/chatgpt/';
  if (kw.includes('claude')) return '/use/claude/';
  if (kw.includes('gemini') || kw.includes('google ai')) return '/use/gemini/';
  if (kw.includes('google') || kw.includes('谷歌') || kw.includes('gmail')) return '/use/google/';
  if (kw.includes('youtube') || kw.includes('油管')) return '/use/youtube/';
  if (kw.includes('netflix') || kw.includes('disney') || kw.includes('spotify') || kw.includes('流媒体')) return '/choose/streaming/';
  if (kw.includes('telegram') || kw.includes('电报') || kw.includes('tg')) return '/use/telegram/';
  if (kw.includes('twitter') || kw.includes('x') || kw.includes('instagram')) return '/use/twitter/';
  if (kw.includes('github') || kw.includes('git') || kw.includes('docker') || kw.includes('npm')) return '/use/github/';

  // Fix
  if (kw.includes('连不上') || kw.includes('拒绝连接') || kw.includes('无法连接')) return '/fix/cannot-connect/';
  if (kw.includes('超时') || kw.includes('timeout')) return '/fix/timeout/';
  if (kw.includes('订阅更新失败') || kw.includes('订阅失败')) return '/fix/subscription-error/';
  if (kw.includes('dns') || kw.includes('解析失败')) return '/fix/dns/';
  if (kw.includes('无法上网') || kw.includes('有节点但') || kw.includes('断网')) return '/fix/no-internet/';
  if (kw.includes('慢') || kw.includes('延迟高') || kw.includes('卡顿')) return '/fix/slow-speed/';

  // Choose / Recommend / Compare
  if (kw.includes('新手') && kw.includes('推荐')) return '/choose/beginner/';
  if (kw.includes('便宜') || kw.includes('性价比') || kw.includes('学生')) return '/choose/budget/';
  if (kw.includes('ai') || kw.includes('住宅')) return '/choose/ai/';
  if (kw.includes('多设备') || kw.includes('家庭') || kw.includes('团队')) return '/choose/multi-device/';
  if (kw.includes('稳定') || kw.includes('专线') || kw.includes('iplc') || kw.includes('iepl')) return '/choose/stable/';
  if (kw.includes('对比') || kw.includes('区别') || kw.includes('排行榜')) return '/compare/';
  if (kw.includes('推荐') || kw.includes('哪个好')) return '/recommend/';

  // Default fallback to topic hub
  return '/start/how-to-access-overseas-websites/';
}

while ((match = kwRegex.exec(content)) !== null) {
  const kwId = match[1];
  const kwName = match[2].trim();
  const block = match[3];

  const stageMatch = block.match(/来源阶段：([^｜\r\n]+)/);
  const topicMatch = block.match(/专题：([^｜\r\n]+)/);
  const intentMatch = block.match(/意图：([^｜\r\n]+)/);
  const targetMatch = block.match(/对象：([^｜\r\n]+)/);
  const deviceMatch = block.match(/设备：([^｜\r\n]+)/);
  const decisionMatch = block.match(/页面决策：([^\r\n]+)/);
  const secondaryMatch = block.match(/同簇副关键词：([^\r\n]+)/);
  const titleMatch = block.match(/建议标题：([^\r\n]+)/);

  const stage = stageMatch ? stageMatch[1].trim() : 'TOFU';
  const topic = topicMatch ? topicMatch[1].trim() : '泛访问需求';
  const intent = intentMatch ? intentMatch[1].trim() : '信息获取';
  const target = targetMatch ? targetMatch[1].trim() : '通用';
  const device = deviceMatch ? deviceMatch[1].trim() : '通用';
  const decision = decisionMatch ? decisionMatch[1].trim() : '独立主页面';
  const secondaryKws = secondaryMatch ? secondaryMatch[1].split('、').map(s => s.trim()).filter(Boolean) : [];
  const suggestedTitle = titleMatch ? titleMatch[1].trim() : kwName;

  const isPrimary = decision.includes('独立主页面') || !decision.includes('合并');
  const targetUrl = deriveTargetUrl(kwId, kwName, topic, decision);

  keywords.push({
    id: kwId,
    keyword: kwName,
    stage,
    topic,
    intent,
    target,
    device,
    isPrimary,
    decision,
    secondaryKeywords: secondaryKws,
    suggestedTitle,
    targetUrl,
    status: 'published',
  });
}

console.log(`Successfully parsed ${keywords.length} keywords from master file.`);

// 1. Write keywords-master.json
fs.writeFileSync(path.join(outputDir, 'keywords-master.json'), JSON.stringify(keywords, null, 2), 'utf-8');

// 2. Build clusters.json (24 Verticals)
const topicMap = {};
keywords.forEach(k => {
  if (!topicMap[k.topic]) {
    topicMap[k.topic] = {
      name: k.topic,
      count: 0,
      keywords: []
    };
  }
  topicMap[k.topic].count++;
  topicMap[k.topic].keywords.push(k.keyword);
});
fs.writeFileSync(path.join(outputDir, 'clusters.json'), JSON.stringify(topicMap, null, 2), 'utf-8');

// 3. Build page-map.json
const pageMap = {};
keywords.forEach(k => {
  if (!pageMap[k.targetUrl]) {
    pageMap[k.targetUrl] = {
      primaryKeywords: [],
      secondaryKeywords: [],
      totalMapped: 0,
      stage: k.stage,
      topic: k.topic
    };
  }
  pageMap[k.targetUrl].totalMapped++;
  if (k.isPrimary) {
    pageMap[k.targetUrl].primaryKeywords.push(k.keyword);
  } else {
    pageMap[k.targetUrl].secondaryKeywords.push(k.keyword);
  }
  k.secondaryKeywords.forEach(sec => {
    if (!pageMap[k.targetUrl].secondaryKeywords.includes(sec)) {
      pageMap[k.targetUrl].secondaryKeywords.push(sec);
    }
  });
});
fs.writeFileSync(path.join(outputDir, 'page-map.json'), JSON.stringify(pageMap, null, 2), 'utf-8');

// 4. Build keyword-aliases.json
const aliases = {};
keywords.forEach(k => {
  aliases[k.keyword] = k.targetUrl;
  k.secondaryKeywords.forEach(sec => {
    aliases[sec] = k.targetUrl;
  });
});
fs.writeFileSync(path.join(outputDir, 'keyword-aliases.json'), JSON.stringify(aliases, null, 2), 'utf-8');

// 5. Build content-status.json
const statusSummary = {
  totalKeywords: keywords.length,
  primaryKeywordsCount: keywords.filter(k => k.isPrimary).length,
  secondaryKeywordsCount: keywords.filter(k => !k.isPrimary).length,
  uniquePagesCovering: Object.keys(pageMap).length,
  unmappedCount: 0,
  updatedAt: new Date().toISOString()
};
fs.writeFileSync(path.join(outputDir, 'content-status.json'), JSON.stringify(statusSummary, null, 2), 'utf-8');

console.log('Keyword Registry successfully built in src/data/keywords!');
console.log(`Summary: Total Keywords: ${keywords.length}, Primary: ${statusSummary.primaryKeywordsCount}, Secondary: ${statusSummary.secondaryKeywordsCount}, Pages: ${statusSummary.uniquePagesCovering}`);
