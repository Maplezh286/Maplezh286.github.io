# 我的个人博客

一个使用纯静态技术（HTML、CSS、JavaScript）构建的个人博客，部署在 GitHub Pages 上。

## 预览

访问 [https://Maplezh286.github.io](https://Maplezh286.github.io) 查看博客

## 功能特点

- 响应式设计，适配移动端和桌面端
- 深色/浅色主题切换
- 侧边栏导航与目录
- Markdown 文章支持
- 代码高亮显示
- 图片灯箱效果
- 无需后端，纯静态部署

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 + CSS3 + JavaScript | 前端基础 |
| [marked.js](https://marked.js.org/) | Markdown 解析 |
| [highlight.js](https://highlightjs.org/) | 代码高亮 |
| [Glightbox](https://biati-digital.github.io/glightbox/) | 图片灯箱 |
| GitHub Pages | 静态托管 |

## 项目结构

```
my-blog/
├── index.html              # 首页
├── about.html              # 关于页面
├── publish.py              # 文章发布工具
├── README.md               # 项目说明
├── content/                # Markdown 文章源文件
│   ├── ai-learning-tips.md
│   ├── markdown-guide.md
│   ├── 最简单配置ClaudeCode方法.md
│   └── 软件开发经验汇总.md
├── posts/                  # 文章 HTML 页面
│   ├── post-template.html  # 文章模板
│   ├── ai-learning-tips.html
│   ├── markdown-guide.html
│   ├── claude-code-setup.html
│   └── software-dev-experience.html
├── assets/
│   ├── css/
│   │   └── style.css       # 主样式文件
│   ├── js/
│   │   └── main.js         # 主逻辑文件
│   └── images/             # 图片资源
└── data/
    └── posts.json          # 文章元数据索引
```

## 快速开始

### 本地预览

由于使用了 `fetch` 加载本地文件，直接打开 HTML 会有 CORS 问题。推荐使用本地服务器：

```bash
# Python 3
python -m http.server 8000

# 然后访问 http://localhost:8000
```

### 发布新文章

使用 `publish.py` 工具快速创建文章：

```bash
python publish.py <文章ID> <文章标题> [分类] [标签...]

# 示例
python publish.py my-article "我的新文章" 技术/教程 Python 爬虫
```

该命令会：
1. 在 `content/` 创建 Markdown 文件
2. 在 `posts/` 创建 HTML 页面
3. 更新 `data/posts.json` 索引

### 手动添加文章

1. 在 `content/` 创建 Markdown 文件
2. 复制 `posts/post-template.html` 到 `posts/your-id.html`
3. 更新 `data/posts.json`：

```json
{
  "id": "your-article-id",
  "title": "文章标题",
  "category": "分类/子分类",
  "date": "2026-04-14",
  "excerpt": "文章摘要",
  "tags": ["标签1", "标签2"],
  "content": "../content/your-article.md"
}
```

## 部署到 GitHub Pages

1. 创建仓库 `username.github.io`
2. 推送代码：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/username.github.io.git
git push -u origin main
```

3. 在仓库 Settings → Pages 启用 GitHub Pages

## 自定义配置

### 主题颜色

编辑 `assets/css/style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #2563eb;    /* 主色调 */
    --text-color: #1f2937;       /* 文字颜色 */
    --bg-color: #ffffff;         /* 背景颜色 */
}
```

### 博客信息

修改各 HTML 文件中的：
- `<title>` 标签
- `<meta name="description">`
- `.logo` 链接文字
- `.hero` 区域内容

## 架构设计

本项目采用**手动静态站点生成**模式：

### 内容管理

每篇文章存在两个位置：
- `/content/` - Markdown 源文件（编辑用）
- `/posts/` - HTML 页面（部署用）

### 数据流

```
posts.json (索引) → main.js 加载 → 渲染导航和文章列表
content/*.md → marked.js 解析 → 显示在 HTML 页面
```

### 设计参考

参考 [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) 主题设计，实现：
- 固定顶部导航
- 可折叠侧边栏
- 深色/浅色主题
- 移动端抽屉菜单
- 代码复制按钮

## 浏览器兼容性

- Chrome / Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器

## License

MIT License
