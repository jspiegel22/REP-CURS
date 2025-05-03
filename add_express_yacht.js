import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// Get current file directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate a slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Save yacht images to public directory
async function saveYachtImages() {
  // Create directory for yacht images if it doesn't exist
  const yachtDir = path.join('public', 'yachts', 'express-bay-liner');
  if (!fs.existsSync(yachtDir)) {
    fs.mkdirSync(yachtDir, { recursive: true });
  }
  
  // Main yacht image
  const mainImageUrl = 'https://static.wixstatic.com/media/34140b_b8f12edadb574d2db9e57d9848591d1c~mv2.jpg';
  const mainImagePath = path.join(yachtDir, 'main.jpg');
  
  // Additional yacht images - exterior
  const exteriorImages = [
    'https://static.wixstatic.com/media/34140b_3e7776cb902d481e836075a7b683bc3a~mv2.jpg',
    'https://static.wixstatic.com/media/34140b_0713f6f6d85841bf9eeb9a58bcf4f3f7~mv2.jpg',
    'https://static.wixstatic.com/media/34140b_9e33818058594e4f908f83432a06117d~mv2.jpg'
  ];
  
  // Additional yacht images - interior
  const interiorImages = [
    'https://static.wixstatic.com/media/34140b_10da8ae3d4004c6195a1bfadf303f48b~mv2.jpeg',
    'https://static.wixstatic.com/media/34140b_09e6a6f46a2c4f86894db2effabac27a~mv2.jpeg',
    'https://static.wixstatic.com/media/34140b_d37ef11b1254400fa3789863049c092a~mv2.jpeg'
  ];
  
  const allImages = [mainImageUrl, ...exteriorImages, ...interiorImages];
  const imagePaths = [];
  
  // Download and save all images
  for (let i = 0; i < allImages.length; i++) {
    const imageUrl = allImages[i];
    const imagePath = i === 0 ? mainImagePath : path.join(yachtDir, `image-${i}.jpg`);
    
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const imageBuffer = await response.buffer();
      fs.writeFileSync(imagePath, imageBuffer);
      
      // Convert absolute path to relative path for website
      const relativePath = imagePath.replace(/^public/, '');
      imagePaths.push(relativePath);
      
      console.log(`Saved image: ${relativePath}`);
    } catch (error) {
      console.error(`Error saving image from ${imageUrl}:`, error);
    }
  }
  
  return imagePaths;
}

// Main function to add the yacht adventure
async function addExpressYacht() {
  try {
    // First, save the images
    const imagePaths = await saveYachtImages();
    
    if (imagePaths.length === 0) {
      throw new Error('Failed to save yacht images');
    }
    
    // Prepare yacht data
    const expressYacht = {
      title: "EXPRESS BAY LINER 35FT",
      slug: generateSlug("EXPRESS BAY LINER 35FT"),
      description: `Step aboard the Express Bay Liner 35ft, a luxurious yacht cruiser in Cabo designed for relaxation and adventure. This 35-foot beauty features spacious front bed seating, a stylish dining area, a fully equipped kitchen, bedroom, and bathroom, everything you need for a perfect day on the water. With an open bar and gourmet dining included, you can indulge while taking in the breathtaking views of Cabo San Lucas.

Whether it's a romantic escape, a family outing, or a fun day with friends, this yacht EXPRESS 35 in Cabo offers an unforgettable experience.

## LUXURY YACHT CHARTER EXPERIENCE IN CABO

Embark on a captivating journey with the 35Ft Yacht, a proud highlight of the Papillon Yachts Rentals fleet. This luxurious yacht is your gateway to the stunning landscapes and azure waters of Los Cabos. As you navigate the picturesque coastline, the yacht's sleek design and smooth handling ensure a tranquil and enjoyable voyage.

Onboard the 35Ft Yacht Cruiser, every detail is crafted to enhance your sailing experience. The yacht's interior is a haven of luxury, featuring plush seating, modern amenities, and a sophisticated ambiance. Whether you are seeking a romantic getaway, a family excursion, or a day of relaxation with friends, this yacht provides the perfect setting. Its intimate size makes it ideal for more personal and exclusive adventures, allowing you to create lasting memories as you explore hidden gems along the coast.

## INCLUSIONS

Your yacht rental includes:
- 3 hours (plus transportation time)
- Private round-trip transportation
- Bilingual & certified friendly crew
- Unlimited open bar (Rum, Tequila, Vodka, Beer, Juices, Sodas, Mixers, Water)
- Food menu (Cheese quesadillas, Guacamole, Pico de gallo, Chips, Fruit platter)
- Water toys (1 paddle board, Large floating mat, Complete snorkel gear, Life vests)

## ACTIVITIES INCLUDED

Your yacht rental includes optional activities such as a private snorkeling tour, visit to the arch, lovers beach and all the rock formations in the way. As this is a private tour, you're able to decide if you would like to spend more time swimming or cruising in the amazing Sea of Cortez.`,
      currentPrice: "$990",
      originalPrice: "$1,100",
      discount: "10% OFF",
      duration: "3 Hours",
      imageUrl: imagePaths[0],
      imageUrls: imagePaths.slice(1),
      minAge: "All Ages",
      provider: "Papillon Yachts",
      category: "yacht",
      keyFeatures: [
        "One bedroom",
        "One bathroom",
        "Interior dining table",
        "Shaded back seating with table",
        "Front seating/sun bathing area",
        "Unlimited open bar",
        "Food included",
        "Private transportation",
        "Certified crew",
        "Snorkel equipment"
      ],
      thingsToBring: [
        "Towels",
        "Sunscreen",
        "Swimsuits",
        "Hats",
        "Sunglasses"
      ],
      topRecommended: true,
      rating: 4.9,
      featured: true,
      hidden: false
    };
    
    // Get auth cookie for admin access
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'jefe',
        password: 'cabo2022'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }
    
    const cookies = loginResponse.headers.get('set-cookie');
    
    // Add the yacht adventure
    const addResponse = await fetch('http://localhost:3000/api/adventures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify(expressYacht)
    });
    
    if (!addResponse.ok) {
      const errorData = await addResponse.json();
      throw new Error(`Failed to add yacht: ${JSON.stringify(errorData)}`);
    }
    
    const result = await addResponse.json();
    console.log('Successfully added Express Bay Liner 35ft yacht!');
    console.log(result);
    
  } catch (error) {
    console.error('Error adding Express Bay Liner yacht:', error);
  }
}

// Run the script
addExpressYacht();