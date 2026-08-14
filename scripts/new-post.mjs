import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [, , categoryPath, slug, ...titleParts] = process.argv;
const title = titleParts.join(' ').trim();
const validSegment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!categoryPath || !slug || !title) {
  console.error('用法: npm run new-post -- <分类路径> <slug> <文章标题>');
  console.error('示例: npm run new-post -- technology/tools terminal-guide "终端工具指南"');
  process.exit(1);
}

const categories = categoryPath.split('/').filter(Boolean);
if (!categories.length || !categories.every(validSegment.test.bind(validSegment)) || !validSegment.test(slug)) {
  console.error('分类路径和 slug 只能使用小写字母、数字与连字符。');
  process.exit(1);
}

const directory = resolve('src/content/posts', ...categories);
const target = resolve(directory, `${slug}.md`);
const date = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const content = `---
title: ${title}
description: 请在这里填写文章摘要。
publishedAt: ${date}
category: [${categories.join(', ')}]
tags: []
featured: false
draft: true
---

从这里开始写作。
`;

await mkdir(directory, { recursive: true });
try {
  await writeFile(target, content, { encoding: 'utf8', flag: 'wx' });
  console.log(`已创建: ${target}`);
} catch (error) {
  if (error?.code === 'EEXIST') {
    console.error(`文章已经存在，未覆盖: ${target}`);
    process.exit(1);
  }
  throw error;
}
