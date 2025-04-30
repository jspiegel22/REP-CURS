#!/bin/bash

# Script to generate the sitemap.xml file
echo "Generating sitemap.xml file..."

# Run the TypeScript file using tsx
npx tsx scripts/generate-sitemap.ts

# Check if the script ran successfully
if [ $? -eq 0 ]; then
  echo "✅ Sitemap generation completed successfully!"
else
  echo "❌ Sitemap generation failed!"
  exit 1
fi