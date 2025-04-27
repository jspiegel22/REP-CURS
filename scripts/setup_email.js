/**
 * Email Configuration Setup Script
 * 
 * This script allows easy configuration of email settings without editing code.
 * It updates the .env file with new SMTP credentials and tests the connection.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for input with default value
function prompt(question, defaultValue) {
  return new Promise(resolve => {
    const fullQuestion = defaultValue 
      ? `${question} [${defaultValue}]: ` 
      : `${question}: `;
    
    rl.question(fullQuestion, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Update .env file with new values
function updateEnvFile(updates) {
  try {
    const envPath = path.resolve('.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Process each update
    for (const [key, value] of Object.entries(updates)) {
      // Check if the key already exists in the file
      const regex = new RegExp(`^${key}=.*`, 'm');
      
      if (regex.test(envContent)) {
        // Update existing key
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        // Add new key at the end
        envContent += `\n${key}=${value}`;
      }
    }
    
    // Write back to file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    return false;
  }
}

// Test SMTP connection
async function testSmtpConnection(host, port, secure, user, pass) {
  try {
    console.log(`\nTesting SMTP connection to ${host}:${port}...`);
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: secure === 'true',
      auth: { user, pass }
    });
    
    // Verify connection
    await transporter.verify();
    
    console.log('✅ SMTP connection successful!');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
}

// Main function
async function setupEmail() {
  console.log('\n=== Email Configuration Setup ===\n');
  
  // Display current configuration
  console.log('Current Configuration:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Not configured');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || '587');
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'false');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'Not configured');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '********' : 'Not configured');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'jeff@instacabo.com');
  
  // Prompt for new values
  console.log('\nEnter new configuration (press Enter to keep current value):');
  
  const host = await prompt('SMTP Host', process.env.SMTP_HOST || 'smtp.gmail.com');
  const port = await prompt('SMTP Port', process.env.SMTP_PORT || '587');
  const secure = await prompt('SMTP Secure (true/false)', process.env.SMTP_SECURE || 'false');
  const user = await prompt('SMTP Username', process.env.SMTP_USER || '');
  const pass = await prompt('SMTP Password', process.env.SMTP_PASS || '');
  const adminEmail = await prompt('Admin Email', process.env.ADMIN_EMAIL || 'jeff@instacabo.com');
  
  // Test connection if credentials are provided
  let connectionSuccess = false;
  if (host && user && pass) {
    connectionSuccess = await testSmtpConnection(host, port, secure, user, pass);
  } else {
    console.log('\n⚠️ Incomplete SMTP configuration, skipping connection test.');
  }
  
  // Confirm changes
  const confirmSave = await prompt(`\nSave these settings${connectionSuccess ? ' (connection test passed)' : ''}? (yes/no)`, 'yes');
  
  if (confirmSave.toLowerCase() === 'yes') {
    const updates = {
      SMTP_HOST: host,
      SMTP_PORT: port,
      SMTP_SECURE: secure,
      SMTP_USER: user,
      SMTP_PASS: pass,
      ADMIN_EMAIL: adminEmail
    };
    
    if (updateEnvFile(updates)) {
      console.log('\n✅ Email configuration updated successfully.');
      console.log('The new settings will be used for all future emails.');
      
      if (connectionSuccess) {
        const sendTest = await prompt('Send a test email now? (yes/no)', 'yes');
        
        if (sendTest.toLowerCase() === 'yes') {
          // Create test transporter
          const transporter = nodemailer.createTransport({
            host,
            port: parseInt(port),
            secure: secure === 'true',
            auth: { user, pass }
          });
          
          // Send test email
          try {
            const info = await transporter.sendMail({
              from: `Cabo San Lucas <${user}>`,
              to: adminEmail,
              subject: 'SMTP Configuration Test',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                  <div style="background-color: #2F4F4F; padding: 15px; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">SMTP Configuration Test</h1>
                  </div>
                  <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                    <p>This is a test email sent from your Cabo San Lucas website.</p>
                    <p>Your SMTP configuration is working correctly!</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                  </div>
                </div>
              `
            });
            
            console.log('✅ Test email sent successfully!');
            console.log('Message ID:', info.messageId);
          } catch (error) {
            console.error('❌ Error sending test email:', error.message);
          }
        }
      }
    }
  } else {
    console.log('\n⚠️ Configuration not saved.');
  }
  
  // Close readline interface
  rl.close();
}

// Execute the setup
setupEmail();