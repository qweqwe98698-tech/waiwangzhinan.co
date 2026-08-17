import type { APIRoute } from 'astro';

const getRobotsTxt = (siteURL: string) => `User-agent: *
Allow: /

Sitemap: ${siteURL}sitemap-index.xml
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.toString() : 'https://waiwangzhinan.co/';
  return new Response(getRobotsTxt(siteUrl), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
