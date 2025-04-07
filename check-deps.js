/**
 * Dependency Checker for Replit Entry
 * This script verifies all dependencies are installed for the replit-entry.js script
 */

const fs = require('fs').promises;
const { execSync } = require('child_process');

console.log('🔍 Checking dependencies for Replit entry script...');

// Required Node.js modules
const requiredModules = [
  'http',
  'child_process',
  'net',
  'fs'
];

// Check if a Node.js module is available
function checkNodeModule(moduleName) {
  try {
    require(moduleName);
    console.log(`✅ Node module '${moduleName}' is available`);
    return true;
  } catch (err) {
    console.error(`❌ Node module '${moduleName}' is NOT available: ${err.message}`);
    return false;
  }
}

// Check if npm is working
function checkNpm() {
  try {
    const version = execSync('npm --version').toString().trim();
    console.log(`✅ npm is available (${version})`);
    return true;
  } catch (err) {
    console.error(`❌ npm is NOT available: ${err.message}`);
    return false;
  }
}

// Check if the package.json file exists and contains the expected scripts
async function checkPackageJson() {
  try {
    const data = await fs.readFile('package.json', 'utf8');
    const pkg = JSON.parse(data);
    
    console.log('✅ package.json is valid JSON');
    
    if (pkg.scripts && pkg.scripts.dev) {
      console.log(`✅ package.json has 'dev' script: ${pkg.scripts.dev}`);
      return true;
    } else {
      console.error('❌ package.json is missing the required "dev" script');
      return false;
    }
  } catch (err) {
    console.error(`❌ Error reading package.json: ${err.message}`);
    return false;
  }
}

// Check if the replit-entry.js file exists
async function checkEntryScript() {
  try {
    await fs.access('replit-entry.js');
    console.log('✅ replit-entry.js file exists');
    return true;
  } catch (err) {
    console.error('❌ replit-entry.js file does NOT exist');
    return false;
  }
}

// Check if direct-port-5000-simple.js file exists
async function checkSimpleScript() {
  try {
    await fs.access('direct-port-5000-simple.js');
    console.log('✅ direct-port-5000-simple.js file exists');
    return true;
  } catch (err) {
    console.error('❌ direct-port-5000-simple.js file does NOT exist');
    return false;
  }
}

// Run all checks
async function runChecks() {
  console.log('==================================');
  
  // Check Node.js modules
  let allModulesOk = true;
  for (const module of requiredModules) {
    const moduleOk = checkNodeModule(module);
    allModulesOk = allModulesOk && moduleOk;
  }
  
  console.log('==================================');
  
  // Check npm
  const npmOk = checkNpm();
  
  console.log('==================================');
  
  // Check package.json
  const packageJsonOk = await checkPackageJson();
  
  console.log('==================================');
  
  // Check entry scripts
  const entryScriptOk = await checkEntryScript();
  const simpleScriptOk = await checkSimpleScript();
  
  console.log('==================================');
  console.log('SUMMARY:');
  console.log(`• Node.js modules: ${allModulesOk ? '✅ OK' : '❌ Issues detected'}`);
  console.log(`• npm: ${npmOk ? '✅ OK' : '❌ Issues detected'}`);
  console.log(`• package.json: ${packageJsonOk ? '✅ OK' : '❌ Issues detected'}`);
  console.log(`• Entry scripts: ${entryScriptOk && simpleScriptOk ? '✅ OK' : '❌ Issues detected'}`);
  console.log('==================================');
  
  const allOk = allModulesOk && npmOk && packageJsonOk && entryScriptOk && simpleScriptOk;
  
  if (allOk) {
    console.log('🎉 All dependencies are satisfied! You can run:');
    console.log('   • node replit-entry.js');
    console.log('   • node direct-port-5000-simple.js');
  } else {
    console.log('⚠️ Some dependencies are missing. Please fix the issues above.');
  }
}

// Run the checks
runChecks();