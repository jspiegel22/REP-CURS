# Hero Background Instructions

After multiple attempts with video backgrounds that had technical issues, we've implemented a high-quality image background for the hero section. This provides a reliable, professional appearance while ensuring fast page load speeds.

## Current Background Setup

The hero section is currently using a high-quality image of Cabo San Lucas from Unsplash.

## How to Update the Background Image

To change the background image, simply update the URL in the `backgroundImage` style property in `hero-section.tsx`:

```jsx
<div 
  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
  style={{ 
    backgroundImage: `url(YOUR_NEW_IMAGE_URL)`,
  }}
/>
```

## Image Guidelines

For best performance:
- Use high-resolution images (at least 1920x1080)
- Optimize file size for web (under 500KB if possible)
- Choose landscape orientation images
- Use images with good contrast to ensure text readability
- Consider the content positioning - the right side has more text overlay

## Future Video Implementation

If you'd like to revisit video backgrounds in the future:
1. Ensure your video is properly encoded as H.264 MP4
2. Keep file size under 10MB
3. Consider hosting on a CDN for better performance