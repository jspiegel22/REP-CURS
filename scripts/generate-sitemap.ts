/**
 * Sitemap Generator Script
 * 
 * This script generates a comprehensive sitemap.xml file for the website.
 * It combines the static pages with dynamic content (adventures, villas, etc.)
 * 
 * Usage: npm run generate-sitemap
 */

import { generateSitemap } from '../server/services/sitemapGenerator';

async function main() {
  console.log('Generating sitemap.xml file...');
  
  try {
    const result = await generateSitemap();
    
    if (result) {
      console.log('✅ Sitemap generated successfully!');
      process.exit(0);
    } else {
      console.error('❌ Failed to generate sitemap');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

main();