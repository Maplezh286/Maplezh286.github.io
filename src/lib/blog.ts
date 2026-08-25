import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const CATEGORY_META: Record<string, { title: string; description: string }> = {
  technology: { title: '杂项', description: '工具、网络与其他零散记录' },
  tools: { title: '工具', description: '提高创造与开发效率的工具' },
  network: { title: '网络工具', description: '网络相关的工具与链接记录' },
  fundamentals: { title: '基础知识', description: '值得反复查阅的基础教程' },
  development: { title: '软件开发', description: '项目实践、工程经验与方法' },
  learning: { title: '学习', description: '学习方法、知识管理与成长' },
  methods: { title: '方法', description: '可复用的学习与思考方法' },
  life: { title: '生活', description: '生活观察与个人记录' },
  food: { title: '美食记录', description: '吃过的店、个人评分与回购清单' },
  thinking: { title: '思考', description: '关于时间、选择与心智的思考' },
};

export function publishedPosts(posts: Post[]) {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function postSlug(post: Post) {
  return post.id.replace(/\.(md|mdx)$/i, '');
}

export function postUrl(post: Post) {
  return `/posts/${postSlug(post)}/`;
}

export function categoryUrl(path: string[]) {
  return `/categories/${path.join('/')}/`;
}

export function categoryTitle(slug: string) {
  return CATEGORY_META[slug]?.title ?? slug;
}

export function readingTime(body = '') {
  const characters = body.replace(/```[\s\S]*?```/g, '').replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(characters / 500));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
