const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse .env content
const envVars = envContent.split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => {
    const [key, value] = line.split('=');
    return { key, value };
  });

console.log('Environment Variables:');
console.log('=====================');
envVars.forEach(({ key, value }) => {
  console.log(`${key}: ${value ? '✅ Set' : '❌ Not set'}`);
}); 