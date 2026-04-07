# 我的个人博客

这是一个使用纯静态技术（HTML、CSS、JavaScript）构建的个人博客，部署在 GitHub Pages 上。

## 预览

访问 [https://Maplezh286.github.io](https://Maplezh286.github.io) 查看博客（请将 `Maplezh286` 替换为你的 GitHub 用户名）

## 功能特点

- ✅ 响应式设计，适配移动端和桌面端
- ✅ 文章列表展示
- ✅ 代码高亮显示
- ✅ 简洁美观的界面
- ✅ 无需后端，纯静态部署
- ✅ 免费托管在 GitHub Pages

## 项目结构

```
my-blog/
├── index.html              # 首页
├── about.html              # 关于页面
├── README.md               # 项目说明
├── content/                # Markdown 文章内容
│   ├── hello-world.md
│   ├── build-static-blog.md
│   └── markdown-guide.md
├── posts/                  # 文章页面
│   ├── hello-world.html    # 示例文章1
│   ├── build-static-blog.html  # 示例文章2
│   ├── markdown-guide.html # 示例文章3
│   └── post-template.html  # 文章模板
├── assets/
│   ├── css/
│   │   └── style.css       # 主样式文件
│   ├── js/
│   │   └── main.js         # 主逻辑文件
│   └── images/             # 图片资源
└── data/
    └── posts.json          # 文章元数据
```

## 参考设计学习

本项目参考了 [咸鱼暄的代码空间](https://xuan-insr.github.io/) (MkDocs Material 主题) 的设计思路，学习记录如下：

### 1. 整体布局架构

**参考网站的布局结构：**
```
┌─────────────────────────────────────────────────────────────┐
│  Header (固定顶部)                                           │
│  - Logo                                                      │
│  - 搜索按钮                                                   │
│  - 主题切换                                                   │
│  - GitHub 链接                                                │
├─────────────────────────────────────────────────────────────┤
│  Sidebar (Primary)   │  Content Area                         │
│  - 导航菜单           │  - 面包屑导航                         │
│  - 可折叠分类         │  - 文章标题                           │
│  - 文章链接           │  - 文章内容                           │
│                      │  - 编辑/查看源码链接                   │
├──────────────────────┤                                      │
│  Sidebar (Secondary) │  - 上一篇/下一篇导航                   │
│  - 目录大纲 (TOC)     │                                      │
│  - 跟随滚动高亮       │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

**关键设计点：**
- 双栏布局：Primary Sidebar (导航) + Content (内容)
- 可选的 Secondary Sidebar (目录 TOC)
- 所有侧边栏都可以独立滚动
- 移动端使用 Drawer (抽屉) 模式收起侧边栏

### 2. 导航栏 (Header) 设计

**实现特点：**
- **固定定位**：`position: fixed` 始终保持在视口顶部
- **层级管理**：`z-index` 确保在最上层
- **毛玻璃效果**：`backdrop-filter: blur(10px)` 实现模糊背景
- **响应式布局**：
  - 桌面端：水平排列所有元素
  - 移动端：汉堡菜单收起导航

**交互元素：**
- Logo 链接到首页
- 搜索按钮触发搜索框
- 主题切换（浅色/深色模式）
- 可选的 GitHub 仓库链接

### 3. 侧边栏 (Sidebar) 设计

**Primary Sidebar - 主导航：**
```html
<div class="md-sidebar md-sidebar--primary">
  <div class="md-sidebar__scrollwrap">  <!-- 可滚动区域 -->
    <div class="md-sidebar__inner">
      <nav class="md-nav md-nav--primary">
        <!-- 树形导航结构 -->
      </nav>
    </div>
  </div>
</div>
```

**关键 CSS 技巧：**
```css
.md-sidebar {
  width: 240px;              /* 固定宽度 */
  flex-shrink: 0;            /* 不收缩 */
}

.md-sidebar__scrollwrap {
  overflow-y: auto;          /* 独立滚动 */
  max-height: 100vh;         /* 限制最大高度 */
}
```

**树形导航结构：**
- 使用 `<ul>` `<li>` 嵌套构建层级
- Checkbox hack 实现无 JavaScript 展开/收起
  ```html
  <input type="checkbox" id="__nav_1" class="md-toggle" checked>
  <label for="__nav_1">分类名称</label>
  <nav>...</nav>
  ```
- 当前页面高亮：`md-nav__link--active`
- 文章数量徽章

**Secondary Sidebar - 目录 TOC：**
- 仅在文章页面显示
- 提取 H2/H3 标题生成目录
- 跟随滚动自动高亮当前章节

### 4. 内容区域 (Content) 设计

**布局特点：**
- 最大宽度限制（约 800-900px），保证阅读舒适度
- 居中或左对齐（根据布局模式）
- 足够的行高和段落间距

**文章内元素：**
- 标题层级清晰（H1-H6）
- 代码块复制按钮
- 引用块样式
- 表格样式
- 提示框（Admonitions）：info、warning、danger 等

**编辑链接：**
- 直接链接到 GitHub 编辑页面
- 查看源码链接

### 5. 缓存与状态管理

**localStorage 使用：**

参考网站使用封装好的 `__md_get` / `__md_set` 函数管理本地存储：

```javascript
// 存储格式：pathname.key
__md_scope = new URL(".", location)
__md_get = (key, storage = localStorage, scope = __md_scope) => 
  JSON.parse(storage.getItem(scope.pathname + "." + key))
__md_set = (key, value, storage = localStorage, scope = __md_scope) => {
  try {
    storage.setItem(scope.pathname + "." + key, JSON.stringify(value))
  } catch(e) {}
}
```

**缓存内容：**
- 主题偏好（浅色/深色）
- 侧边栏展开/收起状态
- 搜索索引（可选）

**主题切换实现：**
```javascript
// 读取保存的主题
var palette = __md_get("__palette")
if (palette && palette.color) {
  // 应用保存的颜色方案
  document.body.setAttribute("data-md-color-scheme", value)
}

// 切换时保存
localStorage.setItem("data-md-color-scheme", palette.color.scheme)
```

### 6. 移动端适配

**抽屉式侧边栏 (Drawer)：**
```html
<input type="checkbox" id="__drawer" class="md-toggle">
<label class="md-overlay" for="__drawer"></label>
<!-- 侧边栏内容 -->
```

**实现原理：**
- Checkbox hack：使用隐藏的 checkbox 控制显示/隐藏
- 点击汉堡菜单触发 checkbox
- Overlay 遮罩层点击关闭侧边栏
- CSS transform 实现滑动动画

**响应式断点：**
- 桌面端 (> 1220px)：双栏布局，侧边栏始终显示
- 平板端 (768px - 1220px)：可收起侧边栏
- 移动端 (< 768px)：抽屉式侧边栏

### 7. 高级功能详解

#### 7.1 搜索功能

**实现方式：**
- 预构建搜索索引（Web Worker）
- 使用 lunr.js 或自定义分词器
- 搜索建议（Suggest）实时显示
- 搜索结果高亮匹配关键词

**搜索框结构：**
```html
<div class="md-search" data-md-component="search">
  <label class="md-search__overlay" for="__search"></label>
  <div class="md-search__inner">
    <form class="md-search__form">
      <input type="text" class="md-search__input" name="query" placeholder="搜索">
      <div class="md-search__suggest"></div>
    </form>
    <div class="md-search__output">
      <div class="md-search__scrollwrap">
        <!-- 搜索结果 -->
      </div>
    </div>
  </div>
</div>
```

#### 7.2 代码块增强

**复制按钮：**
```html
<button class="md-clipboard" title="复制到剪贴板">
  <span class="md-clipboard__message">复制</span>
</button>
```

**代码注释：**
- 支持行内高亮
- 支持代码块标注（文件名、语言）
- 支持差异对比显示

#### 7.3 图片灯箱 (Lightbox)

**使用 GLightbox：**
```html
<a class="glightbox" href="image.png">
  <img src="image.png">
</a>

<script>
const lightbox = GLightbox({
  touchNavigation: true,
  loop: false,
  zoomable: true,
  draggable: true,
  openEffect: "zoom",
  closeEffect: "zoom",
  slideEffect: "slide"
});
</script>
```

#### 7.4 数学公式支持

**使用 MathJax：**
```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

支持行内公式 `$...$` 和块级公式 `$$...$$`

#### 7.5 评论系统

**使用 Giscus（基于 GitHub Discussions）：**
```html
<script src="https://giscus.app/client.js"
  data-repo="username/discussion"
  data-category="General"
  data-mapping="pathname"
  data-theme="dark"
  crossorigin="anonymous"
  async>
</script>
```

**主题同步：**
```javascript
// 切换主题时同步更新评论主题
var giscus = document.querySelector("script[src*=giscus]")
giscus.setAttribute("data-theme", theme)
```

#### 7.6 提示框 (Admonitions)

**支持类型：**
- `note`, `info` - 信息提示
- `warning`, `caution` - 警告提示
- `danger`, `error` - 危险提示
- `tip`, `hint` - 技巧提示
- `success`, `check` - 成功提示
- `question`, `faq` - 问题提示
- `example` - 示例
- `quote`, `cite` - 引用

**实现方式：**
```html
<div class="admonition info">
  <p class="admonition-title">Info</p>
  <p>提示内容</p>
</div>
```

#### 7.7 时间格式化

**使用 timeago.js：**
```html
<span class="timeago" datetime="2024-01-01T00:00:00+00:00" locale="zh"></span>

<script src="js/timeago.min.js"></script>
<script src="js/timeago_mkdocs_material.js"></script>
```

显示效果："3天前"、"2小时前"

#### 7.8 页脚导航

**上一篇/下一篇导航：**
```html
<footer class="md-footer">
  <nav class="md-footer__inner">
    <a href="prev-page" class="md-footer__link md-footer__link--prev">
      <div class="md-footer__button">
        <svg><!-- 左箭头 --></svg>
      </div>
      <div class="md-footer__title">
        <span class="md-footer__direction">上一页</span>
        <span class="md-ellipsis">上一篇文章标题</span>
      </div>
    </a>
    <a href="next-page" class="md-footer__link md-footer__link--next">
      <!-- 类似结构 -->
    </a>
  </nav>
</footer>
```

#### 7.9 顶部标签导航

**Tabs 导航：**
```html
<nav class="md-tabs">
  <ul class="md-tabs__list">
    <li class="md-tabs__item md-tabs__item--active">
      <a href="." class="md-tabs__link">🏡 主页</a>
    </li>
    <li class="md-tabs__item">
      <a href="cpp/" class="md-tabs__link">C++</a>
    </li>
  </ul>
</nav>
```

### 8. 内容管理方式

**MkDocs 静态站点生成器：**

参考网站使用 MkDocs + Material 主题构建，内容管理方式：

**文件结构：**
```
docs/                       # 文档根目录
├── index.md               # 首页
├── about.md               # 关于页面
├── category/              # 分类文件夹
│   ├── article1.md
│   └── article2.md
├── css/
│   └── extra.css          # 自定义样式
└── js/
    └── extra.js           # 自定义脚本
```

**配置文件 (mkdocs.yml)：**
```yaml
site_name: 网站名称
site_url: https://username.github.io
site_author: 作者名

theme:
  name: material
  features:
    - navigation.tabs        # 顶部导航标签
    - navigation.sections    # 章节导航
    - navigation.expand      # 默认展开
    - toc.follow            # 目录跟随
    - search.suggest        # 搜索建议
    - content.code.copy     # 代码复制按钮

plugins:
  - search                  # 搜索功能
  - minify                  # 压缩

extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/username
```

**内容写作：**
- 使用 Markdown 格式
- YAML Front Matter 添加元数据：
  ```markdown
  ---
  title: 文章标题
  description: 文章描述
  date: 2024-01-01
  tags:
    - 标签1
    - 标签2
  ---
  
  # 正文内容
  ```

**部署方式：**
- GitHub Actions 自动构建
- GitHub Pages 托管
- 推送 markdown 文件后自动重新生成站点

### 9. 性能优化

**资源加载：**
- CSS/JS 文件使用 minify 压缩
- 关键 CSS 内联
- 非关键资源延迟加载

**搜索功能：**
- 预构建搜索索引（Web Worker）
- 客户端搜索，无需后端
- 搜索建议和结果高亮

**图片优化：**
- 懒加载 (lazy loading)
- 响应式图片

### 10. 学到的设计原则

1. **层次清晰**：导航 → 内容 → 辅助信息，层次分明
2. **专注阅读**：内容区域宽度适中，减少视觉疲劳
3. **灵活导航**：多种方式找到内容（侧边栏、搜索、上一篇/下一篇）
4. **状态保持**：记住用户的偏好设置（主题、展开状态）
5. **渐进增强**：基础功能无需 JavaScript，增强功能逐步添加
6. **移动优先**：先设计移动端体验，再扩展到桌面端

### 11. 完整功能清单

参考网站实现的所有功能：

| 功能 | 实现方式 | 优先级 |
|------|----------|--------|
| 固定顶部导航 | CSS `position: fixed` | ⭐⭐⭐ |
| 侧边栏导航 | ul/li + Checkbox Hack | ⭐⭐⭐ |
| 树形展开/收起 | CSS + 少量 JS | ⭐⭐⭐ |
| 目录 TOC | 提取 H2/H3 生成 | ⭐⭐ |
| 搜索功能 | lunr.js / Web Worker | ⭐⭐ |
| 代码复制按钮 | Clipboard API | ⭐⭐ |
| 图片灯箱 | GLightbox | ⭐⭐ |
| 主题切换 | CSS Variables + localStorage | ⭐⭐ |
| 数学公式 | MathJax | ⭐ |
| 评论系统 | Giscus | ⭐ |
| 提示框 | CSS Classes | ⭐⭐ |
| 时间格式化 | timeago.js | ⭐ |
| 上一篇/下一篇 | 页面元数据 | ⭐⭐ |
| 顶部标签导航 | Tabs Component | ⭐ |
| 移动端抽屉菜单 | Checkbox Hack | ⭐⭐⭐ |
| 社交分享 | Clipboard API | ⭐ |

## 个性化建议

基于参考网站的模板，以下是可以赋予自己风格的修改点：

### 1. 配色方案

**参考网站使用：**
- 主色：Cyan (青色)
- 强调色：Cyan
- 深色模式：Slate (石板灰) + Orange (橙色)

**可修改：**
- 选择自己的主色调（如 Indigo、Emerald、Rose、Violet 等）
- 定义深色模式下的配色
- 添加渐变色背景

### 2. 字体选择

**参考网站使用：**
- 正文：Noto Serif SC（思源宋体）
- 代码：Roboto Mono

**可修改：**
- 无衬线字体（更适合屏幕阅读）：Noto Sans SC、Inter、PingFang SC
- 衬线字体（传统风格）：思源宋体、方正书宋
- 代码字体：JetBrains Mono、Fira Code、Cascadia Code

### 3. 布局变体

**参考网站：** 双栏布局（侧边栏 + 内容）

**可尝试：**
- 单栏居中（极简风格）
- 三栏布局（侧边栏 + 内容 + TOC）
- 卡片式布局（像 Pinterest）
- 杂志风格（大标题 + 图文混排）

### 4. 首页设计

**参考网站：** 简洁的介绍 + 最近更新

**可尝试：**
- 大幅 Hero Image + 个人头像
- 文章卡片网格展示
- 时间线式展示
- 标签云 + 热门文章
- 动态打字机效果

### 5. 交互细节

**可添加：**
- 页面滚动进度条
- 回到顶部按钮（带进度圆环）
- 平滑滚动动画
- 微交互动画（按钮悬停、卡片悬停）
- 页面切换过渡效果

### 6. 内容展示

**可创新：**
- 阅读时间估计
- 文章难度标识
- 标签彩色化
- 代码块主题切换
- 引用样式美化（左侧彩色边框）

### 7. 个性化元素

**可添加：**
- 个人头像和简介
- 社交链接图标（GitHub、Twitter、邮箱等）
- 访客统计（不蒜子、Google Analytics）
- 建站时间倒计时
- 赞赏/打赏按钮

### 8. 功能取舍

**建议保留的核心功能：**
- ✅ 响应式布局
- ✅ 侧边栏导航
- ✅ 代码高亮
- ✅ 移动端适配

**可选添加的高级功能：**
- ⭕ 搜索功能（文章多的时候再加）
- ⭕ 评论系统（有互动需求时添加）
- ⭕ 主题切换（喜欢折腾时添加）
- ⭕ 数学公式（技术博客需要时添加）

## 如何添加新文章

1. **创建文章 Markdown 文件**：在 `content/` 目录下创建 `.md` 文件

2. **创建文章 HTML 文件**：复制 `posts/post-template.html`，重命名为 `posts/your-article-id.html`

3. **编辑文章内容**：在文件中修改以下内容：
   - `<title>` - 页面标题
   - `<meta name="description">` - 页面描述
   - `post-title` - 文章标题
   - `post-date` - 发布日期
   - `post-tags` - 文章标签

4. **更新文章列表**：编辑 `data/posts.json`，添加新文章信息：

```json
{
    "id": "your-article-id",
    "title": "文章标题",
    "category": "分类/子分类",
    "date": "2024-01-01",
    "excerpt": "文章摘要",
    "tags": ["标签1", "标签2"],
    "content": "../content/your-article.md"
}
```

5. **提交更改**：将修改提交到 GitHub 仓库，GitHub Pages 会自动重新部署

```bash
git add .
git commit -m "添加新文章：文章标题"
git push origin main
```

## 本地开发

由于使用了 `fetch` 加载本地 JSON 文件，直接在浏览器中打开 HTML 文件可能会遇到 CORS 问题。建议使用以下方式本地预览：

### 使用 Python 简易服务器

```bash
# Python 3
cd my-blog
python -m http.server 8000

# 然后在浏览器访问 http://localhost:8000
```

### 使用 VS Code Live Server 插件

安装 Live Server 插件，右键点击 `index.html` 选择 "Open with Live Server"

## 部署到 GitHub Pages

1. **创建 GitHub 仓库**：
   - 登录 GitHub
   - 创建新仓库，命名为 `Maplezh286.github.io`（将 `Maplezh286` 替换为你的 GitHub 用户名）

2. **推送代码**：

```bash
# 初始化仓库
cd my-blog
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/Maplezh286/Maplezh286.github.io.git

# 推送代码
git push -u origin main
```

3. **启用 GitHub Pages**：
   - 进入仓库 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"，文件夹选择 "/ (root)"
   - 点击 Save

4. **访问博客**：等待几分钟后，访问 `https://Maplezh286.github.io`

## 自定义配置

### 修改博客标题和描述

编辑所有 HTML 文件中的：
- `<title>` 标签
- `<meta name="description">` 标签
- `.logo` 类的链接文字
- `.hero` 部分的标题和描述

### 修改主题颜色

编辑 `assets/css/style.css` 文件顶部的 CSS 变量：

```css
:root {
    --primary-color: #2563eb;    /* 主色调 */
    --text-color: #1f2937;       /* 文字颜色 */
    --bg-color: #ffffff;         /* 背景颜色 */
    /* ... */
}
```

### 添加自定义域名

1. 在 `my-blog` 目录下创建 `CNAME` 文件，内容为你的域名：
```
www.yourdomain.com
```

2. 在你的域名 DNS 设置中添加 CNAME 记录：
   - 主机记录：`www`
   - 记录值：`Maplezh286.github.io`

3. 在 GitHub 仓库 Settings → Pages 中配置自定义域名

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和响应式布局
- **JavaScript** - 交互逻辑
- **marked.js** - Markdown 解析
- **highlight.js** - 代码高亮
- **GitHub Pages** - 静态网站托管

## 浏览器兼容性

- Chrome / Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器

## License

MIT License - 可以自由使用和修改

## 致谢

感谢以下开源项目：
- [marked](https://marked.js.org/) - Markdown 解析器
- [highlight.js](https://highlightjs.org/) - 代码高亮
- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) - 参考设计
