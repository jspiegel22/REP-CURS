# Hero Section YouTube Video Instructions

The hero section now includes a YouTube video embed that automatically plays (muted) below the CTA button.

## Current YouTube Video Setup

The hero section is configured to use the YouTube video with ID `02mzc-SyIYA` that you provided.

## How to Update the YouTube Video

If you want to use a different YouTube video:

1. Find the video ID in the YouTube URL (the part after `v=`)
   * Example: From `https://www.youtube.com/watch?v=02mzc-SyIYA`, the ID is `02mzc-SyIYA`

2. In the `hero-section.tsx` file, update the `youtubeVideoId` constant on line 9:
   ```javascript
   const youtubeVideoId = "YOUR_NEW_VIDEO_ID";
   ```

## YouTube Video Settings

The current embed includes these settings:
- Autoplay: Enabled (muted to comply with browser policies)
- Controls: Visible to let users adjust playback
- Loop: Enabled so the video plays continuously
- Related videos: Hidden to keep focus on your content
- Annotations: Disabled for a cleaner look
- Modestbranding: Enabled to minimize YouTube branding

## Background Image

The hero section still uses a beautiful background image that:
- Provides visual context while the video loads
- Ensures the section looks good even if the video fails to load
- Maintains a consistent brand experience

To change the background image, update the URL in the `backgroundImage` style property in `hero-section.tsx`.

## Fallback Display

If the YouTube video fails to load for any reason, a fallback display will appear with a button linking to the YouTube video directly.