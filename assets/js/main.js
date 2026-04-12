/**
 * 博客主逻辑
 * 参考 MkDocs Material 设计实现
 */

// ==================== 配置 ====================
const CONFIG = {
  dataUrl: window.location.pathname.includes('/posts/') ? '../data/posts.json' : 'data/posts.json',
  storagePrefix: 'blog.',
  sidebarStorageKey: 'sidebar.expanded',
  themeStorageKey: 'theme',
};

/**
 * 获取文章链接路径前缀
 * 根据当前页面位置决定是相对路径还是绝对路径
 * @returns {string} 路径前缀
 */
function getPostLinkPrefix() {
  // 如果当前在 /posts/ 目录下，使用相对路径（当前目录）
  // 否则使用 posts/ 子目录
  return window.location.pathname.includes('/posts/') ? '' : 'posts/';
}

// ==================== 状态管理 ====================
let postsData = [];
let categoryTree = {};

// ==================== 主题切换 ====================

/**
 * 初始化主题
 */
function initTheme() {
  // 读取保存的主题或检测系统偏好
  const savedTheme = Storage.get(CONFIG.themeStorageKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  setTheme(theme, false);
}

/**
 * 设置主题
 * @param {string} theme - 'light' 或 'dark'
 * @param {boolean} save - 是否保存到 localStorage
 */
function setTheme(theme, save = true) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // 更新代码高亮主题
  const codeStyles = document.querySelector('link[href*="highlight.js"]');
  if (codeStyles) {
    const newHref = theme === 'dark' 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    codeStyles.href = newHref;
  }
  
  if (save) {
    Storage.set(CONFIG.themeStorageKey, theme);
  }
}

/**
 * 切换主题
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// 导出全局函数
window.toggleTheme = toggleTheme;

// ==================== 本地存储封装 (参考模板实现) ====================
const Storage = {
  /**
   * 获取存储值
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(CONFIG.storagePrefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage get error:', e);
      return defaultValue;
    }
  },

  /**
   * 设置存储值
   * @param {string} key - 键名
   * @param {*} value - 值
   */
  set(key, value) {
    try {
      localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set error:', e);
    }
  },

  /**
   * 移除存储值
   * @param {string} key - 键名
   */
  remove(key) {
    try {
      localStorage.removeItem(CONFIG.storagePrefix + key);
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initMobileSidebar();
});

/**
 * 初始化移动端侧边栏控制
 * 由于 DOM 结构限制，使用 JS 控制 body class 来显示/隐藏侧边栏
 */
function initMobileSidebar() {
  const drawerCheckbox = document.getElementById('__drawer');
  if (!drawerCheckbox) return;

  // 监听 checkbox 变化
  drawerCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  });

  // 点击遮罩层关闭时，确保移除 class
  const overlay = document.querySelector('.md-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
  }
}

/**
 * 初始化应用
 */
async function initApp() {
  try {
    // 初始化主题
    initTheme();
    
    // 加载文章数据
    await loadPostsData();
    
    // 渲染侧边栏导航
    renderSidebar();
    
    // 渲染文章列表
    renderPostsList();
    
    // 恢复侧边栏展开状态
    restoreSidebarState();
    
    // 初始化搜索
    initSearch();
    
    console.log('博客初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
    showError('加载失败，请刷新页面重试');
  }
}

// ==================== 数据加载 ====================

/**
 * 加载文章数据
 */
async function loadPostsData() {
  const response = await fetch(CONFIG.dataUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  postsData = await response.json();
  categoryTree = buildCategoryTree(postsData);
  
  console.log('加载文章:', postsData.length, '篇');
  console.log('分类树:', categoryTree);
}

/**
 * 构建分类树
 * @param {Array} posts - 文章列表
 * @returns {Object} 分类树对象
 */
function buildCategoryTree(posts) {
  const tree = {};
  
  posts.forEach(post => {
    // 获取分类，默认为"未分类"
    const categoryStr = post.category || '未分类';
    const categories = categoryStr.split('/').filter(Boolean);
    
    // 如果分割后为空，使用"未分类"
    const categoryList = categories.length > 0 ? categories : ['未分类'];
    
    let current = tree;
    let currentPath = '';
    
    // 构建分类层级
    categoryList.forEach((cat, index) => {
      currentPath = currentPath ? `${currentPath}/${cat}` : cat;
      
      if (!current[cat]) {
        current[cat] = {
          name: cat,
          children: {},
          posts: [],
          level: index,
          path: currentPath
        };
      }
      current = current[cat].children;
    });
    
    // 回到树根部，找到对应的分类节点
    current = tree;
    categoryList.forEach(cat => {
      if (current[cat]) {
        current = current[cat];
      }
    });
    
    // 添加文章到该分类
    if (current && current.posts) {
      current.posts.push(post);
    }
  });
  
  // 清理：如果只有"未分类"且没有文章，移除它
  if (tree['未分类'] && tree['未分类'].posts.length === 0 && Object.keys(tree).length > 1) {
    delete tree['未分类'];
  }
  
  return tree;
}

// ==================== 侧边栏渲染 ====================

/**
 * 渲染侧边栏
 */
function renderSidebar() {
  const navList = document.getElementById('nav-tree');
  if (!navList) return;
  
  const html = renderTreeNodes(categoryTree);
  navList.innerHTML = html;
  
  // 绑定展开/收起事件
  bindSidebarEvents();
}

/**
 * 渲染树节点 (使用 Checkbox Hack)
 * @param {Object} tree - 分类树
 * @param {string} parentPath - 父级路径
 * @returns {string} HTML字符串
 */
function renderTreeNodes(tree, parentPath = '') {
  const keys = Object.keys(tree);
  
  if (keys.length === 0) return '';
  
  return keys.map((key, index) => {
    const node = tree[key];
    const fullPath = parentPath ? `${parentPath}/${key}` : key;
    const hasChildren = Object.keys(node.children).length > 0;
    const hasPosts = node.posts.length > 0;
    const totalCount = countTotalPosts(node);
    
    // 生成唯一ID用于checkbox
    const checkboxId = `__nav_${fullPath.replace(/\//g, '_')}_${index}`;
    
    let html = '<li class="md-nav__item md-nav__item--nested">';
    
    // Checkbox (用于控制展开/收起)
    html += `<input class="md-nav__toggle md-toggle" type="checkbox" id="${checkboxId}" data-path="${escapeHtml(fullPath)}">`;
    
    // 分类链接/标签
    if (hasChildren || hasPosts) {
      html += `
        <div class="md-nav__link md-nav__container">
          <a href="#" class="md-nav__link" onclick="filterByCategory('${escapeHtml(fullPath)}'); return false;">
            <span class="md-ellipsis">${escapeHtml(key)}</span>
            <span class="md-nav__count">${totalCount}</span>
          </a>
          <label class="md-nav__link" for="${checkboxId}" tabindex="0" onclick="event.stopPropagation()">
            <span class="md-nav__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </span>
          </label>
        </div>
      `;
    } else {
      html += `
        <a href="#" class="md-nav__link" onclick="filterByCategory('${escapeHtml(fullPath)}'); return false;">
          <span class="md-ellipsis">${escapeHtml(key)}</span>
        </a>
      `;
    }
    
    // 子导航
    if (hasChildren || hasPosts) {
      html += '<nav class="md-nav" aria-label="' + escapeHtml(key) + '">';
      html += '<ul class="md-nav__list">';
      
      // 递归渲染子分类
      html += renderTreeNodes(node.children, fullPath);
      
      // 渲染文章列表
      const postLinkPrefix = getPostLinkPrefix();
      node.posts.forEach(post => {
        html += `
          <li class="md-nav__item">
            <a href="${postLinkPrefix}${escapeHtml(post.id)}.html" class="md-nav__link" data-post-id="${escapeHtml(post.id)}">
              <span class="md-ellipsis">${escapeHtml(post.title)}</span>
            </a>
          </li>
        `;
      });
      
      html += '</ul></nav>';
    }
    
    html += '</li>';
    return html;
  }).join('');
}

/**
 * 计算节点下的总文章数
 * @param {Object} node - 树节点
 * @returns {number}
 */
function countTotalPosts(node) {
  let count = node.posts.length;
  Object.values(node.children).forEach(child => {
    count += countTotalPosts(child);
  });
  return count;
}

/**
 * 绑定侧边栏事件
 */
function bindSidebarEvents() {
  // 监听所有 checkbox 的变化
  const checkboxes = document.querySelectorAll('.md-nav__toggle');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const path = e.target.dataset.path;
      const expanded = e.target.checked;
      saveSidebarState(path, expanded);
    });
  });
}

// ==================== 状态保存与恢复 ====================

/**
 * 保存侧边栏展开状态
 * @param {string} path - 分类路径
 * @param {boolean} expanded - 是否展开
 */
function saveSidebarState(path, expanded) {
  const state = Storage.get(CONFIG.sidebarStorageKey, {});
  state[path] = expanded;
  Storage.set(CONFIG.sidebarStorageKey, state);
}

/**
 * 恢复侧边栏展开状态
 */
function restoreSidebarState() {
  const state = Storage.get(CONFIG.sidebarStorageKey, {});
  
  Object.entries(state).forEach(([path, expanded]) => {
    if (expanded) {
      const checkbox = document.querySelector(`.md-nav__toggle[data-path="${path}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    }
  });
}

// ==================== 文章列表渲染 ====================

/**
 * 渲染文章列表
 * @param {Array} posts - 文章列表（可选，默认全部）
 */
function renderPostsList(posts = null) {
  const container = document.getElementById('posts-list');
  if (!container) return;
  
  const displayPosts = posts || postsData;
  
  // 按日期排序（最新的在前）
  const sortedPosts = [...displayPosts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  if (sortedPosts.length === 0) {
    container.innerHTML = '<p>暂无文章</p>';
    return;
  }
  
  const postLinkPrefix = getPostLinkPrefix();
  const html = sortedPosts.map(post => `
    <article class="post-card" style="margin-bottom: 2rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
      <h3 style="margin-bottom: 0.75rem;">
        <a href="${postLinkPrefix}${escapeHtml(post.id)}.html">${escapeHtml(post.title)}</a>
      </h3>
      <p style="color: var(--text-muted); margin-bottom: 1rem; line-height: 1.6;">
        ${escapeHtml(post.excerpt)}
      </p>
      <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--text-muted); align-items: center;">
        <span title="${new Date(post.date).toLocaleString('zh-CN')}">${formatDateFriendly(post.date)}</span>
        <span>${post.tags.map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('')}</span>
      </div>
    </article>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * 按分类筛选文章
 * @param {string} category - 分类路径
 */
function filterByCategory(category) {
  const filtered = postsData.filter(post => {
    return post.category === category || post.category.startsWith(category + '/');
  });
  
  renderPostsList(filtered);
  
  // 滚动到文章列表
  const postsList = document.getElementById('posts-list');
  if (postsList) {
    postsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // 在移动端关闭抽屉
  const drawerToggle = document.getElementById('__drawer');
  if (drawerToggle && window.innerWidth <= 768) {
    drawerToggle.checked = false;
  }
}

// ==================== 时间格式化 (简易版 timeago) ====================

/**
 * 将日期转换为相对时间
 * @param {string|Date} date - 日期
 * @returns {string}
 */
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  
  const intervals = {
    年: 31536000,
    个月: 2592000,
    天: 86400,
    小时: 3600,
    分钟: 60,
    秒: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}前`;
    }
  }
  
  return '刚刚';
}

/**
 * 格式化日期为友好显示
 * @param {string} dateString - 日期字符串
 * @returns {string}
 */
function formatDateFriendly(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  // 如果是最近7天，显示相对时间
  if (diffDays < 7) {
    return timeAgo(date);
  }
  
  // 否则显示完整日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ==================== 工具函数 ====================

/**
 * HTML转义
 * @param {string} text - 原始文本
 * @returns {string}
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string}
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 显示错误信息
 * @param {string} message - 错误消息
 */
function showError(message) {
  const container = document.querySelector('.md-content__inner');
  if (container) {
    container.innerHTML = `<div style="color: #dc2626; padding: 2rem; text-align: center;">${escapeHtml(message)}</div>`;
  }
}

// ==================== 代码复制功能 ====================

/**
 * 初始化代码复制按钮
 */
function initCodeCopy() {
  // 为所有 pre 代码块添加复制按钮
  document.querySelectorAll('.md-typeset pre, .post-content pre').forEach(pre => {
    // 如果已经有 wrapper，跳过
    if (pre.parentElement.classList.contains('code-block-wrapper')) return;
    
    // 创建 wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    // 创建复制按钮
    const button = document.createElement('button');
    button.className = 'code-copy-button';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>复制</span>
    `;
    
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent : pre.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        button.classList.add('copied');
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>已复制</span>
        `;
        
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>复制</span>
          `;
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        button.textContent = '失败';
      }
    });
    
    wrapper.appendChild(button);
  });
}

// ==================== 搜索功能 ====================

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  let searchIndex = [];
  
  // 构建搜索索引
  function buildSearchIndex() {
    searchIndex = postsData.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(' '),
      content: `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`.toLowerCase()
    }));
  }
  
  // 执行搜索
  function performSearch(query) {
    if (!query.trim()) return [];
    
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    if (terms.length === 0) return [];
    
    return searchIndex
      .map(item => {
        let score = 0;
        terms.forEach(term => {
          // 标题匹配权重最高
          if (item.title.toLowerCase().includes(term)) score += 10;
          // 分类匹配
          if (item.category.toLowerCase().includes(term)) score += 5;
          // 标签匹配
          if (item.tags.toLowerCase().includes(term)) score += 3;
          // 摘要匹配
          if (item.excerpt.toLowerCase().includes(term)) score += 2;
          // 全文匹配
          if (item.content.includes(term)) score += 1;
        });
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // 最多显示10条结果
  }
  
  // 高亮匹配文本
  function highlightText(text, query) {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    let highlighted = escapeHtml(text);
    terms.forEach(term => {
      const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="md-search__mark">$1</mark>');
    });
    return highlighted;
  }
  
  // 转义正则特殊字符
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // 渲染搜索结果
  function renderResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="md-search__empty">没有找到相关文章</div>';
      return;
    }
    
    const postLinkPrefix = getPostLinkPrefix();
    const html = results.map(result => `
      <a href="${postLinkPrefix}${escapeHtml(result.id)}.html" class="md-search__result">
        <div class="md-search__result-title">${highlightText(result.title, query)}</div>
        <div class="md-search__result-excerpt">${highlightText(result.excerpt, query)}</div>
      </a>
    `).join('');
    
    searchResults.innerHTML = html;
  }
  
  // 监听输入
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    if (query.length === 0) {
      searchResults.classList.remove('active');
      return;
    }
    
    debounceTimer = setTimeout(() => {
      const results = performSearch(query);
      renderResults(results, query);
      searchResults.classList.add('active');
    }, 150);
  });
  
  // 点击外部关闭搜索结果
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.md-search')) {
      searchResults.classList.remove('active');
    }
  });
  
  // 键盘导航
  searchInput.addEventListener('keydown', (e) => {
    const results = searchResults.querySelectorAll('.md-search__result');
    const active = searchResults.querySelector('.md-search__result:focus');
    
    if (e.key === 'Escape') {
      searchResults.classList.remove('active');
      searchInput.blur();
    } else if (e.key === 'ArrowDown' && results.length > 0) {
      e.preventDefault();
      if (!active) {
        results[0].focus();
      } else {
        const next = Array.from(results).indexOf(active) + 1;
        if (next < results.length) results[next].focus();
      }
    } else if (e.key === 'ArrowUp' && results.length > 0) {
      e.preventDefault();
      if (active) {
        const prev = Array.from(results).indexOf(active) - 1;
        if (prev >= 0) results[prev].focus();
        else searchInput.focus();
      }
    }
  });
  
  // 初始化索引
  if (postsData.length > 0) {
    buildSearchIndex();
  }
  
  // 监听数据加载完成
  const checkData = setInterval(() => {
    if (postsData.length > 0) {
      buildSearchIndex();
      clearInterval(checkData);
    }
  }, 100);
}

// ==================== 图片灯箱 ====================

/**
 * 初始化图片灯箱
 */
function initLightbox() {
  // 为文章中的图片添加灯箱功能
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.md-typeset img, .post-content img',
      touchNavigation: true,
      loop: false,
      zoomable: true,
      draggable: true,
      openEffect: 'zoom',
      closeEffect: 'zoom',
      slideEffect: 'slide'
    });
  }
}

// 导出全局函数供 HTML 调用
window.filterByCategory = filterByCategory;
window.initCodeCopy = initCodeCopy;
window.initLightbox = initLightbox;
