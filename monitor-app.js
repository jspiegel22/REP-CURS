/**
 * App Monitoring Script
 * 
 * This script helps monitor if your Next.js app is running correctly on Replit
 * Run it alongside your application to see detailed status and troubleshooting info
 */

const http = require('http');
const os = require('os');

console.log('🔍 Starting Cabo App Monitoring...');
console.log('==================================');

// Check if port 5000 is responding (Replit port)
async function checkPort5000() {
  return new Promise(resolve => {
    console.log('Testing Replit port (5000)...');
    
    const req = http.get('http://localhost:5000/debug', res => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Port 5000 is UP! Response code: ${res.statusCode}`);
        console.log(`   Content length: ${data.length} bytes`);
        console.log('   This confirms the Replit port is working\n');
        resolve(true);
      });
    });
    
    req.on('error', err => {
      console.log(`❌ Port 5000 is DOWN: ${err.message}`);
      console.log('   This suggests the proxy server is not running\n');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Port 5000 timed out');
      console.log('   This suggests the proxy server is running but not responding\n');
      resolve(false);
    });
  });
}

// Check if port 3000 is responding (Next.js port)
async function checkPort3000() {
  return new Promise(resolve => {
    console.log('Testing Next.js port (3000)...');
    
    const req = http.get('http://localhost:3000/debug', res => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Port 3000 is UP! Response code: ${res.statusCode}`);
        console.log(`   Content length: ${data.length} bytes`);
        console.log('   This confirms Next.js is running correctly\n');
        resolve(true);
      });
    });
    
    req.on('error', err => {
      console.log(`❌ Port 3000 is DOWN: ${err.message}`);
      console.log('   This suggests Next.js is not running\n');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Port 3000 timed out');
      console.log('   This suggests Next.js is running but not responding\n');
      resolve(false);
    });
  });
}

// Check API health endpoint
async function checkHealthEndpoint() {
  return new Promise(resolve => {
    console.log('Testing API health endpoint...');
    
    const req = http.get('http://localhost:5000/api/health', res => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const health = JSON.parse(data);
            console.log('✅ Health API is UP!');
            console.log(`   Status: ${health.status}`);
            console.log(`   Uptime: ${Math.floor(health.uptime || 0)} seconds`);
            console.log(`   Message: ${health.message || 'No message provided'}\n`);
          } catch (e) {
            console.log('⚠️ Health API returned non-JSON response');
            console.log(`   Status code: ${res.statusCode}`);
            console.log(`   Data: ${data.substring(0, 100)}...\n`);
          }
        } else {
          console.log(`⚠️ Health API returned status: ${res.statusCode}`);
          console.log(`   Data: ${data.substring(0, 100)}...\n`);
        }
        resolve(res.statusCode === 200);
      });
    });
    
    req.on('error', err => {
      console.log(`❌ Health API is DOWN: ${err.message}`);
      console.log('   This suggests the API routes are not working properly\n');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Health API timed out');
      console.log('   This suggests the API is running but not responding\n');
      resolve(false);
    });
  });
}

// Print system info
function printSystemInfo() {
  console.log('System Information:');
  console.log(`• Platform: ${os.platform()} ${os.release()}`);
  console.log(`• Memory: ${Math.round(os.freemem() / 1024 / 1024)}MB free of ${Math.round(os.totalmem() / 1024 / 1024)}MB`);
  console.log(`• CPUs: ${os.cpus().length} cores`);
  console.log(`• Uptime: ${Math.floor(os.uptime() / 60)} minutes\n`);
}

// Run all checks
async function runAllChecks() {
  printSystemInfo();
  
  const port5000Up = await checkPort5000();
  const port3000Up = await checkPort3000();
  const healthUp = await checkHealthEndpoint();
  
  console.log('==================================');
  console.log('SUMMARY:');
  console.log(`• Replit Proxy (Port 5000): ${port5000Up ? '✅ WORKING' : '❌ NOT WORKING'}`);
  console.log(`• Next.js (Port 3000): ${port3000Up ? '✅ WORKING' : '❌ NOT WORKING'}`);
  console.log(`• API Health Endpoint: ${healthUp ? '✅ WORKING' : '❌ NOT WORKING'}`);
  console.log('==================================');
  
  if (port5000Up && port3000Up && healthUp) {
    console.log('🎉 All systems are operational!');
    console.log('   The application should be fully accessible in Replit webview');
  } else {
    console.log('⚠️ Some checks failed. Here are troubleshooting steps:');
    
    if (!port5000Up) {
      console.log('1. Make sure your workflow is running "node direct-port-5000-simple.js"');
      console.log('2. Check if there are any errors in the workflow console');
      console.log('3. Restart the workflow and try again');
    }
    
    if (!port3000Up) {
      console.log('1. Check if Next.js is actually running (look for "Ready" message)');
      console.log('2. Look for any build errors in the workflow console');
      console.log('3. If Next.js is running on a different port, update the proxy script');
    }
    
    if (!healthUp) {
      console.log('1. Verify the API health endpoint exists at /api/health');
      console.log('2. Check for API-specific errors in the workflow console');
      console.log('3. Try accessing other API endpoints to see if they work');
    }
  }
  
  console.log('\nMonitoring complete! Run this script again anytime to check system status.');
}

// Start the checks
runAllChecks();