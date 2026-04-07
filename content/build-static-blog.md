## 为什么选择静态博客？

静态博客有很多优点：

- **速度快** - 无需数据库查询，直接加载 HTML
- **成本低** - GitHub Pages 免费托管
- **安全性高** - 没有后端，减少攻击面
- **易于维护** - 只需管理静态文件

## 技术栈选择

我们使用以下技术：

- **HTML5** - 页面结构
- **CSS3** - 样式和响应式布局
- **JavaScript** - 交互逻辑
- **Markdown** - 文章内容格式
- **GitHub Pages** - 免费部署平台

## 项目结构

```bash
my-blog/
├── index.html              # 首页
├── about.html              # 关于页面
├── posts/                  # 文章页面
│   ├── post-template.html  # 文章详情模板
│   └── hello-world.html    # 示例文章
├── assets/
│   ├── css/
│   │   └── style.css       # 主样式
│   ├── js/
│   │   └── main.js         # 主逻辑
│   └── images/             # 图片资源
└── data/
    └── posts.json          # 文章元数据
```

## 核心功能实现

### 1. 文章列表渲染

从 JSON 文件加载文章数据，动态生成文章列表：

```javascript
async function loadPosts() {
    const response = await fetch('data/posts.json');
    const posts = await response.json();
    renderPostsList(posts);
}
```

### 2. Markdown 渲染

使用 marked.js 库解析 Markdown 内容：

```javascript
function renderMarkdown(markdown) {
    return marked.parse(markdown);
}
```

### 3. 代码高亮

使用 highlight.js 实现代码高亮：

```javascript
document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
});
```

## 部署到 GitHub Pages

1. 创建 GitHub 仓库，命名为 `username.github.io`
2. 将代码推送到仓库
3. 在仓库设置中启用 GitHub Pages
4. 访问 `https://username.github.io` 即可

## 总结

静态博客是一个简单但强大的方案，适合个人博客、文档站点等场景。通过本文介绍的技术，你可以快速搭建自己的博客网站。

如果你有任何问题，欢迎在评论区留言讨论！
