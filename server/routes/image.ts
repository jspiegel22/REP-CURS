import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { db } from "../db";
import { siteImages, ImageCategory, type InsertSiteImage } from "@shared/schema";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop()?.toLowerCase();
    cb(null, `${uniqueSuffix}.${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.") as any);
    }
  }
});

// Get all images
router.get("/", async (req, res) => {
  try {
    const { category, search, featured, tags } = req.query;
    
    // Build query conditions
    const conditions = [];
    
    if (category && category !== "all") {
      // Use SQL to cast the category safely
      conditions.push(sql`${siteImages.category} = ${category}`);
    }
    
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(siteImages.name, searchTerm),
          like(siteImages.alt_text, searchTerm),
          like(siteImages.description, searchTerm)
        )
      );
    }
    
    if (featured === 'true') {
      conditions.push(eq(siteImages.featured, true));
    }
    
    // Execute query with all conditions
    let query;
    if (conditions.length > 0) {
      query = db
        .select()
        .from(siteImages)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(desc(siteImages.created_at));
    } else {
      query = db
        .select()
        .from(siteImages)
        .orderBy(desc(siteImages.created_at));
    }
    
    // Get all images from query
    const images = await query;
    
    // Filter by tags if needed (doing this in JS since it's an array field)
    let filteredImages = images;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filteredImages = images.filter(image => {
        if (!image.tags) return false;
        return tagArray.some((tag) => image.tags && image.tags.includes(tag as string));
      });
    }
    
    // Return the images array directly
    res.json(filteredImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Get single image by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [image] = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
    
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    res.json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// Upload new image
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { 
      name, 
      alt_text, 
      description = "",
      category = "uncategorized",
      tags = "",
      featured = "false"
    } = req.body;

    if (!name || !alt_text) {
      return res.status(400).json({ error: "Name and alt text are required" });
    }

    // Process the image file - convert to WebP for better performance
    const originalPath = req.file.path;
    const originalName = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const safeFileName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-') // Replace any non alphanumeric with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single one
      
    const filename = `${safeFileName}-${Date.now()}`;
    const webpPath = path.join(path.dirname(originalPath), `${filename}.webp`);
    
    // Process with sharp
    const imageInfo = await sharp(originalPath)
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    // Delete the original file
    fs.unlinkSync(originalPath);
    
    // Create relative URL
    const image_url = `/uploads/${filename}.webp`;
    
    // Parse tags
    const parsedTags = tags 
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [];
    
    // Insert into database using type for safety, omitting created_at and updated_at which are auto-generated
    const imageData: InsertSiteImage = {
      name,
      image_file: filename + '.webp',
      image_url,
      alt_text,
      description,
      category: category as typeof ImageCategory[number],
      width: imageInfo.width,
      height: imageInfo.height,
      tags: parsedTags,
      featured: featured === 'true'
    };
    
    // For TypeScript type safety, use direct object with type assertion
    const [image] = await db.insert(siteImages).values([{
      name: imageData.name,
      image_file: imageData.image_file,
      image_url: imageData.image_url,
      alt_text: imageData.alt_text,
      description: imageData.description,
      category: imageData.category,
      width: imageData.width,
      height: imageData.height,
      tags: imageData.tags,
      featured: imageData.featured
    }] as any).returning();
    
    res.status(201).json(image);
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Bulk upload endpoint - upload multiple images at once
router.post("/bulk-upload", upload.array("files", 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { 
      category = "uncategorized",
      tags = "",
      featured = "false"
    } = req.body;

    const uploadResults = [];
    const errors = [];

    // Process each file
    for (const file of req.files as Express.Multer.File[]) {
      try {
        // Generate name from filename if not provided
        const originalName = path.basename(file.originalname, path.extname(file.originalname));
        const safeFileName = originalName
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-') // Replace any non alphanumeric with hyphens
          .replace(/-+/g, '-'); // Replace multiple hyphens with single one
          
        const name = safeFileName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        const filename = `${safeFileName}-${Date.now()}`;
        const originalPath = file.path;
        const webpPath = path.join(path.dirname(originalPath), `${filename}.webp`);
        
        // Process with sharp for optimized WebP conversion
        const imageInfo = await sharp(originalPath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        // Delete the original file
        fs.unlinkSync(originalPath);
        
        // Create relative URL
        const image_url = `/uploads/${filename}.webp`;
        
        // Parse tags
        const parsedTags = tags 
          ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : [];
        
        // Insert into database with type safety, omitting created_at and updated_at
        const bulkImageData: InsertSiteImage = {
          name: name, // Auto-generated from filename
          image_file: filename + '.webp',
          image_url,
          alt_text: `${name} image for ${category} category`, // Auto-generated
          description: `${name} in ${category} category`, // Auto-generated
          category: category as typeof ImageCategory[number],
          width: imageInfo.width,
          height: imageInfo.height,
          tags: parsedTags,
          featured: featured === 'true'
        };
        
        // For TypeScript type safety, use array with type assertion
        const [image] = await db.insert(siteImages).values([{
          name: bulkImageData.name,
          image_file: bulkImageData.image_file,
          image_url: bulkImageData.image_url,
          alt_text: bulkImageData.alt_text,
          description: bulkImageData.description,
          category: bulkImageData.category,
          width: bulkImageData.width,
          height: bulkImageData.height,
          tags: bulkImageData.tags,
          featured: bulkImageData.featured
        }] as any).returning();
        
        uploadResults.push(image);
      } catch (err: any) {
        console.error(`Error processing file ${file.originalname}:`, err);
        errors.push({
          file: file.originalname,
          error: err?.message || 'Unknown error'
        });
      }
    }
    
    res.status(201).json({
      success: true,
      uploaded: uploadResults.length,
      errors: errors.length > 0 ? errors : undefined,
      images: uploadResults
    });
  } catch (error) {
    console.error("Error in bulk upload:", error);
    
    // Clean up files if they exist
    if (req.files) {
      for (const file of req.files as Express.Multer.File[]) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
    
    res.status(500).json({ error: "Failed to process bulk upload" });
  }
});

// Update image
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      alt_text, 
      description,
      category,
      tags
    } = req.body;
    
    // Check if image exists
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
        name: name || existingImage.name,
        alt_text: alt_text || existingImage.alt_text,
        description: description !== undefined ? description : existingImage.description,
        category: category || existingImage.category,
        tags: Array.isArray(tags) ? tags : existingImage.tags,
        updated_at: new Date()
      })
      .where(eq(siteImages.id, parseInt(id)))
      .returning();
    
    res.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ error: "Failed to update image" });
  }
});

// Delete image
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the image to delete
    const [image] = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
    
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    // Delete from database
    await db
      .delete(siteImages)
      .where(eq(siteImages.id, parseInt(id)));
    
    // Delete file from disk
    const filePath = path.join("public", image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: "Image deleted successfully", id });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// Load sample images from attached_assets
router.post("/load-samples", async (req, res) => {
  try {
    // Define sample images to load from attached_assets
    const sampleImages = [
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'Villa_Chavez-2.jpg'),
        name: 'Villa Chavez',
        category: 'villa',
        alt_text: 'Luxurious Villa Chavez in Cabo San Lucas',
        description: 'A stunning villa with panoramic views of the ocean',
        tags: ['luxury', 'villa', 'ocean view'],
        featured: true
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'dream vacation cabo.JPG'),
        name: 'Dream Vacation Cabo',
        category: 'hero',
        alt_text: 'Dream vacation destination in Cabo San Lucas',
        description: 'Experience the ultimate dream vacation in Cabo',
        tags: ['dream', 'vacation', 'luxury'],
        featured: true
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'four seasons CDS.jpg'),
        name: 'Four Seasons Cabo Del Sol',
        category: 'resort',
        alt_text: 'Four Seasons Resort at Cabo Del Sol',
        description: 'Luxury resort with stunning beach access and amenities',
        tags: ['four seasons', 'resort', 'luxury'],
        featured: true
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'grand-velas-los-cabos.jpg'),
        name: 'Grand Velas Los Cabos',
        category: 'resort',
        alt_text: 'Grand Velas Resort in Los Cabos',
        description: 'All-inclusive luxury resort with spectacular ocean views',
        tags: ['grand velas', 'resort', 'all-inclusive'],
        featured: true
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'Katie.jpg'),
        name: 'Katie - Testimonial',
        category: 'testimonial',
        alt_text: 'Katie from New York, satisfied customer',
        description: 'Katie shares her amazing experience in Cabo',
        tags: ['testimonial', 'customer'],
        featured: false
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'Kylie.png'),
        name: 'Kylie - Testimonial',
        category: 'testimonial',
        alt_text: 'Kylie from California, happy traveler',
        description: 'Kylie talks about her family trip to Cabo',
        tags: ['testimonial', 'customer', 'family'],
        featured: false
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'Phil K.jpeg'),
        name: 'Phil K - Testimonial',
        category: 'testimonial',
        alt_text: 'Phil K, business traveler',
        description: 'Phil discusses his corporate retreat in Cabo',
        tags: ['testimonial', 'customer', 'business'],
        featured: false
      },
      {
        filepath: path.join(process.cwd(), 'attached_assets', 'joel.jpeg'),
        name: 'Joel - Testimonial',
        category: 'testimonial',
        alt_text: 'Joel, adventure seeker',
        description: 'Joel shares his adventure experiences in Cabo',
        tags: ['testimonial', 'customer', 'adventure'],
        featured: false
      }
    ];

    // Make sure the uploads directory exists
    const uploadDir = path.join('public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const results = [];
    const errors = [];

    // Process each image
    for (const imageData of sampleImages) {
      try {
        // Check if file exists
        if (!fs.existsSync(imageData.filepath)) {
          errors.push({ 
            name: imageData.name, 
            error: `File not found: ${imageData.filepath}` 
          });
          continue;
        }

        // Check if image with this name already exists
        const existingImages = await db
          .select()
          .from(siteImages)
          .where(sql`${siteImages.name} = ${imageData.name}`);

        if (existingImages.length > 0) {
          console.log(`Image "${imageData.name}" already exists, skipping`);
          continue;
        }

        // Generate safe filename
        const originalName = path.basename(imageData.filepath, path.extname(imageData.filepath));
        const safeFileName = originalName
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-')
          .replace(/-+/g, '-');

        const filename = `${safeFileName}-${Date.now()}`;
        const webpPath = path.join(uploadDir, `${filename}.webp`);

        // Process with sharp for conversion to WebP
        const imageInfo = await sharp(imageData.filepath)
          .webp({ quality: 85 })
          .toFile(webpPath);

        // Create relative URL
        const image_url = `/uploads/${filename}.webp`;

        // Insert into database with proper typing, omitting created_at and updated_at
        const sampleImageData: InsertSiteImage = {
          name: imageData.name,
          image_file: `${filename}.webp`,
          image_url,
          alt_text: imageData.alt_text,
          description: imageData.description,
          category: imageData.category as typeof ImageCategory[number],
          width: imageInfo.width,
          height: imageInfo.height,
          tags: imageData.tags,
          featured: imageData.featured
        };
        
        // For TypeScript type safety, use array with type assertion
        const [image] = await db.insert(siteImages).values([{
          name: sampleImageData.name,
          image_file: sampleImageData.image_file,
          image_url: sampleImageData.image_url,
          alt_text: sampleImageData.alt_text,
          description: sampleImageData.description,
          category: sampleImageData.category,
          width: sampleImageData.width,
          height: sampleImageData.height,
          tags: sampleImageData.tags,
          featured: sampleImageData.featured
        }] as any).returning();

        results.push(image);
      } catch (error: any) {
        errors.push({ 
          name: imageData.name, 
          error: error?.message || 'Unknown error' 
        });
      }
    }

    res.json({
      success: true,
      uploaded: results.length,
      errors: errors.length > 0 ? errors : undefined,
      images: results
    });
  } catch (error) {
    console.error("Error loading sample images:", error);
    res.status(500).json({ error: "Failed to load sample images" });
  }
});

export default router;