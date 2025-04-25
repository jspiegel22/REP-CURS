import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { db } from "../db";
import { siteImages } from "@shared/schema";
import { eq, desc, like, and, or } from "drizzle-orm";

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
    const { category, search } = req.query;
    
    let query = db.select().from(siteImages).orderBy(desc(siteImages.created_at));
    
    if (category && category !== "all") {
      query = query.where(eq(siteImages.category, category as string));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(siteImages.name, searchTerm),
          like(siteImages.alt_text, searchTerm),
          like(siteImages.description, searchTerm)
        )
      );
    }
    
    const images = await query;
    
    res.json(images);
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
      tags = ""
    } = req.body;

    if (!name || !alt_text) {
      return res.status(400).json({ error: "Name and alt text are required" });
    }

    // Process the image file - convert to WebP for better performance
    const originalPath = req.file.path;
    const filename = path.basename(originalPath, path.extname(originalPath));
    const webpPath = path.join(path.dirname(originalPath), `${filename}.webp`);
    
    // Process with sharp
    const imageInfo = await sharp(originalPath)
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    // Delete the original file
    fs.unlinkSync(originalPath);
    
    // Create relative URL
    const url = `/uploads/${filename}.webp`;
    
    // Parse tags
    const parsedTags = tags 
      ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];
    
    // Insert into database
    const [image] = await db.insert(siteImages).values({
      name,
      alt_text,
      description,
      category: category as any,
      url,
      width: imageInfo.width,
      height: imageInfo.height,
      file_size: imageInfo.size,
      tags: parsedTags,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    
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
    const filePath = path.join("public", image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: "Image deleted successfully", id });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;