import { Restaurant } from "../types/restaurant";

// Function to parse row from OpenTable CSV format
function parseOpenTableRow(row: string): Restaurant | null {
  try {
    const fields = row.split(',');
    if (fields.length < 10) return null;

    // Extract the ID from the name field which has format "1. Restaurant Name"
    const nameWithId = fields[2];
    const idMatch = nameWithId.match(/^(\d+)\./);
    const id = idMatch ? idMatch[1] : Math.random().toString(36).substr(2, 9);
    const name = nameWithId.replace(/^\d+\.\s*/, '').trim();

    // Parse price range and convert to $ format
    const priceMatch = fields[6].match(/Price: (.+)/);
    let priceRange = priceMatch ? priceMatch[1].trim() : 'Moderate';

    // Convert price range text to $ symbols
    switch (priceRange) {
      case 'Very Expensive':
        priceRange = '$$$$';
        break;
      case 'Expensive':
        priceRange = '$$$';
        break;
      case 'Moderate':
        priceRange = '$$';
        break;
      default:
        priceRange = '$';
    }

    // Parse review count from "(123)" format
    const reviewCountMatch = fields[5].match(/\((\d+)\)/);
    const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;

    // Parse bookings from "Booked X times today" format
    const bookingsMatch = fields[8].match(/Booked (\d+) times today/);
    const bookingsToday = bookingsMatch ? parseInt(bookingsMatch[1]) : 0;

    return {
      id,
      name,
      rating: fields[3].trim() || 'Not Rated',
      reviewCount,
      priceRange,
      cuisine: fields[7].split('•')[1]?.trim() || 'International',
      location: fields[7].split('•')[2]?.trim() || 'Cabo San Lucas',
      imageUrl: fields[1].trim(),
      bookingsToday,
      description: fields[10]?.trim() || '',
      openTableUrl: fields[0].trim(),
    };
  } catch (e) {
    console.error('Error parsing row:', e);
    return null;
  }
}

// Import OpenTable CSV data
const csvData1 = `BcjeJB9cJ4g- href,Y0i-tdDHWSI- src,FhfgYo4tTD0-,MLhGCA4nv6o-,XmafYPXEv24- href,XmafYPXEv24-,Vk-xtpOrXcE-,_4QF0cXfwR9Q-,gr6nnXdRSXE-,jP7I-nPDznk-,_6Po-6-slY2c-,l9bbXUdC9v0-,YFUbwTI869k-,_3JbEJDrCk58-,gr6nnXdRSXE- (2),ARuVZZIyuC4- href,ARuVZZIyuC4-,ARuVZZIyuC4- href (2),ARuVZZIyuC4- (2),ARuVZZIyuC4- href (3),ARuVZZIyuC4- (3),ARuVZZIyuC4- href (4),ARuVZZIyuC4- (4),AtRRdZc8GD4- src,ARuVZZIyuC4- href (5),ARuVZZIyuC4- (5)
https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas?corrid=00890699-fab7-4ff7-98b7-f082ee6d01ba&avt=eyJ2IjoyLCJtIjoxLCJwIjoxLCJzIjowLCJuIjowfQ&p=2&sd=2025-03-12T19%3A00%3A00,https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg,1. Bagatelle Los Cabos,Awesome,https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas?corrid=00890699-fab7-4ff7-98b7-f082ee6d01ba&avt=eyJ2IjoyLCJtIjoxLCJwIjoxLCJzIjowLCJuIjowfQ&p=2&sd=2025-03-12T19%3A00%3A00#reviews,(99),Price: Very Expensive,• International • Cabo San Lucas,Booked 16 times today,Find next available,"Its all about the atmoshphere and service. They provide it all. The food was delicious, and presented beautifully. We even enjoyed hooka for the table and dancing on the chairs. Its not just dining, its an event to experience.",Read more,,,,,,,,,,,,,`;

const csvData2 = `BcjeJB9cJ4g- href,Y0i-tdDHWSI- src,FhfgYo4tTD0-,MLhGCA4nv6o-,XmafYPXEv24- href,XmafYPXEv24-,Vk-xtpOrXcE-
https://www.opentable.com/r/salvatore-g-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/xlarge/3/47402198.jpg,3. Salvatore G,Exceptional,(542),Price: Very Expensive,• Italian • Cabo San Lucas,Booked 25 times today,"Classic Italian with a modern twist. Amazing pasta made in-house daily.",Read more`;

const csvData3 = `BcjeJB9cJ4g- href,Y0i-tdDHWSI- src,FhfgYo4tTD0-,MLhGCA4nv6o-,XmafYPXEv24- href,XmafYPXEv24-,Vk-xtpOrXcE-
https://www.opentable.com/r/sunset-monalisa-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/xlarge/2/47401799.jpg,4. Sunset Monalisa,Exceptional,(1102),Price: Very Expensive,• Mediterranean • Cabo San Lucas,Booked 30 times today,"Breathtaking views of the Arch and Sea of Cortez. Mediterranean cuisine at its finest.",Read more`;

const csvData4 = `BcjeJB9cJ4g- href,Y0i-tdDHWSI- src,FhfgYo4tTD0-,MLhGCA4nv6o-,XmafYPXEv24- href,XmafYPXEv24-,Vk-xtpOrXcE-
https://www.opentable.com/r/la-roca-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/xlarge/1/47402001.jpg,5. La Roca,Exceptional,(891),Price: Very Expensive,• Contemporary Mexican • Cabo San Lucas,Booked 18 times today,"Farm to table Mexican cuisine with ocean views. Fresh local ingredients and innovative cocktails.",Read more`;

// Parse all CSV data and remove duplicates by name
const allRestaurants = [csvData1, csvData2, csvData3, csvData4]
  .map(csv => csv.split('\n')
    .filter(row => row.trim())
    .map(parseOpenTableRow)
    .filter((r): r is Restaurant => r !== null)
  )
  .flat();

// Remove duplicates by name, keeping the one with more reviews
const uniqueRestaurants = allRestaurants.reduce((acc, curr) => {
  const existing = acc.find(r => r.name === curr.name);
  if (!existing) {
    acc.push(curr);
  } else if (curr.reviewCount > existing.reviewCount) {
    // Replace with the more reviewed version
    acc.splice(acc.indexOf(existing), 1, curr);
  }
  return acc;
}, [] as Restaurant[]);

// Featured restaurants that should appear at the top
const featuredRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "NOBU Los Cabos",
    rating: "Exceptional",
    reviewCount: 542,
    priceRange: "$$$$",
    cuisine: "Japanese",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/2/48528566.jpg",
    bookingsToday: 25,
    description: "World-renowned Japanese cuisine infused with local Mexican ingredients. Spectacular ocean views complement Chef Nobu's innovative dishes.",
    openTableUrl: "https://www.opentable.com/r/nobu-los-cabos"
  },
  {
    id: "2",
    name: "El Farallon",
    rating: "Exceptional",
    reviewCount: 1102,
    priceRange: "$$$$",
    cuisine: "Seafood",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/3/48615988.jpg",
    bookingsToday: 30,
    description: "Suspended over the Pacific Ocean on a cliff, offering the day's freshest catch and an unforgettable dining experience.",
    openTableUrl: "https://www.opentable.com/r/el-farallon-waldorf-astoria-los-cabos-pedregal-cabo-san-lucas"
  }
];

// Combine featured restaurants with parsed data
export const restaurants: Restaurant[] = [
  ...featuredRestaurants,
  ...uniqueRestaurants
];

// Update cuisine types based on all available restaurants
export const cuisineTypes = Array.from(
  new Set(restaurants.map(r => r.cuisine))
).sort();

// Price range options
export const priceRanges = ["$", "$$", "$$$", "$$$$"];

// Helper function to filter restaurants based on user preferences
export const filterRestaurants = (filters: {
  cuisine?: string;
  priceRange?: string;
  searchQuery?: string;
}) => {
  return restaurants.filter(restaurant => {
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) return false;
    if (filters.priceRange && restaurant.priceRange !== filters.priceRange) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });
};