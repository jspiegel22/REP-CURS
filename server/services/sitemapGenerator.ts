import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { adventures } from '@shared/schema';
import { desc, eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const BASE_URL = 'https://cabo-adventures.com';

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generate and update the sitemap.xml file with all static and dynamic content
 */
export async function generateSitemap() {
  try {
    console.log('Generating sitemap.xml...');
    
    // Start with the static part of the sitemap
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    let staticSitemap = fs.readFileSync(sitemapPath, 'utf8');
    
    // Fetch dynamic content from database
    
    // Fetch adventures
    const adventuresList = await db.select({
      slug: adventures.slug,
      updatedAt: adventures.updatedAt
    }).from(adventures);
    
    // Fetch villas and generate slugs from names
    let villasList: { slug: string, updatedAt: Date | null }[] = [];
    try {
      const villasResult = await db.execute(sql`SELECT name, updated_at as "updatedAt" FROM villas`);
      villasList = (villasResult.rows as { name: string, updatedAt: Date | null }[]).map(villa => ({
        slug: generateSlug(villa.name),
        updatedAt: villa.updatedAt
      }));
    } catch (err) {
      console.log('Error fetching villas:', err);
    }
    
    // Fetch resorts and generate slugs from names
    let resortsList: { slug: string, updatedAt: Date | null }[] = [];
    try {
      const resortsResult = await db.execute(sql`SELECT name, updated_at as "updatedAt" FROM resorts`);
      resortsList = (resortsResult.rows as { name: string, updatedAt: Date | null }[]).map(resort => ({
        slug: generateSlug(resort.name),
        updatedAt: resort.updatedAt
      }));
    } catch (err) {
      console.log('Error fetching resorts:', err);
    }
    
    // Fetch blog posts using raw SQL
    let blogPostsList: { slug: string, updatedAt: Date | null }[] = [];
    try {
      const blogResult = await db.execute(sql`SELECT slug, updated_at as "updatedAt" FROM blog_posts`);
      blogPostsList = blogResult.rows as { slug: string, updatedAt: Date | null }[];
    } catch (err) {
      console.log('No blog_posts table or entries found, skipping blog entries');
    }
    
    // Fetch restaurants using raw SQL
    let restaurantsList: { slug: string, updatedAt: Date | null }[] = [];
    try {
      const restaurantsResult = await db.execute(sql`SELECT slug, updated_at as "updatedAt" FROM restaurants`);
      restaurantsList = restaurantsResult.rows as { slug: string, updatedAt: Date | null }[];
    } catch (err) {
      console.log('No restaurants table or entries found, skipping restaurant entries');
    }
    
    // Insert dynamic entries before the closing tag
    const dynamicEntries: string[] = [];
    
    // Helper function to safely format date
    const formatDate = (date: Date | null) => {
      if (!date) return new Date().toISOString().split('T')[0]; // Today's date as fallback
      return new Date(date).toISOString().split('T')[0];
    };
    
    // Add adventures
    adventuresList.forEach(adventure => {
      dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/adventures/${adventure.slug}</loc>
    <lastmod>${formatDate(adventure.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
    
    // Add villas
    villasList.forEach(villa => {
      dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/villas/${villa.slug}</loc>
    <lastmod>${formatDate(villa.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
    
    // Add resorts
    resortsList.forEach(resort => {
      dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/resorts/${resort.slug}</loc>
    <lastmod>${formatDate(resort.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
    
    // Add blog posts
    blogPostsList.forEach(post => {
      dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${formatDate(post.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
    
    // Add restaurants
    restaurantsList.forEach(restaurant => {
      dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/restaurant/${restaurant.slug}</loc>
    <lastmod>${formatDate(restaurant.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
    
    // Replace the placeholder comment with dynamic entries
    const completeSitemap = staticSitemap.replace(
      '  <!-- Dynamic pages will be programmatically inserted -->',
      dynamicEntries.join('\n')
    );
    
    // Write the complete sitemap to the public directory
    fs.writeFileSync(sitemapPath, completeSitemap);
    
    console.log('Sitemap generated successfully!');
    console.log(`Added ${adventuresList.length} adventures, ${villasList.length} villas, ${resortsList.length} resorts, ${blogPostsList.length} blog posts, ${restaurantsList.length} restaurants`);
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
}

/**
 * Generate sitemap for production deployment
 * This function should be called during the build process
 */
export async function generateProductionSitemap() {
  await generateSitemap();
}

/**
 * Trigger sitemap regeneration when content changes
 * This is a lightweight wrapper around generateSitemap that handles errors gracefully
 */
export async function updateSitemap() {
  try {
    await generateSitemap();
  } catch (error) {
    console.error("Failed to update sitemap:", error);
    // Don't throw error to avoid breaking API operations
  }
}