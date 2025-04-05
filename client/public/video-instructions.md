# Video Instructions

## Adding Videos to Your Website

### Supported Video Formats
- MP4 (.mp4) - Recommended for best browser compatibility
- WebM (.webm) - For better compression with modern browsers
- MOV (.mov) - For Apple QuickTime videos

### Video Guidelines
1. **Recommended Dimensions**: 
   - 16:9 aspect ratio (e.g., 1280x720, 1920x1080)
   - Maximum width: 1920px

2. **File Size**: 
   - Keep videos under 10MB for optimal loading performance
   - Compress larger videos using tools like Handbrake or online converters

3. **Duration**:
   - Promotional videos: 30-60 seconds
   - Destination showcase videos: 1-3 minutes
   - Tutorial videos: 3-5 minutes

### Adding Video to Your Website
1. Upload video files to the `client/public/` directory
2. Reference videos in components using the relative path: `/video-filename.mp4`
3. Always include a poster image for the video using SVG or JPG format
4. Include proper controls for play/pause and volume

### Example Video Component
```jsx
<div className="relative rounded-lg overflow-hidden shadow-md">
  <video 
    src="/video-filename.mp4"
    className="w-full h-auto"
    poster="/video-poster.svg"
    controls
    preload="metadata"
  ></video>
</div>
```

### Custom Video Controls Example
```jsx
<div className="relative rounded-lg overflow-hidden shadow-md">
  <video 
    ref={videoRef}
    src="/video-filename.mp4"
    className="w-full h-auto"
    poster="/video-poster.svg"
    preload="metadata"
  ></video>
  
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-between items-center">
    <button onClick={togglePlay} className="text-white">
      {isPlaying ? "Pause" : "Play"}
    </button>
    
    <button onClick={toggleMute} className="text-white">
      {isMuted ? "Unmute" : "Mute"}
    </button>
  </div>
</div>
```

### Optimizing Video Performance
1. Use lazy loading with the `loading="lazy"` attribute
2. Set `preload="metadata"` to avoid loading the full video immediately
3. Consider implementing a thumbnail grid for multiple videos
4. Use responsive video sizes with media queries for mobile devices

### Video Accessibility
1. Always include captions or subtitles when possible
2. Provide a transcript for longer videos
3. Ensure play/pause controls are accessible via keyboard
4. Add appropriate ARIA labels for custom video controls
