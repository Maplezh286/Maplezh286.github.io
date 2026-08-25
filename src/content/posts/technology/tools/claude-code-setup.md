---
title: 最简单配置 Claude Code + DeepSeek 的方法
description: 在 Windows 与 WSL 中安装 Claude Code，并接入国内 DeepSeek API。
publishedAt: 2026-04-12
updatedAt: 2026-08-25
category: [technology, tools]
tags: [Claude Code, DeepSeek, AI 工具, 教程]
featured: true
legacySlug: claude-code-setup
---

在国内直接使用 Claude 模型，账号、网络和付费都可能比较麻烦。如果你主要想用 Claude Code 的操作方式，不强求背后的模型一定是 Claude，可以把后端换成 DeepSeek。

先说明原理：**Claude Code 是编程工具，DeepSeek 是负责思考和回答的模型。**可以把它们理解成播放器和片源。我们保留 Claude Code 读写文件、运行命令和修改代码的能力，只把默认模型换成 DeepSeek。

这不是“原装 Claude”，但安装简单、国内访问方便，日常写代码完全够用。DeepSeek 已经提供官方的 Anthropic 兼容接口，不需要自己搭建中转服务。

本文以 **Windows + WSL（Ubuntu）** 为例，从零完成配置。

## 一、安装 WSL

以管理员身份打开 PowerShell，输入：

```powershell
wsl --install
```

安装完成后重启电脑。第一次打开 Ubuntu 时，系统会要求设置 Linux 用户名和密码。输入密码时屏幕不会显示字符，这是正常现象。

以后在 PowerShell 中输入下面的命令，就能进入 Ubuntu：

```powershell
wsl
```

如果你已经在使用 WSL，可以直接跳到下一步。

## 二、安装 Node.js 和 Claude Code

在 WSL 中执行：

```bash
sudo apt update
sudo apt install -y nodejs npm
```

检查版本：

```bash
node --version
npm --version
```

Claude Code 要求 Node.js 18 或更高版本。如果你的版本低于 18，请先升级 Node.js。

然后安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

检查是否安装成功：

```bash
claude --version
```

能看到版本号，就说明 Claude Code 已经装好了。

## 三、获取 DeepSeek API Key

打开 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册并登录账号，然后进入 [API Keys](https://platform.deepseek.com/api_keys) 创建一个新的密钥。

API Key 通常以 `sk-` 开头。它相当于你的支付密码，拿到以后请注意三件事：

1. 不要发给别人；
2. 不要写进公开仓库；
3. 不要出现在截图里。

DeepSeek 网页版和 API 是两套计费方式。使用 Claude Code 消耗的是 API 余额，需要在开放平台单独充值。

## 四、让 Claude Code 使用 DeepSeek

Claude Code 的个人配置文件位于：

```text
~/.claude/settings.json
```

先创建目录和配置文件：

```bash
mkdir -p ~/.claude
nano ~/.claude/settings.json
```

把下面的内容完整复制进去，并将 `你的 DeepSeek API Key` 替换成刚才创建的密钥：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的 DeepSeek API Key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "786432"
  }
}
```

在 Nano 中按 `Ctrl + O` 保存，按回车确认，再按 `Ctrl + X` 退出。

这里最容易写错的是 API 地址。Claude Code 使用的是 Anthropic 格式，所以地址必须是：

```text
https://api.deepseek.com/anthropic
```

不要写成普通 OpenAI 格式的 `https://api.deepseek.com`。

## 五、启动 Claude Code

先进入你的项目目录。例如：

```bash
cd /mnt/c/Users/你的用户名/Desktop/你的项目
```

然后启动：

```bash
claude
```

输入一句简单的话测试。如果它能正常回答，并且可以读取当前项目，就说明配置成功了。

你使用的仍然是 Claude Code 界面，但真正处理请求的是 DeepSeek。部分界面可能继续显示 Claude 的模型名称，这是兼容层的模型映射，不代表请求仍在调用 Claude。

## 模型怎么选？

- `deepseek-v4-pro[1m]`：能力更强，适合复杂项目和长上下文；
- `deepseek-v4-flash`：速度更快、价格更低，适合简单修改和子任务。

上面的配置让主任务使用 Pro，简单任务和子任务使用 Flash，比较省心。如果你更在意费用，也可以把所有模型都改成 `deepseek-v4-flash`。

旧教程中常见的 `deepseek-chat` 和 `deepseek-reasoner` 已经停用，不要再使用。

## 常见问题

### 出现 401 或认证失败

先检查 API Key 是否复制完整，以及 DeepSeek API 账户是否还有余额。

### 出现 404 或无法连接

检查 `ANTHROPIC_BASE_URL`，末尾必须包含 `/anthropic`。

### 提示模型不存在

检查模型名是否为 `deepseek-v4-pro[1m]` 或 `deepseek-v4-flash`，不要照抄旧教程里的模型名。

### 输入 `claude` 后提示找不到命令

关闭并重新打开 WSL，再运行 `claude --version`。如果仍然找不到，检查 npm 的全局安装目录是否已经加入 `PATH`。

## 使用前需要知道

DeepSeek 接入 Claude Code 后，读写代码、运行命令和调用常用工具都没有问题，但它和原版 Claude 仍然不是同一个模型。回答风格、代码能力和部分多模态功能会有差异。

另外，API 按 Token 计费。让模型读取大型仓库、反复执行任务或使用网页搜索，都会增加消耗。建议先从小项目开始，并在 DeepSeek 开放平台设置合理的余额。

到这里就配置完成了。核心只有三件事：**装好 Claude Code、准备 DeepSeek API Key、填对 API 地址和模型名。**其余配置出问题时，先检查这三处。

## 参考资料

- [DeepSeek 官方：接入 Claude Code](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code/)
- [DeepSeek 官方：Anthropic API 兼容说明](https://api-docs.deepseek.com/zh-cn/guides/anthropic_api)
- [DeepSeek 官方：模型与价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)
