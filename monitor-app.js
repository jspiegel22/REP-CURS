/**
 * App Monitoring Script
 * 
 * This script helps monitor if your Next.js app is running correctly on Replit
 * Run it alongside your application to see detailed status and troubleshooting info
 */

const http = require('http');
const os = require('os');

async function checkPort5000() {
  console.log('\n📡 Checking if port 5000 is responding...');
  
  return new Promise((resolve) => {
    const req = http.request({
      method: 'GET',
      hostname: 'localhost',
      port: 5000,
      path: '/',
      timeout: 5000
    }, (res) => {
      console.log(`✅ Port 5000 is responding with status code: ${res.statusCode}`);
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`   Response size: ${data.length} bytes`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error connecting to port 5000: ${err.message}`);
      console.log('   This means Replit cannot see your application.');
      console.log('   Check if the proxy server is running correctly.');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Connection to port 5000 timed out');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function checkPort3000() {
  console.log('\n📡 Checking if Next.js is responding on port 3000...');
  
  return new Promise((resolve) => {
    const req = http.request({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/',
      timeout: 5000
    }, (res) => {
      console.log(`✅ Next.js is running on port 3000 with status code: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error connecting to Next.js on port 3000: ${err.message}`);
      console.log('   This means your Next.js application is not running.');
      console.log('   Check your npm scripts and server logs.');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Connection to port 3000 timed out');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function checkHealthEndpoint() {
  console.log('\n📡 Checking API health endpoint...');
  
  return new Promise((resolve) => {
    const req = http.request({
      method: 'GET',
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      timeout: 5000
    }, (res) => {
      console.log(`Health endpoint status code: ${res.statusCode}`);
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Health response: ${data}`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error connecting to health endpoint: ${err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Health endpoint timed out');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

function printSystemInfo() {
  console.log('\n💻 System Information:');
  console.log(`   Node.js version: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Memory: ${Math.round(os.totalmem() / (1024 * 1024))} MB total, ${Math.round(os.freemem() / (1024 * 1024))} MB free`);
  console.log(`   CPU cores: ${os.cpus().length}`);
  
  console.log('\n🔍 Environment Variables:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   PORT: ${process.env.PORT || 'not set'}`);
  
  console.log('\n🔄 Troubleshooting Tips:');
  console.log('   1. Check if port 5000 is open and responding (needed for Replit)');
  console.log('   2. Check if Next.js is running successfully on port 3000');
  console.log('   3. Check Replit workflow configuration is correct');
  console.log('   4. Make sure to use "node replit-direct.js" in the workflow');
}

async function runAllChecks() {
  console.log('🔍 Starting application diagnostic checks...');
  
  await checkPort5000();
  await checkPort3000();
  await checkHealthEndpoint();
  
  printSystemInfo();
  
  console.log('\n✅ Diagnostic check complete!');
  console.log('   If you still have issues, try:');
  console.log('   1. Restarting the workflow');
  console.log('   2. Manually running "node replit-direct.js" in the Shell tab');
  console.log('   3. Checking the logs in the Console tab');
}

runAllChecks();