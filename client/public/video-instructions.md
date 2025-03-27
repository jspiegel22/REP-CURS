# Hero Video Instructions

The hero section supports three different video source options. To switch between them, modify the `videoSource` value in `hero-section.tsx`.

## Option 1: Using a Local Video File (VideoSource.LocalFile)

1. Convert your .mov file to .mp4 format for better browser compatibility
2. Place your video in this directory (client/public/)
3. In `hero-section.tsx`, update the `localVideoUrl` constant with your filename
4. Set `const videoSource = VideoSource.LocalFile;`

## Option 2: Using YouTube Embed (VideoSource.YouTube) - RECOMMENDED

1. Upload your video to YouTube
2. Get the video ID from the URL (the part after `v=` in the URL)
   * Example: From `https://www.youtube.com/watch?v=02mzc-SyIYA`, the ID is `02mzc-SyIYA`
3. In `hero-section.tsx`, update the `youtubeVideoId` constant with your video ID
4. Set `const videoSource = VideoSource.YouTube;`

## Option 3: Using Google Drive (VideoSource.GoogleDrive)

1. Upload your video to Google Drive
2. Right-click → Get shareable link
3. Make sure permissions are set to "Anyone with the link can view"
4. Get the file ID from the URL (the part after /d/ in the URL)
5. In `hero-section.tsx`, update the `driveVideoUrl` constant:
   ```
   const driveVideoUrl = "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID";
   ```
6. Set `const videoSource = VideoSource.GoogleDrive;`

## Current Configuration

The hero section is currently configured to use the YouTube video embed as the source (most reliable and best performance).