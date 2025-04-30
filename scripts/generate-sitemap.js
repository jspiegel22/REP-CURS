/**
 * Sitemap Generator Script
 * 
 * This script generates a comprehensive sitemap.xml file for the website.
 * It combines the static pages with dynamic content (adventures, villas, etc.)
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Initialize the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const BASE_URL = 'https://cabo-adventures.com';

async function generateSitemap() {
  try {
    console.log('Generating sitemap.xml...');
    
    // Start with the static part of the sitemap
    let staticSitemap = fs.readFileSync(path.join(__dirname, '../public/sitemap.xml'), 'utf8');
    
    // Fetch dynamic content from database
    const client = await pool.connect();
    
    try {
      // Fetch adventures
      const adventuresResult = await client.query('SELECT slug, updated_at FROM adventures');
      const adventures = adventuresResult.rows;
      
      // Fetch villas
      const villasResult = await client.query('SELECT slug, updated_at FROM villas');
      const villas = villasResult.rows;
      
      // Fetch resorts
      const resortsResult = await client.query('SELECT slug, updated_at FROM resorts');
      const resorts = resortsResult.rows;
      
      // Fetch blog posts if available
      let blogPosts = [];
      try {
        const blogResult = await client.query('SELECT slug, updated_at FROM blog_posts');
        blogPosts = blogResult.rows;
      } catch (err) {
        console.log('No blog_posts table found, skipping blog entries');
      }
      
      // Fetch restaurants if available
      let restaurants = [];
      try {
        const restaurantsResult = await client.query('SELECT slug, updated_at FROM restaurants');
        restaurants = restaurantsResult.rows;
      } catch (err) {
        console.log('No restaurants table found, skipping restaurant entries');
      }
      
      // Insert dynamic entries before the closing tag
      const dynamicEntries = [];
      
      // Add adventures
      adventures.forEach(adventure => {
        dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/adventures/${adventure.slug}</loc>
    <lastmod>${new Date(adventure.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
      
      // Add villas
      villas.forEach(villa => {
        dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/villa/${villa.slug}</loc>
    <lastmod>${new Date(villa.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
      
      // Add resorts
      resorts.forEach(resort => {
        dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/resort/${resort.slug}</loc>
    <lastmod>${new Date(resort.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
      
      // Add blog posts
      blogPosts.forEach(post => {
        dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
      });
      
      // Add restaurants
      restaurants.forEach(restaurant => {
        dynamicEntries.push(`  <url>
    <loc>${BASE_URL}/restaurant/${restaurant.slug}</loc>
    <lastmod>${new Date(restaurant.updated_at).toISOString().split('T')[0]}</lastmod>
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
      fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), completeSitemap);
      
      console.log('Sitemap generated successfully!');
      console.log(`Added ${adventures.length} adventures, ${villas.length} villas, ${resorts.length} resorts, ${blogPosts.length} blog posts, ${restaurants.length} restaurants`);
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the sitemap generator
generateSitemap();