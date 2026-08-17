---
title: "Telegram 国内怎么使用？电报收不到验证码与代理设置"
description: "国内使用 Telegram (电报) 完整攻略：+86 手机号收不到验证码短信解决方法、客户端内置 MTProto / SOCKS5 代理设置与防封安全。"
category: "use"
level: "L3"
order: 6
pubDate: "2026-08-17"
quickAnswer: "使用 Telegram 既可以通过系统代理直接联网，也可以在 Telegram 软件内置的「数据与存储 → 代理设置」中直接填入本地 SOCKS5 代理 (127.0.0.1:7897)。国内 +86 手机号如果收不到短信，建议在已登录设备上接收验证码或使用海外虚拟号码（如 Google Voice）。"
tags: ["Telegram", "电报", "TG", "即时通讯"]
completedConcept: "Telegram 的代理连接机制与验证码接收应对方案"
faq:
  - question: "开启代理后 Telegram 电脑版依然显示「Connecting... / 正在连接」？"
    answer: "这是因为 Telegram 默认未走 Windows 系统代理。打开 Telegram 设置 → 高级 (Advanced) → 连接类型 (Connection type) → 选择「使用自定义代理」→ 添加 SOCKS5 代理，主机填 127.0.0.1，端口填你的客户端混合代理端口（Clash 默认为 7897 或 7890）即可秒连。"
  - question: "+86 手机号注册的 Telegram 会被私聊限制 (+86 Spam) 吗？"
    answer: "是的。为了防止垃圾广告，Telegram 官方默认限制 +86 账号主动私聊陌生人。可在 Telegram 搜索官方机器人 @SpamBot，发送申请并在提示中选择解除限制，通常在 24 小时内即可恢复正常私聊功能。"
nextSteps:
  - title: "X (Twitter) 与社交媒体访问"
    url: "/use/twitter/"
    description: "了解推特与海外社交媒体的顺畅加载技巧。"
  - title: "多设备客户端与机场选型"
    url: "/choose/multi-device/"
    description: "让手机与电脑同时稳定保持 Telegram 在线。"
---

## Telegram 的两种代理连接模式

### 方式 A：随系统代理智能分流（推荐）
在电脑开启 Clash Verge 或手机开启小火箭后，只要客户端处于“规则模式”，Telegram 产生的所有数据流量都会自动被识别并由海外节点转发。

### 方式 B：Telegram 内置应用级代理
如果你只想让 Telegram 单独走代理，而不想开启整台电脑的系统代理：
1. 打开 Telegram 设置 → **数据与存储 (Data and Storage)** → **代理设置 (Proxy Settings)**。
2. 点击 **添加代理 (Add Proxy)**。
3. 选择 **SOCKS5**。
4. 服务器：`127.0.0.1`，端口：`7897`（根据你的 Clash 本地端口设置）。
5. 开启“为通话使用代理 (Use proxy for calls)”。

---

## 接收短信验证码的避坑要点

1. **官方手机 App 接收**：如果是第一次在电脑端登录，请确保手机上的 Telegram App 处于打开状态，官方会优先将 5 位验证码直接发送到手机 App 的“系统通知对话”中，而不是发送手机短信。
2. **避免短时间内重复频繁点击发送短信**：这会导致手机号被 Telegram 服务端临时风控 24 小时 (Too Many Attempts)。
3. **开启二步验证密码 (Two-Step Verification)**：强烈建议在 Telegram 设置 → 隐私与安全中设置本地独立密码，防止 SIM 卡被补卡盗号。
