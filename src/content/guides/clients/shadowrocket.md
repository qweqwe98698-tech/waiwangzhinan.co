---
title: "Shadowrocket (小火箭) 是什么？功能与配置全攻略"
description: "iOS 苹果平台老牌代理工具 Shadowrocket 详解：全局路由、配置规则、证书信任、按需连接与常见问题解答。"
category: "clients"
level: "L3"
order: 6
pubDate: "2026-08-17"
quickAnswer: "Shadowrocket（中文通称「小火箭」）是 iOS 平台上历史最悠久、装机量最大的网络规则代理工具。它支持 Shadowsocks、Vmess、Trojan、Hysteria2 等几乎所有主流协议，支持扫码导入、HTTPS 解密重写与精细化分流。"
tags: ["Shadowrocket", "小火箭", "iOS工具", "客户端"]
completedConcept: "Shadowrocket 的功能体系与规则管理"
faq:
  - question: "小火箭界面底部的「全局路由」该选哪个？"
    answer: "强烈建议选择「配置 (Config)」。选「配置」代表智能规则模式，国内 App（微信/抖音/美团）直连，海外受限网站走代理；选「代理 (Proxy)」代表全局代理；选「直连 (Direct)」代表不走任何节点。"
  - question: "节点列表怎么一次性全部测速？"
    answer: "在小火箭首页节点列表中，点击上方文字「连通性测试 (Connectivity Test)」，所有节点会立即并发测试延迟，并在右侧显示具体毫秒数（绿色为优秀，黄色为正常，红色或 Timeout 为超时）。"
nextSteps:
  - title: "iPhone (iOS) 下载小火箭教程"
    url: "/clients/iphone/"
    description: "如何通过美区 Apple ID 获取正版小火箭应用。"
  - title: "节点全部超时排查"
    url: "/fix/timeout/"
    description: "如果小火箭所有节点都变红超时的解决方法。"
---

## Shadowrocket 的核心优势

1. **协议兼容性极强**：几乎涵盖了近十年间出现的所有网络代理协议。
2. **操作逻辑极简**：支持直接使用手机摄像头扫描机场后台二维码导入，对小白非常友好。
3. **丰富的分流规则与重写**：支持通过导入第三方远程规则集（如 ACL4SSR 或 Hackl0us 规则），实现广告拦截与多地区智能分流。
4. **低功耗运行**：得益于 iOS 系统的 NetworkExtension 框架优化，开启一整天电量消耗通常仅在 2%-4% 左右。

---

## 常用四大实用技巧

### 1. 订阅定时自动更新
点击底部 **「设置 (Settings)」** → **「订阅 (Subscribe)」**：
- 开启 **「打开时更新」**；
- 开启 **「自动后台更新」**。
这样每次打开小火箭，它都会自动帮你同步机场最新的可用节点。

### 2. 节点连通性测试（批量测速）
点击节点列表上方的“连通性测试”标题，小火箭会并发向测试服务器发送请求，自动将无法连接的废弃节点标注为 Timeout，方便你一眼挑出最快节点。

### 3. 全局路由模式说明
- **配置 (Config)**：默认推荐，根据规则列表自动分流。
- **代理 (Proxy)**：强制所有流量（包括国内应用）走当前选中的节点。
- **直连 (Direct)**：所有流量不走代理，用于临时排查网络。
- **场景 (Scene)**：根据连接的 Wi-Fi 名称或蜂窝网络自动切换路由策略。
