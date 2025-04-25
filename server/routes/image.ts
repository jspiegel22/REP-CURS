import { Router } from "express";
import { db } from "../db";
import { siteImages } from "@shared/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Setup image router
const imageRouter = Router();

// Get all images from the database with optional filtering
imageRouter.get("/", async (req, res) => {
  try {
    const { category, featured, tags } = req.query;
    
    // Build the query filters
    let filters = [];
    
    if (category) {
      filters.push(eq(siteImages.category, category as string));
    }
    
    if (featured === "true") {
      filters.push(eq(siteImages.featured, true));
    }
    
    // Execute the query with filters
    let images;
    if (filters.length > 0) {
      // Apply the first filter and chain the rest
      let query = db.select().from(siteImages).where(filters[0]);
      
      // Add any additional filters
      for (let i = 1; i < filters.length; i++) {
        query = query.where(filters[i]);
      }
      
      images = await query;
    } else {
      // No filters
      images = await db.select().from(siteImages);
    }
    
    return res.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Get a single image by ID
imageRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [image] = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
      
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    return res.json({ image });
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
});

// Create a new image record
imageRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      image_file,
      image_url,
      alt_text,
      description,
      width,
      height,
      category,
      tags,
      featured
    } = req.body;
    
    // Validate required fields
    if (!name || !image_file || !image_url || !alt_text || !category) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["name", "image_file", "image_url", "alt_text", "category"]
      });
    }
    
    // Insert the new image
    const [newImage] = await db
      .insert(siteImages)
      .values({
        name,
        image_file,
        image_url,
        alt_text,
        description,
        width,
        height,
        category,
        tags,
        featured: featured || false
      })
      .returning();
      
    return res.status(201).json({ image: newImage });
  } catch (error) {
    console.error("Error creating image:", error);
    return res.status(500).json({ error: "Failed to create image" });
  }
});

// Update an existing image
imageRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      image_file,
      image_url,
      alt_text,
      description,
      width,
      height,
      category,
      tags,
      featured
    } = req.body;
    
    // Validate image exists
    const [existingImage] = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
      
    if (!existingImage) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    // Update the image
    const [updatedImage] = await db
      .update(siteImages)
      .set({
        name: name !== undefined ? name : existingImage.name,
        image_file: image_file !== undefined ? image_file : existingImage.image_file,
        image_url: image_url !== undefined ? image_url : existingImage.image_url,
        alt_text: alt_text !== undefined ? alt_text : existingImage.alt_text,
        description: description !== undefined ? description : existingImage.description,
        width: width !== undefined ? width : existingImage.width,
        height: height !== undefined ? height : existingImage.height,
        category: category !== undefined ? category : existingImage.category,
        tags: tags !== undefined ? tags : existingImage.tags,
        featured: featured !== undefined ? featured : existingImage.featured,
        updated_at: new Date()
      })
      .where(eq(siteImages.id, parseInt(id)))
      .returning();
      
    return res.json({ image: updatedImage });
  } catch (error) {
    console.error("Error updating image:", error);
    return res.status(500).json({ error: "Failed to update image" });
  }
});

// Delete an image
imageRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate image exists
    const [existingImage] = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
      
    if (!existingImage) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    // Delete the image
    await db
      .delete(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
      
    return res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

// Utility route to scan the public/images directory and add images to the database
imageRouter.post("/scan", async (req, res) => {
  try {
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    
    // Define the directory path based on category
    const categoryDirs: Record<string, string> = {
      hero: 'hero',
      resort: 'resorts',
      villa: 'villas',
      restaurant: 'restaurants',
      activity: 'activities',
      beach: 'beaches',
      wedding: 'weddings',
      yacht: 'yachts',
      luxury: 'luxury',
      family: 'family',
      blog: 'blog',
      testimonial: 'testimonials'
    };
    
    // Get the absolute directory path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const imagesDir = path.join(__dirname, '..', '..', 'public', 'images', categoryDirs[category] || category);
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return res.status(404).json({ error: `Directory for category '${category}' not found` });
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter image files
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      return res.status(404).json({ error: `No images found in category '${category}'` });
    }
    
    // Process each image
    const results = [];
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const relativePath = `/images/${categoryDirs[category] || category}/${file}`;
      const imageUrl = relativePath;
      
      // Generate a friendly name
      const baseName = path.basename(file, path.extname(file));
      const friendlyName = baseName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      
      // Get image dimensions if not SVG
      let width, height;
      if (!file.endsWith('.svg')) {
        try {
          const metadata = await sharp(filePath).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (err) {
          console.warn(`Could not get dimensions for ${file}:`, err);
        }
      }
      
      // Check if image already exists in the database
      const [existingImage] = await db
        .select()
        .from(siteImages)
        .where(eq(siteImages.image_file, relativePath));
      
      if (existingImage) {
        // Update the existing record
        const [updatedImage] = await db
          .update(siteImages)
          .set({
            width: width || existingImage.width,
            height: height || existingImage.height,
            updated_at: new Date()
          })
          .where(eq(siteImages.id, existingImage.id))
          .returning();
          
        results.push({ status: 'updated', image: updatedImage });
      } else {
        // Create a new record
        const [newImage] = await db
          .insert(siteImages)
          .values({
            name: friendlyName,
            image_file: relativePath,
            image_url: imageUrl,
            alt_text: friendlyName,
            description: `${friendlyName} in Cabo San Lucas`,
            width,
            height,
            category,
            tags: [category, baseName],
            featured: file.includes('featured')
          })
          .returning();
          
        results.push({ status: 'created', image: newImage });
      }
    }
    
    return res.json({ 
      success: true, 
      message: `Processed ${results.length} images`,
      created: results.filter(r => r.status === 'created').length,
      updated: results.filter(r => r.status === 'updated').length,
      results
    });
  } catch (error) {
    console.error("Error scanning images:", error);
    return res.status(500).json({ error: "Failed to scan images" });
  }
});

export default imageRouter;