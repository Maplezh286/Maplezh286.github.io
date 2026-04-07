# 我的个人博客

这是一个使用纯静态技术（HTML、CSS、JavaScript）构建的个人博客，部署在 GitHub Pages 上。

## 预览

访问 [https://Maplezh286.github.io](https://Maplezh286.github.io) 查看博客（请将 `Maple-yi-z` 替换为你的 GitHub 用户名）

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

## 如何添加新文章

1. **创建文章 HTML 文件**：复制 `posts/post-template.html`，重命名为 `posts/your-article-id.html`

2. **编辑文章内容**：在文件中修改以下内容：
   - `<title>` - 页面标题
   - `<meta name="description">` - 页面描述
   - `post-title` - 文章标题
   - `post-date` - 发布日期
   - `post-tags` - 文章标签
   - `post-content` - 文章正文内容

3. **更新文章列表**：编辑 `data/posts.json`，添加新文章信息：

```json
{
    "id": "your-article-id",
    "title": "文章标题",
    "date": "2024-01-01",
    "excerpt": "文章摘要",
    "tags": ["标签1", "标签2"],
    "content": "content/your-article.md"
}
```

4. **提交更改**：将修改提交到 GitHub 仓库，GitHub Pages 会自动重新部署

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
   - 创建新仓库，命名为 `Maplezh286.github.io`（将 `Maple-yi-z` 替换为你的 GitHub 用户名）

2. **推送代码**：

```bash
# 初始化仓库
cd my-blog
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/Maple-yi-z/Maplezh286.github.io.git

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
