import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function addAzimutYacht() {
  try {
    // Login to get the auth cookie
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'jefe',
        password: 'cabofeed2023',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }

    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Login successful');

    // Create the yacht adventure data
    const yachtData = {
      title: "Azimut 68ft Luxury Yacht Charter",
      slug: "azimut-68ft-luxury-yacht-charter",
      description: `# Azimut 68ft Luxury Yacht Charter

Embark on the ultimate luxury experience aboard our stunning Azimut 68ft yacht. This premium vessel combines Italian craftsmanship with extraordinary amenities to create the perfect day at sea in Cabo San Lucas.

## The Ultimate Luxury Experience

The Azimut 68ft yacht features expansive entertainment areas, including a spacious flybridge with panoramic views, elegant salon, and multiple sunbathing areas. With its sleek design and powerful engines, this yacht provides both comfort and performance.

## Inclusive Amenities

* Professional captain and crew
* Premium open bar
* Gourmet lunch or dinner options
* Snorkeling equipment
* Paddleboards and water toys
* Bluetooth sound system
* Air-conditioned interior
* Fresh water shower

## Route Options

Choose from several popular routes:
- Lands End & Arch Tour with swimming at Pelican Rock
- Santa Maria and Chileno Bay for premier snorkeling
- Cabo Pulmo Marine Park (full-day charters only)
- Custom routes available upon request

## Capacity and Options

Perfect for groups of up to 16 passengers. Available for half-day (4 hours), full-day (8 hours), or sunset cruises (2.5 hours).

Book this extraordinary Azimut yacht for your next celebration, family gathering, or romantic escape in Cabo San Lucas.`,
      currentPrice: "$2,800",
      originalPrice: "$3,200",
      discount: "15% OFF",
      duration: "4-8 hours",
      imageUrl: "/yachts/azimut-yacht-main.jpg",
      imageUrls: [
        "/yachts/azimut-yacht-1.jpg",
        "/yachts/azimut-yacht-2.jpg",
        "/yachts/azimut-yacht-3.jpg",
        "/yachts/azimut-yacht-4.jpg",
        "/yachts/azimut-yacht-5.jpg"
      ],
      minAge: "All ages",
      provider: "Papillon Yachts",
      category: "yacht",
      keyFeatures: [
        "Luxury 68ft Yacht",
        "Premium Open Bar",
        "Professional Crew",
        "Gourmet Food",
        "Snorkeling Equipment",
        "Paddle Boards",
        "Bluetooth Sound System",
        "Air Conditioning"
      ],
      thingsToBring: [
        "Swimwear",
        "Towel",
        "Sunscreen",
        "Sunglasses",
        "Camera",
        "Light jacket (for evening cruises)"
      ],
      topRecommended: true,
      rating: 5,
      featured: true,
      hidden: false
    };

    // Send the POST request to create the adventure
    const response = await fetch('http://localhost:3000/api/adventures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      body: JSON.stringify(yachtData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add yacht: ${response.statusText}`);
    }

    const adventure = await response.json();
    console.log('Yacht added successfully:', adventure);
    return adventure;
  } catch (error) {
    console.error('Error adding yacht adventure:', error);
    throw error;
  }
}

// Execute the function
addAzimutYacht()
  .then(() => console.log('Script completed successfully.'))
  .catch(err => console.error('Script failed:', err));