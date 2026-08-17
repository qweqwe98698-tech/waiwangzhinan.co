import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const guides = await getCollection('guides');
  const sortedGuides = guides.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());

  return rss({
    title: '外网指南 (waiwangzhinan.co)',
    description: '面向国内第一次产生海外网络访问需求的新手交互式知识导航系统。',
    site: context.site || 'https://waiwangzhinan.co',
    items: sortedGuides.map((guide) => {
      const cleanSlug = guide.id.replace(/\.(md|mdx)$/, '');
      return {
        title: guide.data.title,
        pubDate: new Date(guide.data.pubDate),
        description: guide.data.description,
        link: `/${cleanSlug}/`,
      };
    }),
    customData: `<language>zh-CN</language>`,
  });
};
