const fs = require('fs');

// Simple test to check if guide files exist
function checkGuideFiles() {
  console.log('Checking for guide files...');
  
  const pdfPath = './client/public/guides/ultimate-cabo-guide-2025.pdf';
  const htmlPath = './client/public/guides/ultimate-cabo-guide-2025.html';
  
  // Check PDF
  if (fs.existsSync(pdfPath)) {
    console.log(`✅ Guide PDF found at ${pdfPath}`);
    const stats = fs.statSync(pdfPath);
    console.log(`PDF size: ${stats.size} bytes`);
  } else {
    console.log(`❌ Guide PDF not found at ${pdfPath}`);
  }
  
  // Check HTML version
  if (fs.existsSync(htmlPath)) {
    console.log(`✅ Guide HTML version found at ${htmlPath}`);
    const stats = fs.statSync(htmlPath);
    console.log(`HTML size: ${stats.size} bytes`);
  } else {
    console.log(`❌ Guide HTML version not found at ${htmlPath}`);
  }
  
  // Check general guides directory
  const guidesDir = './client/public/guides';
  if (fs.existsSync(guidesDir)) {
    console.log(`\n📁 Contents of ${guidesDir}:`);
    const files = fs.readdirSync(guidesDir);
    
    if (files.length === 0) {
      console.log('   (directory is empty)');
    } else {
      files.forEach(file => {
        const filePath = `${guidesDir}/${file}`;
        const stats = fs.statSync(filePath);
        console.log(`   ${file} (${stats.size} bytes)`);
      });
    }
  } else {
    console.log(`\n❌ Guides directory not found at ${guidesDir}`);
  }
}

// Run the check
checkGuideFiles();