#!/usr/bin/env python3
"""
博客文章发布工具
用法: python publish.py <文章ID> <文章标题> [分类] [标签...]

示例:
    python publish.py my-new-post "我的新文章" 技术/教程 Python 爬虫
"""

import sys
import json
import os
from datetime import datetime


def create_markdown_file(content_path, title):
    """创建 Markdown 文件模板"""
    template = f"""# {title}

在这里开始写文章...

## 第一章

内容...

## 第二章

内容...

---

*发布于 {datetime.now().strftime('%Y年%m月%d日')}*
"""
    
    with open(content_path, 'w', encoding='utf-8') as f:
        f.write(template)
    print(f"✅ 创建内容文件: {content_path}")


def create_html_file(posts_path, post_id):
    """从模板创建 HTML 文件"""
    template_path = 'posts/post-template.html'
    target_path = os.path.join(posts_path, f'{post_id}.html')
    
    if not os.path.exists(template_path):
        print(f"❌ 错误: 模板文件 {template_path} 不存在")
        sys.exit(1)
    
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 创建页面文件: {target_path}")


def update_posts_json(post_id, title, category, tags, content_path):
    """更新文章索引"""
    json_path = 'data/posts.json'
    
    # 读取现有文章
    with open(json_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    # 检查是否已存在
    for post in posts:
        if post['id'] == post_id:
            print(f"⚠️ 警告: 文章 '{post_id}' 已存在，将更新信息")
            posts.remove(post)
            break
    
    # 创建新文章条目
    new_post = {
        "id": post_id,
        "title": title,
        "category": category,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "excerpt": f"{title} - 点击查看全文",
        "tags": tags,
        "content": f"../{content_path}"
    }
    
    posts.append(new_post)
    
    # 按日期排序（最新的在前）
    posts.sort(key=lambda x: x['date'], reverse=True)
    
    # 保存
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 更新索引文件: {json_path}")


def main():
    # 解析参数
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    post_id = sys.argv[1]
    title = sys.argv[2]
    category = sys.argv[3] if len(sys.argv) > 3 else "随笔"
    tags = sys.argv[4:] if len(sys.argv) > 4 else ["随笔"]
    
    # 文章ID只能包含字母、数字、连字符
    if not all(c.isalnum() or c == '-' for c in post_id):
        print("❌ 错误: 文章ID只能包含字母、数字和连字符(-)")
        sys.exit(1)
    
    print(f"\n📝 发布新文章")
    print(f"   ID: {post_id}")
    print(f"   标题: {title}")
    print(f"   分类: {category}")
    print(f"   标签: {', '.join(tags)}\n")
    
    # 1. 创建 Markdown 文件
    content_path = f"content/{post_id}.md"
    create_markdown_file(content_path, title)
    
    # 2. 创建 HTML 文件
    create_html_file('posts', post_id)
    
    # 3. 更新索引
    update_posts_json(post_id, title, category, tags, content_path)
    
    print(f"\n✨ 文章发布成功!")
    print(f"   编辑内容: {content_path}")
    print(f"   预览地址: http://localhost:8000/posts/{post_id}.html")
    print(f"\n💡 提示: 编辑完内容后刷新浏览器即可看到更新")


if __name__ == '__main__':
    main()
