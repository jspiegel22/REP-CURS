import { Villa } from '@/types/villa';

// Complete CSV data from CABO VILLAS LIST.csv
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocean Views,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=2,https://www.cabovillas.com/Properties/Villas/Villa_California/FULL/Villa_California-1.jpg,CABO SAN LUCAS,Villa California,Relaxing Escape with Views of Cabo San Lucas,4-Star Deluxe Villa,,5,6,10
https://www.cabovillas.com/properties.asp?PID=202,https://www.cabovillas.com/Properties/Villas/Villa_Penasco/FULL/Villa_Penasco-1.jpg,"CABO SAN LUCAS, OCEANFRONT",Villa Peñasco,Lavishly Appointed Villa Overlooking the Pacific,6+ -Star Platinum Villa,+,6,6+,14
https://www.cabovillas.com/properties.asp?PID=296,https://www.cabovillas.com/Properties/Villas/Villa_Ladrillo/FULL/Villa_Ladrillo-1.jpg,CABO SAN LUCAS,Villa Ladrillo,Great Cabo San Lucas Location & Pacific Ocean Views,4-Star Deluxe Villa,,4,4,8
https://www.cabovillas.com/properties.asp?PID=512,https://www.cabovillas.com/Properties/Villas/Casa_Bella_Vista_by_Waldorf_Astoria_Los_Cabos_Pedregal/FULL/Casa_Bella_Vista_by_Waldorf_Astoria_Los_Cabos_Pedregal-1.jpg,CABO SAN LUCAS,Casa Bella Vista by Waldorf Astoria Los Cabos Pedregal,Gorgeous Marina & Bay Views with Luxury Resort Amenities,6+ -Star Platinum Villa,+,3,3.5,7
https://www.cabovillas.com/properties.asp?PID=627,https://www.cabovillas.com/Properties/Villas/Tortuga_Bay_Penthouse_2401/FULL/Tortuga_Bay_Penthouse_2401-1.jpg,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Tortuga Bay Penthouse 2401,Beachfront Luxury with Sweeping Ocean Views,5-Star Luxury Villa,,3,3,6
https://www.cabovillas.com/properties.asp?PID=140,https://www.cabovillas.com/Properties/Villas/Villa_Marcella/FULL/Villa_Marcella-1.jpg,"CABO SAN LUCAS, OCEANFRONT, BEACHFRONT",Villa Marcella,Luxury Beach Front Estate,6-Star Premier Villa,,5,6.5,14
https://www.cabovillas.com/properties.asp?PID=622,https://www.cabovillas.com/Properties/Villas/Casa_Kay/FULL/Casa_Kay-1.jpg,SAN JOSÉ DEL CABO,Casa Kay,"Luxury, Golf & Ocean Views at Puerto Los Cabos",5-Star Luxury Villa,,8,9,16
https://www.cabovillas.com/properties.asp?PID=608,https://www.cabovillas.com/Properties/Villas/Villa_Bella_Vida/FULL/Villa_Bella_Vida-1.jpg,SAN JOSÉ DEL CABO,Villa Bella Vida,Luxury & Ocean Views near Excellent Golf,5.5-Star Luxury Villa,,6,5.5,14
https://www.cabovillas.com/properties.asp?PID=629,https://www.cabovillas.com/Properties/Villas/Casa_Aqua_Blanca/FULL/Casa_Aqua_Blanca-1.jpg,CORRIDOR,Casa Aqua Blanca,Modern Luxury with Ocean Views & Waterslides,6-Star Premier Villa,,7,7,14
https://www.cabovillas.com/properties.asp?PID=79,https://www.cabovillas.com/Properties/Villas/Villa_las_Flores/FULL/Villa_las_Flores-1.jpg,CABO SAN LUCAS,Villa las Flores,Expansive Pacific Ocean Views & Elegant Style,6-Star Premier Villa,,7,7.5,18
https://www.cabovillas.com/properties.asp?PID=653,https://www.cabovillas.com/Properties/Villas/Villa_de_Lam/FULL/Villa_de_Lam-1.jpg,CABO SAN LUCAS,Villa de Lam,Spacious Modern Escape in Pedregal,5.5-Star Luxury Villa,,6,6,16
https://www.cabovillas.com/properties.asp?PID=641,https://www.cabovillas.com/Properties/Villas/Casa_JoJo/FULL/Casa_JoJo-1.jpg,CORRIDOR,Casa JoJo,Golf Course Views & Hacienda Style Luxury,6-Star Premier Villa,,7,7+,14
https://www.cabovillas.com/properties.asp?PID=666,https://www.cabovillas.com/Properties/Villas/Casa_Bellamar_de_Cabo_Colorado/FULL/Casa_Bellamar_de_Cabo_Colorado-1.jpg,CORRIDOR,Casa Bellamar de Cabo Colorado,"Luxury & Views, Walking Distance to Beach",6-Star Premier Villa,,4,4.5,10
https://www.cabovillas.com/properties.asp?PID=326,https://www.cabovillas.com/Properties/Villas/Villa_Buena_Vista/FULL/Villa_Buena_Vista-1.jpg,CABO SAN LUCAS,Villa Buena Vista,Captivating Pedregal Villa with Views of Mari...,4.5-Star Deluxe Villa,,4,4.5,10
https://www.cabovillas.com/properties.asp?PID=242,https://www.cabovillas.com/Properties/Villas/Villa_Cerca_del_Cielo/FULL/Villa_Cerca_del_Cielo-1.jpg,CABO SAN LUCAS,Villa Cerca del Cielo,A Taste of Heaven at this Ocean-View Villa in...,5-Star Luxury Villa,,6,6.5,12
https://www.cabovillas.com/properties.asp?PID=377,https://www.cabovillas.com/Properties/Villas/Casa_Cielo_at_Pedregal/FULL/Casa_Cielo_at_Pedregal-1.jpg,CABO SAN LUCAS,Casa Cielo at Pedregal,Stunning Ocean Views & Exceptional Amenities,6-Star Premier Villa,,10,11.5,20
https://www.cabovillas.com/properties.asp?PID=521,https://www.cabovillas.com/Properties/Villas/Villa_Perla/FULL/Villa_Perla-1.jpg,CABO SAN LUCAS,Villa Perla,An Amazing Ocean View Retreat Located in the ...,5-Star Luxury Villa,,5,5.5,14
https://www.cabovillas.com/properties.asp?PID=23,https://www.cabovillas.com/Properties/Villas/Villa_Grande/FULL/Villa_Grande-1.jpg,"CABO SAN LUCAS, OCEANFRONT",Villa Grande,Exquisite Mediterranean Style Villa with Swee...,6-Star Premier Villa,,6,7.5,14
https://www.cabovillas.com/properties.asp?PID=559,https://www.cabovillas.com/Properties/Villas/Villa_de_Suenos/FULL/Villa_de_Suenos-1.jpg,SAN JOSÉ DEL CABO,Villa de Sueños,Breathtaking Luxury Villa with Amazing Views,6-Star Premier Villa,,5,6.5,10
https://www.cabovillas.com/properties.asp?PID=225,https://www.cabovillas.com/Properties/Villas/Villa_Turquesa/FULL/Villa_Turquesa-1.jpg,"CABO SAN LUCAS, OCEANFRONT",Villa Turquesa,Spectacular Cliffside Platinum Villa Overlook...,6+ -Star Platinum Villa,+,10,11+,28
https://www.cabovillas.com/properties.asp?PID=227,https://www.cabovillas.com/Properties/Villas/Villa_de_la_Playa/FULL/Villa_de_la_Playa-1.jpg,"CORRIDOR, OCEANFRONT, BEACHFRONT",Villa de la Playa,Beachfront Pool Terrace Overlooking the Sea o...,5.5-Star Luxury Villa,,6,6.5,12
https://www.cabovillas.com/properties.asp?PID=541,https://www.cabovillas.com/Properties/Villas/Villa_Fiesta/FULL/Villa_Fiesta-1.jpg,CABO SAN LUCAS,Villa Fiesta,Relaxing Pedregal Villa - Just a Short Walk t...,4.5-Star Deluxe Villa,,5,5.5,10
https://www.cabovillas.com/properties.asp?PID=519,https://www.cabovillas.com/Properties/Villas/Villa_Mar_Azul/FULL/Villa_Mar_Azul-1.jpg,CABO SAN LUCAS,Villa Mar Azul,Views of The Bay & The Marina from this Priva...,4-Star Deluxe Villa,,3,3.5,8
https://www.cabovillas.com/properties.asp?PID=574,https://www.cabovillas.com/Properties/Villas/Villa_Colorado/FULL/Villa_Colorado-1.jpg,CABO SAN LUCAS,Villa Colorado,Walk to the Marina from this Impeccable Villa,4-Star Deluxe Villa,,3,2.5,7
https://www.cabovillas.com/properties.asp?PID=640,https://www.cabovillas.com/Properties/Villas/Villa_Perdiz/FULL/Villa_Perdiz-1.jpg,CORRIDOR,Villa Perdiz,Ocean Views on 7th Hole at The Cove,6-Star Premier Villa,,4,4,8`;

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