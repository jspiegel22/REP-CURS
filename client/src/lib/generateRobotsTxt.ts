const BASE_URL = 'https://cabo-adventures.com';

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Allow: /restaurants/
Allow: /villas/
Allow: /adventures/
Allow: /blog/
Allow: /about/
Allow: /contact/

Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

Sitemap: ${BASE_URL}/sitemap.xml`;
} 