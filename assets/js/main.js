// ==================== 博客主逻辑 ====================

// 文章数据
let postsData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadPosts();
});

// ==================== 导航功能 ====================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// ==================== 加载文章列表 ====================
async function loadPosts() {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;

    try {
        postsList.innerHTML = '<div class="loading">正在加载文章...</div>';

        // 从 JSON 文件加载文章数据
        const response = await fetch('data/posts.json');
        if (!response.ok) {
            throw new Error('无法加载文章数据');
        }

        postsData = await response.json();
        renderPostsList(postsData);
    } catch (error) {
        console.error('加载文章失败:', error);
        postsList.innerHTML = '<div class="error">加载文章失败，请稍后重试</div>';
    }
}

// ==================== 渲染文章列表 ====================
function renderPostsList(posts) {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;

    if (posts.length === 0) {
        postsList.innerHTML = '<div class="loading">暂无文章</div>';
        return;
    }

    // 按日期排序（最新的在前）
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const html = sortedPosts.map(post => `
        <article class="post-card">
            <h3>
                <a href="posts/${post.id}.html">${escapeHtml(post.title)}</a>
            </h3>
            <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="post-meta">
                <span>${formatDate(post.date)}</span>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');

    postsList.innerHTML = html;
}

// ==================== 加载单篇文章 ====================
async function loadSinglePost() {
    const postContent = document.getElementById('post-content');
    const postTitle = document.getElementById('post-title');
    const postDate = document.getElementById('post-date');
    const postTags = document.getElementById('post-tags');

    if (!postContent) return;

    // 从 URL 获取文章 ID
    const path = window.location.pathname;
    const postId = path.split('/').pop().replace('.html', '');

    try {
        postContent.innerHTML = '<div class="loading">正在加载文章内容...</div>';

        // 加载文章数据
        const response = await fetch('../data/posts.json');
        if (!response.ok) {
            throw new Error('无法加载文章数据');
        }

        const posts = await response.json();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            throw new Error('文章不存在');
        }

        // 更新页面标题
        document.title = `${post.title} - 我的博客`;

        // 更新文章头部信息
        if (postTitle) postTitle.textContent = post.title;
        if (postDate) postDate.textContent = formatDate(post.date);
        if (postTags) {
            postTags.innerHTML = post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
        }

        // 加载并渲染 Markdown 内容
        await renderMarkdownContent(post.content);

    } catch (error) {
        console.error('加载文章失败:', error);
        postContent.innerHTML = `<div class="error">加载文章失败: ${error.message}</div>`;
    }
}

// ==================== 渲染 Markdown 内容 ====================
async function renderMarkdownContent(contentPath) {
    const postContent = document.getElementById('post-content');
    if (!postContent) return;

    try {
        // 加载 Markdown 文件
        const response = await fetch(contentPath);
        if (!response.ok) {
            throw new Error('无法加载文章内容');
        }

        const markdown = await response.text();

        // 使用 marked 解析 Markdown
        if (typeof marked !== 'undefined') {
            postContent.innerHTML = marked.parse(markdown);

            // 应用代码高亮
            if (typeof hljs !== 'undefined') {
                postContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        } else {
            postContent.innerHTML = `<pre>${escapeHtml(markdown)}</pre>`;
        }
    } catch (error) {
        console.error('渲染内容失败:', error);
        postContent.innerHTML = `<div class="error">渲染内容失败: ${error.message}</div>`;
    }
}

// ==================== 工具函数 ====================

// 转义 HTML 特殊字符
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 如果当前页面是文章详情页，加载单篇文章
if (window.location.pathname.includes('/posts/')) {
    document.addEventListener('DOMContentLoaded', loadSinglePost);
}