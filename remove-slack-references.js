// Script to remove all Slack references from the codebase
const fs = require('fs');
const path = require('path');

// Files to check/modify
const filesToModify = [
  {
    path: path.join(__dirname, 'client/src/pages/admin/index.tsx'),
    patterns: [
      // Pattern to remove the entire Slack integration block
      {
        find: /\s*<div className="bg-white p-6 rounded-lg shadow">\s*<div className="flex items-center justify-between mb-4">\s*<div>\s*<h3 className="text-xl font-bold">Slack<\/h3>\s*<p className="text-muted-foreground">Connect to Slack for notifications<\/p>\s*<\/div>\s*<div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">\s*Not Connected\s*<\/div>\s*<\/div>\s*<div className="border-t pt-4">\s*<Button variant="outline" size="sm">\s*Connect\s*<\/Button>\s*<\/div>\s*<\/div>/g,
        replace: ''
      }
    ]
  },
  {
    path: path.join(__dirname, 'server/routes.ts'),
    patterns: [
      // Remove any Slack webhook/API endpoints
      {
        find: /\/\/ Slack webhook endpoint[\s\S]*?}\);/g,
        replace: '// Slack integration removed per user request'
      },
      {
        find: /import \{ WebClient \} from ['"]@slack\/web-api['"];?/g,
        replace: '// Slack integration removed'
      }
    ]
  },
  {
    path: path.join(__dirname, 'package.json'),
    patterns: [
      // We won't modify package.json as requested in the guidelines
    ]
  }
];

function modifyFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const pattern of patterns) {
    const originalContent = content;
    content = content.replace(pattern.find, pattern.replace);
    if (content !== originalContent) {
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Modified: ${filePath}`);
  } else {
    console.log(`No changes needed in: ${filePath}`);
  }
}

console.log('Removing Slack references from the codebase...');

for (const file of filesToModify) {
  modifyFile(file.path, file.patterns);
}

console.log('Slack removal process completed');