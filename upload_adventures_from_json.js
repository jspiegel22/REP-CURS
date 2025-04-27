// Import adventures from the JSON file to the server
import fs from 'fs';
import fetch from 'node-fetch';

const JSON_FILE = 'adventures_output.json';
const API_ENDPOINT = 'http://localhost:3000/api/adventures';
const LOGIN_ENDPOINT = 'http://localhost:3000/api/login';

// Read the JSON file
async function readAdventuresFromJson() {
  try {
    const jsonData = fs.readFileSync(JSON_FILE, 'utf8');
    const adventures = JSON.parse(jsonData);
    console.log(`Read ${adventures.length} adventures from ${JSON_FILE}`);
    return adventures;
  } catch (error) {
    console.error(`Error reading ${JSON_FILE}:`, error);
    return [];
  }
}

// Login to get auth cookie
async function login() {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'jefe',
        password: 'instacabo'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    
    return response.headers.get('set-cookie');
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Upload adventures to the server
async function uploadAdventures(adventures, authCookie) {
  console.log(`Uploading ${adventures.length} adventures to server...`);
  
  let createdCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const adventure of adventures) {
    try {
      // Format rating to one decimal place
      if (adventure.rating) {
        adventure.rating = Number(Number(adventure.rating).toFixed(1));
      }
      
      // First check if adventure already exists by slug
      const checkResponse = await fetch(`${API_ENDPOINT}?name=${encodeURIComponent(adventure.title)}`, {
        headers: { 'Cookie': authCookie }
      });
      
      const existingAdventures = await checkResponse.json();
      const existingAdventure = existingAdventures.find(a => a.title === adventure.title);
      
      if (existingAdventure) {
        // Update existing adventure
        console.log(`Adventure already exists: ${adventure.title}, updating...`);
        const updateResponse = await fetch(`${API_ENDPOINT}/${existingAdventure.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': authCookie
          },
          body: JSON.stringify(adventure)
        });
        
        if (updateResponse.ok) {
          updatedCount++;
          console.log(`Updated adventure: ${adventure.title}`);
        } else {
          errorCount++;
          console.error(`Error updating adventure ${adventure.title}: ${updateResponse.status}`);
        }
      } else {
        // Create new adventure
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': authCookie
          },
          body: JSON.stringify(adventure)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`Created adventure: ${result.title} (ID: ${result.id})`);
          createdCount++;
        } else {
          const errorText = await response.text();
          errorCount++;
          console.error(`Error creating adventure ${adventure.title}: ${response.status}`, errorText);
        }
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing adventure ${adventure.title}:`, error);
    }
    
    // Add a slight delay between requests to not overwhelm the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Upload summary: Created ${createdCount}, Updated ${updatedCount}, Errors ${errorCount}`);
  return { createdCount, updatedCount, errorCount };
}

// Main function
async function main() {
  try {
    console.log('Starting adventure upload process...');
    
    // Read adventures from JSON file
    const adventures = await readAdventuresFromJson();
    
    if (adventures.length === 0) {
      console.error('No adventures found in JSON file.');
      process.exit(1);
    }
    
    // Login to get auth cookie
    console.log('Logging in to server...');
    const authCookie = await login();
    
    if (!authCookie) {
      console.error('Failed to authenticate with the server.');
      process.exit(1);
    }
    
    // Upload adventures to the server
    await uploadAdventures(adventures, authCookie);
    
    console.log('Adventure upload process completed successfully.');
  } catch (error) {
    console.error('Fatal error in upload process:', error);
    process.exit(1);
  }
}

// Run the main function
main();