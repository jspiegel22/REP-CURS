import { Villa } from '@/types/villa';

// Complete CSV data from CABO VILLAS LIST
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puerto Los Cabos,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocean Views,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=2,https://www.cabovillas.com/Properties/Villas/Villa_California/FULL/Villa_California-1.jpg,CABO SAN LUCAS,Villa California,Relaxing Escape with Views of Cabo San Lucas,4-Star Deluxe Villa,,5,6,10
https://www.cabovillas.com/properties.asp?PID=202,https://www.cabovillas.com/Properties/Villas/Villa_Penasco/FULL/Villa_Penasco-1.jpg,"CABO SAN LUCAS, OCEANFRONT",Villa Peñasco,Lavishly Appointed Villa Overlooking the Pacific,6+ -Star Platinum Villa,+,6,6+,14`;

export function parseVillaData(data: string): Villa[] {
  const lines = data.split('\n')
    .slice(1) // Skip header
    .filter(line => line.trim() !== '');

  return lines.map((line, index) => {
    const [url, imageUrl, location, name, description, rating, _, bedrooms, bathrooms, maxGuests] = line.split(',');

    return {
      id: `villa-${index + 1}`,
      name: name.trim(), 
      description: description.trim(),
      location: location.trim(),
      rating: rating.trim(),
      imageUrl: imageUrl.trim(),
      url: url.trim(),
      bedrooms: parseInt(bedrooms) || 4,
      bathrooms: parseFloat(bathrooms.replace('+', '')) || 4,
      maxGuests: parseInt(maxGuests) || 10,
      isBeachfront: location.toLowerCase().includes('beachfront'),
      isOceanfront: location.toLowerCase().includes('oceanfront')
    };
  });
}

// Export the parsed villa data for use throughout the application
export const villas = parseVillaData(villaData);