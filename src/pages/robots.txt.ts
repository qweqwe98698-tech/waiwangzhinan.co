import type { APIRoute } from 'astro';

const getRobotsTxt = (siteURL: string) => `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: yisouspider
Allow: /

User-agent: 360Spider
Allow: /

User-agent: *
Allow: /

Sitemap: ${siteURL}sitemap.xml
Sitemap: ${siteURL}sitemap-index.xml
Sitemap: ${siteURL}sitemap-0.xml
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.toString() : 'https://waiwangzhinan.co/';
  return new Response(getRobotsTxt(siteUrl), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
