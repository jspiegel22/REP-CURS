import { Express, Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Register routes for image optimization
 */
export function registerImageOptimizationRoutes(app: Express) {
  // Endpoint to optimize and convert images to WebP
  app.get('/api/images/optimize', async (req: Request, res: Response) => {
    try {
      const imageSrc = req.query.src as string;
      
      if (!imageSrc) {
        return res.status(400).send('Image source parameter is required');
      }

      // Get image paths and calculate the location on disk
      const imagePath = path.join(process.cwd(), 'public', imageSrc);
      
      // Make sure the requested file exists and is in the allowed directory
      if (!imagePath.startsWith(path.join(process.cwd(), 'public'))) {
        return res.status(403).send('Access denied');
      }
      
      if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
      }

      // Parse optimization parameters
      const width = req.query.w ? parseInt(req.query.w as string, 10) : undefined;
      const height = req.query.h ? parseInt(req.query.h as string, 10) : undefined;
      const quality = req.query.q ? parseInt(req.query.q as string, 10) : 80;
      const format = (req.query.fmt as string || 'webp').toLowerCase();

      // Create cache path
      const cacheDir = path.join(process.cwd(), 'public', 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Generate a unique cache filename
      const params = `${width || 'auto'}x${height || 'auto'}_${quality}_${format}`;
      const fileExt = path.extname(imagePath);
      const fileName = path.basename(imagePath, fileExt);
      const cacheFileName = `${fileName}_${params}${format === 'webp' ? '.webp' : fileExt}`;
      const cachePath = path.join(cacheDir, cacheFileName);

      // Return from cache if exists
      if (fs.existsSync(cachePath)) {
        const cacheStats = fs.statSync(cachePath);
        const imageStats = fs.statSync(imagePath);

        // Use cache if original isn't newer
        if (cacheStats.mtime >= imageStats.mtime) {
          res.setHeader('Content-Type', format === 'webp' ? 'image/webp' : `image/${format}`);
          return fs.createReadStream(cachePath).pipe(res);
        }
      }

      // Process the image
      let image = sharp(imagePath);

      // Resize if dimensions are provided
      if (width || height) {
        image = image.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Convert format if needed
      if (format === 'webp') {
        image = image.webp({ quality });
        res.setHeader('Content-Type', 'image/webp');
      } else if (format === 'jpg' || format === 'jpeg') {
        image = image.jpeg({ quality });
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (format === 'png') {
        image = image.png({ quality });
        res.setHeader('Content-Type', 'image/png');
      } else if (format === 'avif') {
        image = image.avif({ quality });
        res.setHeader('Content-Type', 'image/avif');
      } else {
        res.setHeader('Content-Type', `image/${format}`);
      }

      // Cache the result
      await image.toFile(cachePath);

      // Send the optimized image
      fs.createReadStream(cachePath).pipe(res);
    } catch (error) {
      console.error('Image optimization error:', error);
      res.status(500).send('Error processing image');
    }
  });
}