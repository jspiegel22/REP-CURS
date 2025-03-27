#!/bin/bash

# This script helps upload a video file to the public directory
# Usage: ./upload-video.sh <source_file> <destination_name>

SOURCE_FILE=$1
DEST_NAME=${2:-"hero-video.mp4"}
DEST_PATH="client/public/$DEST_NAME"

if [ -z "$SOURCE_FILE" ]; then
  echo "Error: Source file path required"
  echo "Usage: ./upload-video.sh <source_file> <destination_name>"
  exit 1
fi

# Check if file exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "Error: Source file not found: $SOURCE_FILE"
  exit 1
fi

# Copy the file to public directory
cp "$SOURCE_FILE" "$DEST_PATH"

if [ $? -eq 0 ]; then
  echo "Success! Video uploaded to $DEST_PATH"
  echo ""
  echo "To use this video in the hero section, update the videoUrl in hero-section.tsx to:"
  echo "const videoUrl = \"/$DEST_NAME\";"
else
  echo "Error: Failed to upload video"
  exit 1
fi