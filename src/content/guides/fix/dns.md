---
title: "DNS 污染与泄漏是什么？如何配置纯净安全 DNS"
description: "详解 DNS 劫持、DNS 污染的底层逻辑，以及如何在 Clash Verge、小火箭与路由器中配置 DoH / Fake-IP 彻底杜绝污染。"
category: "fix"
level: "L5"
order: 4
pubDate: "2026-08-17"
quickAnswer: "DNS 污染是指网络运营商或防火墙在你的设备向根域名服务器查询 IP 时，抢先返回一个虚假或不可达的错误 IP 地址。通过使用支持加密的 DoH (DNS over HTTPS)、DoT 或 Clash 内置的 Fake-IP 虚拟地址池技术，可以 100% 免疫 DNS 污染。"
tags: ["DNS污染", "FakeIP", "DoH", "网络安全"]
completedConcept: "DNS 污染机制与现代客户端防污染配置"
faq:
  - question: "什么是 Clash 的 Fake-IP 模式？"
    answer: "Fake-IP 是现代客户端最推崇的高效模式。当你访问 google.com 时，客户端立刻给你的操作系统返回一个 198.18.0.x 的虚拟保留地址，同时在远端海外节点真正发起对 google.com 的真实解析，既实现了毫秒级秒开，又彻底绕过了本地 DNS 污染。"
  - question: "公共纯净 DNS 填什么比较好？"
    answer: "国内直连推荐阿里云 DNS（223.5.5.5 / 223.6.6.6）或腾讯 DNSPod（119.29.29.29）；海外远端解析推荐 Cloudflare（1.1.1.1）或 Google（8.8.8.8）。"
nextSteps:
  - title: "Clash 有节点但无法上网排查"
    url: "/fix/no-internet/"
    description: "Fake-IP 模式与端口冲突的常见排查。"
  - title: "节点速度慢与延迟优化"
    url: "/fix/slow-speed/"
    description: "进一步提升网络解析与连接吞吐效率。"
---

## 为什么说 DNS 是网络访问的“第一张地图”？

你输入 `google.com` 时，电脑并不知道这个域名在哪，必须向 DNS 服务器询问：“请告诉我 `google.com` 的真实 IP 地址”。

### 污染发生的过程：
1. 你的电脑向本地宽带 DNS 发起普通的明文 UDP 查询。
2. 骨干网拦截机制检测到敏感域名，在真实解析结果返回之前，**抢先伪造一个错误 IP（如 0.0.0.0 或保留 IP）返回给你的电脑**。
3. 你的浏览器试图连接这个假 IP，自然提示“连接失败 / 连接已重置”。

---

## 彻底免疫 DNS 污染的三大武器

### 1. Fake-IP 模式（Clash 标配）
在 Clash Verge Rev 中，默认开启 `enhanced-mode: fake-ip`。
- 本地不进行任何真实 DNS 查询；
- 收到域名请求时立即分配虚拟内网 IP；
- 真实域名字符串随加密隧道直接送到海外节点由海外递归 DNS 解析，从源头消灭污染。

### 2. DNS-over-HTTPS (DoH) / DNS-over-TLS (DoT)
使用标准 TLS 加密传输 DNS 查询请求，中间人无法窥探查询内容，也无法篡改返回结果。
- 阿里 DoH 地址：`https://dns.alidns.com/dns-query`
- 腾讯 DoH 地址：`https://doh.pub/dns-query`
- Cloudflare DoH 地址：`https://cloudflare-dns.com/dns-query`
