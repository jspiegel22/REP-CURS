# Cabo San Lucas Website Image Management System

This directory contains all the images used throughout the Cabo San Lucas website. The images are organized into subdirectories based on their category.

## Directory Structure

- `/hero`: Hero images for the homepage and main sections
- `/resorts`: Images of resorts and hotels
- `/villas`: Luxury villa images
- `/restaurants`: Restaurant and dining images
- `/activities`: Activity and excursion images
- `/beaches`: Beach scenery images
- `/weddings`: Wedding and event images
- `/yachts`: Yacht and boating images
- `/luxury`: Luxury experience and concierge images
- `/family`: Family-friendly activities and accommodations
- `/blog`: Blog post featured images

## Image Naming Convention

Images follow a specific naming convention:

- Featured images: `{category}-featured-{number}.webp` (e.g., `villa-featured-1.webp`)
- Regular images: `{category}-{descriptor}.webp` (e.g., `resort-pool.webp`)
- Original images (if kept): `{category}-original-{number}.{original-extension}` (e.g., `villa-original-1.jpg`)

## Image Processing

Use the image processor utility to optimize, resize, and convert your images to WebP format:

```bash
node scripts/image-processor.js --source=/path/to/your/images --category=resort [options]
```

### Options

- `--source=PATH`: Path to the directory containing images to process (required)
- `--category=NAME`: Image category (required). One of: hero, resort, villa, restaurant, activity, beach, wedding, yacht, luxury, family, blog
- `--quality=NUMBER`: Image quality (1-100, default: 85)
- `--format=FORMAT`: Output format (webp, jpeg, png, avif, default: webp)
- `--keep-original`: Keep original image files in addition to the processed versions

### Example

```bash
# Convert resort images to WebP with 90% quality
node scripts/image-processor.js --source=./my-photos --category=resort --quality=90

# Convert villa images to AVIF (better compression but less compatibility)
node scripts/image-processor.js --source=./villa-photos --category=villa --format=avif

# Process beach images but also keep the originals
node scripts/image-processor.js --source=./beach-photos --category=beach --keep-original
```

The image processor will:
1. Resize images to appropriate dimensions for their category
2. Convert images to WebP format (or other specified format) for better compression and quality
3. Rename files according to our naming convention
4. Copy files to the correct directories
5. Optionally keep original files if needed

## WebP Format Benefits

By default, all images are converted to WebP format, which offers several advantages:

- **Smaller file sizes**: WebP images are typically 25-35% smaller than JPEG or PNG images at the same visual quality
- **Faster loading**: Smaller file sizes mean faster page loads and better user experience
- **SEO benefits**: Google rewards faster sites with better search rankings
- **Support for transparency**: Unlike JPEG, WebP supports transparency like PNG but with better compression
- **Browser support**: All modern browsers (Chrome, Firefox, Safari, Edge) support WebP

For the rare case where WebP isn't supported, our image component automatically falls back to another format if the WebP image fails to load.

## Image Dimensions

For best results, use images with the following dimensions:

- Hero images: 1920×1080 px
- Featured images: 800×600 px
- Blog images: 1200×675 px

## Using Images in Components

Import the image map in your component:

```tsx
import { images } from '@/lib/imageMap';
import { CaboImage } from '@/components/ui/cabo-image';

// Usage
<CaboImage
  src={images.resort.featured1}
  alt="Luxury Resort"
  category="resort"
  className="w-full h-64 object-cover"
/>
```

## Fallback System

All images have fallbacks if they fail to load:

1. The specific image requested
2. The fallback image provided (if any)
3. The category default image
4. The global default image

## Adding New Images

1. Add physical files to the appropriate directory
2. Update the image map in `client/src/lib/imageMap.ts`