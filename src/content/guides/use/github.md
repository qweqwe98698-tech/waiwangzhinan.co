---
title: "GitHub 打不开或 Git Clone 慢怎么办？开发者终端加速全攻略"
description: "解决 GitHub 网页样式丢失、图片加载失败、Git 命令行 clone/push 报错拒绝连接与 Release 文件下载加速方案。"
category: "use"
level: "L3"
order: 8
pubDate: "2026-08-17"
quickAnswer: "解决 GitHub 访问慢与克隆报错有两种最有效方案：第一种，在 Clash Verge 中开启「TUN 模式」，系统级虚拟网卡会自动无缝接管终端 Git 流量；第二种，在终端执行 git config 命令为 Git 独立配置本地 HTTP/SOCKS5 代理端口 (127.0.0.1:7897)。"
tags: ["GitHub", "Git加速", "开发者", "TUN模式"]
completedConcept: "GitHub 网页端与终端命令行的全局加速方案"
faq:
  - question: "网页能打开 GitHub，但命令行执行 git clone 却报错「Failed to connect to github.com port 443: Timed out」？"
    answer: "这是因为 Windows 和 Mac 的终端命令行（PowerShell / CMD / Terminal）默认不遵循系统的全局 HTTP 代理设置。必须开启客户端的 TUN 虚拟网卡模式，或者为 Git 命令行单独配置本地代理端口。"
  - question: "如何一键为 Git 配置本地代理？"
    answer: "打开终端运行：git config --global http.proxy http://127.0.0.1:7897 && git config --global https.proxy http://127.0.0.1:7897（注意将 7897 替换为你实际客户端的混合代理端口）。如需取消，将 proxy 后面改为 unset 即可。"
nextSteps:
  - title: "Clash Verge TUN 虚拟网卡模式配置"
    url: "/clients/clash-verge/"
    description: "了解如何一键接管所有终端与开发工具流量。"
  - title: "进入故障排查中枢"
    url: "/fix/"
    description: "如果仍然遇到 DNS 污染或连接超时的深度排查方法。"
---

## 为什么普通代理对 Git 命令行无效？

很多新手开发者经常困惑：“明明我已经在浏览器里能正常打开 github.com 了，为什么在 VS Code 或终端里执行 `git push` 依然报错超时？”

原因在于操作系统架构层面的分工：
- **浏览器与普通应用**：主动读取 Windows / macOS 的系统网络代理设置（注册表 / 系统网络偏好）。
- **底层命令行工具 (Git, Curl, Wget, Pip, Docker)**：为了性能与服务器运行环境一致性，**默认完全忽略系统代理**，直接向公网发起裸连接，从而撞上了网络阻断。

---

## 方案一：开启 TUN 模式（强烈推荐，一劳永逸）

这是目前最优雅的解决方案：
1. 打开 **Clash Verge Rev**。
2. 进入 **「设置」**，点击安装 **Service Mode (服务模式)**。
3. 打开 **「TUN 模式」** 开关。
4. **效果**：系统会新建一个虚拟网卡，终端中的 `git clone`、`npm install`、`pip install`、`cargo build` 将全部被透明加速，无需在每个开发工具里逐一配置代理端口。

---

## 方案二：为 Git 命令行单独配置本地代理

如果你不想开启 TUN 模式，可以直接通过 Git 配置文件指定本地代理通道。

### 开启 Git 代理：
```bash
# 设置 HTTP 代理（Clash Verge 默认端口为 7897）
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

### 取消 Git 代理（如果日后不再需要）：
```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## GitHub Release 资源下载加速
对于 `github.com/releases` 中的大型编译包（如几个 GB 的模型文件或安装包），可直接使用支持多线程下载的工具（如 IDM 或 Aria2），在下载工具内填入 `127.0.0.1:7897` 代理端口，即可跑满你的宽带上限。
