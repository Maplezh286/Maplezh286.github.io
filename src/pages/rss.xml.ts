import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { postUrl, publishedPosts } from '../lib/blog';

export const GET: APIRoute = async (context) => {
  const posts = publishedPosts(await getCollection('posts'));
  return rss({
    title: '江枫博客',
    description: '记录软件开发、AI 学习与生活思考。',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
};
