// Script to add Azimut Yacht to the adventures collection
// Using direct database access via execute_sql_tool
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAzimutYacht() {
  try {
    console.log('Starting to add Azimut Yacht adventure...');
    
    // Create the Azimut Yacht adventure
    const azimutYachtData = {
      title: "Azimut 68ft Luxury Yacht Charter",
      slug: "azimut-68ft-luxury-yacht-charter",
      description: `Step aboard the iconic Azimut 68ft Yacht and experience the ultimate luxury yacht charter in Cabo San Lucas. With its sleek Italian design and world-class amenities, this yacht is your gateway to the turquoise waters of the Sea of Cortez, famously known as the Aquarium of the World.

We offer a private yacht rental experience unlike any other, complete with gourmet cuisine, an open bar, and breathtaking coastal views. Your unforgettable Cabo adventure begins here.

## LUXURY AZIMUT 68 FT YACHT CHARTER IN CABO SAN LUCAS

Step into refined elegance aboard the Azimut 68ft, a masterpiece of Italian craftsmanship designed for ultimate comfort and style. Perfect for private events, romantic getaways, or unforgettable celebrations with friends and family, this luxury yacht features spacious interiors, a stunning flybridge, elegant cabins, and an expansive sun deck ideal for soaking in the Cabo sunshine.

Whether you're cruising along the iconic Arch, snorkeling in the crystal-clear waters of Santa María Bay, or enjoying a sunset dinner at sea, every detail of your charter is curated to perfection by the Papillon Yachts team.

## KEY FEATURES:
- Air conditioned
- 2 VIP Cabins
- 3 bathrooms
- Spacious living room
- Luxury Interiors
- Sunbathing area
- Dining table
- Fly Bridge

## INCLUSIONS:
- Roundtrip Transportation
- Bilingual & Friendly Crew
- Unlimited Open Bar (Rum, Tequila, Vodka, Beer, Juices, Sodas, Mixers, Water)
- Food Menu (Ceviche, Mix fajitas, Guacamole, Pico de gallo, Chips, Fruit platter)
- Water Toys (1 paddle board, Large floating mat, Complete snorkel gear, Life vests)

## WHAT TO BRING:
- Sunscreen
- Phone to play music (optional)
- Swimsuits, hats, sunglasses

## PRICING:
- 3-Hours: $3,650 USD for 1 to 12 guests
- Extra Guest: $100 USD per guest (max. cap. 30 guests)
- Extra Hour: $1,000 USD per extra hour
- Special 2-Hour Sunset Cruise: From $2,690 USD for 1-12 guests`,
      currentPrice: "$3,650",
      originalPrice: "$4,200",
      discount: "13% OFF",
      duration: "3 Hours",
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
        "Private luxury yacht charter",
        "Italian craftsmanship",
        "Complimentary transportation",
        "Gourmet food included",
        "Open bar included",
        "Professional crew",
        "Snorkeling equipment provided",
        "Special sunset cruise option available"
      ],
      thingsToBring: [
        "Sunscreen",
        "Swimsuit",
        "Sunglasses",
        "Hat",
        "Camera",
        "Light jacket (for evening cruises)"
      ],
      topRecommended: true,
      rating: 4.9,
      featured: true,
      hidden: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the adventure record in the database
    const adventure = await prisma.adventures.create({
      data: azimutYachtData
    });
    
    console.log(`Successfully created Azimut Yacht adventure with ID: ${adventure.id}`);
    console.log('Adventure details:', adventure);
    
    return adventure;
  } catch (error) {
    console.error('Error adding Azimut Yacht adventure:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
addAzimutYacht()
  .then(() => console.log('Completed adding Azimut Yacht adventure'))
  .catch(err => console.error('Script failed:', err));