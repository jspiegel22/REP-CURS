/**
 * Dependency Checker for Replit Entry
 * This script verifies all dependencies are installed for the replit-entry.js script
 */

console.log('📦 Checking required dependencies for replit-entry.js...');

const dependencies = [
  'http-proxy',
  'child_process',
  'http',
];

let missingDeps = [];
let hasAllDeps = true;

for (const dep of dependencies) {
  try {
    if (dep === 'child_process' || dep === 'http') {
      // These are built-in Node.js modules, so they should always be available
      continue;
    }
    
    require(dep);
    console.log(`✅ ${dep} is installed`);
  } catch (error) {
    console.error(`❌ ${dep} is missing`);
    missingDeps.push(dep);
    hasAllDeps = false;
  }
}

if (!hasAllDeps) {
  console.log('\n⚠️ Some dependencies are missing. Install them with:');
  console.log(`npm install ${missingDeps.join(' ')}`);
  process.exit(1);
} else {
  console.log('\n🚀 All dependencies are installed! You can run:');
  console.log('node replit-entry.js');
}