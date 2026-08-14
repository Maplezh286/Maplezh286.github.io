# Maple Blog

使用 Astro 构建的个人博客，内容以 Markdown 保存，并在构建时生成完整静态 HTML。

## 内容结构

文章按真实目录分级存放：

```text
src/content/posts/
├── technology/
│   ├── development/
│   ├── fundamentals/
│   └── tools/
├── learning/
│   └── methods/
└── life/
    └── thinking/
```

目录会自动变成文章 URL 和分类导航。例如：

```text
src/content/posts/technology/tools/claude-code-setup.md
→ /posts/technology/tools/claude-code-setup/
```

每篇文章需要以下 frontmatter：

```yaml
---
title: 文章标题
description: 一句话摘要
publishedAt: 2026-08-14
category: [technology, tools]
tags: [AI, 工具]
featured: false
draft: false
---
```

新增分类时，同时在 `src/lib/blog.ts` 的 `CATEGORY_META` 中补充中文名称和简介。

也可以使用命令创建文章。脚本默认标记为草稿，并且绝不会覆盖同名文件：

```bash
npm run new-post -- technology/tools terminal-guide "终端工具指南"
```

## 本地开发

需要 Node.js 22 或更高版本：

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

生成结果位于 `dist/`。

## 发布

推送到 `main` 后，GitHub Actions 会构建并发布到 GitHub Pages。仓库 Pages 的 Source 需要设置为 **GitHub Actions**。
