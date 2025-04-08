import { restaurants } from '@/data/restaurants';
import { villas } from '@/data/villas';
import { adventures } from '@/data/adventures';

const BASE_URL = 'https://cabo-adventures.com';

export function generateSitemap() {
  const staticPages = [
    '',
    '/restaurants',
    '/villas',
    '/adventures',
    '/about',
    '/contact',
    '/blog'
  ];

  const restaurantPages = restaurants.map(restaurant => ({
    url: `${BASE_URL}/restaurants/${restaurant.id}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8
  }));

  const villaPages = villas.map(villa => ({
    url: `${BASE_URL}/villas/${villa.id}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8
  }));

  const adventurePages = adventures.map(adventure => ({
    url: `${BASE_URL}/adventures/${adventure.id}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map(page => `
        <url>
          <loc>${BASE_URL}${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${page === '' ? '1.0' : '0.9'}</priority>
        </url>
      `).join('')}
      ${restaurantPages.map(page => `
        <url>
          <loc>${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
      ${villaPages.map(page => `
        <url>
          <loc>${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
      ${adventurePages.map(page => `
        <url>
          <loc>${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;

  return sitemap;
} 