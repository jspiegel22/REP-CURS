# Hero Video Instructions

## Option 1: Using a Local Video File

1. Convert your .mov file to .mp4 format for better browser compatibility
2. Name it `hero-video.mp4` and place it in this directory (client/public/)
3. In `hero-section.tsx`, set the videoUrl to "/hero-video.mp4"

## Option 2: Using Google Drive

1. Upload your video to Google Drive
2. Right-click → Get shareable link
3. Make sure permissions are set to "Anyone with the link can view"
4. Get the file ID from the URL (the part after /d/ in the URL)
5. In `hero-section.tsx`, use this format:
   ```
   const videoUrl = "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID";
   ```

## Option 3: Using a Video Service (Recommended for Production)

1. Upload your video to a service like Vimeo or YouTube
2. Use their embed code in the page