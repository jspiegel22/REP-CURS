# Hero Video Instructions

The hero section now uses a YouTube video embed as the background. This is the most reliable and best performance option for high-quality video backgrounds.

## Current YouTube Video Setup

The hero section is currently configured to use the YouTube video with ID `02mzc-SyIYA` that you provided.

## How to Change the YouTube Video

1. Upload your video to YouTube
2. Get the video ID from the URL (the part after `v=` in the URL)
   * Example: From `https://www.youtube.com/watch?v=02mzc-SyIYA`, the ID is `02mzc-SyIYA`
3. In `hero-section.tsx`, simply update the `youtubeVideoId` constant with your new video ID:
   ```javascript
   const youtubeVideoId = "YOUR_VIDEO_ID"; // Replace with your YouTube video ID
   ```

## Fallback Image

If the YouTube video fails to load for any reason, the hero section will automatically display a fallback image. You can change this image by updating the `fallbackImage` URL in the hero-section.tsx file.