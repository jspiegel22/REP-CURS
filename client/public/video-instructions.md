# Hero Video Instructions

The hero section now uses a local MP4 video file as the background. This approach provides more reliable playback than embedded videos.

## Current Video Setup

The hero section is configured to use the local file `cabo-travel.mp4` that we converted from your original .mov file.

## How to Update the Background Video

There are two ways to update the video:

### Option 1: Replace the existing video file (easiest)

1. Convert your video to MP4 format (H.264 codec is best for web compatibility)
2. Name it `cabo-travel.mp4`
3. Upload it to the `client/public/` directory, replacing the existing file

### Option 2: Use a different video file

1. Upload your new video file to the `client/public/` directory
2. In `hero-section.tsx`, update the video source path:
   ```jsx
   <source src="/your-new-video.mp4" type="video/mp4" />
   ```

## Video Guidelines

For best performance:
- Keep file size under 10MB 
- Use MP4 format with H.264 encoding
- Resolution: 1920x1080 or 1280x720
- Duration: 10-30 seconds (will loop automatically)

## Fallback Image

If the video fails to load for any reason, the hero section will automatically display a fallback image. You can change this image by updating the `fallbackImage` URL in the hero-section.tsx file.