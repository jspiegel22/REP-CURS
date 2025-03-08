import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VillaCard } from "@/components/villa-card";
import { Villa, parseVillaData } from "@/types/villa";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Import complete CSV data from the assets
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg?width=486,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocea...,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg?width=486,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=2,https://www.cabovillas.com/Properties/Villas/Villa_California/FULL/Villa_California-1.jpg?width=486,CABO SAN LUCAS,Villa California,Relaxing Escape with Views of Cabo San Lucas ...,4-Star Deluxe Villa,,5,6,10
https://www.cabovillas.com/properties.asp?PID=202,https://www.cabovillas.com/Properties/Villas/Villa_Penasco/FULL/Villa_Penasco-1.jpg?width=486,"CABO SAN LUCAS, OCEANFRONT",Villa Peñasco,Lavishly Appointed Villa Overlooking the Paci...,6+ -Star Platinum Villa,+,6,6+,14
https://www.cabovillas.com/properties.asp?PID=296,https://www.cabovillas.com/Properties/Villas/Villa_Ladrillo/FULL/Villa_Ladrillo-1.jpg?width=486,CABO SAN LUCAS,Villa Ladrillo,Great Cabo San Lucas Location & Pacific Ocean...,4-Star Deluxe Villa,,4,4,8
https://www.cabovillas.com/properties.asp?PID=512,https://www.cabovillas.com/Properties/Villas/Casa_Bella_Vista_by_Waldorf_Astoria_Los_Cabos_Pedregal/FULL/Casa_Bella_Vista_by_Waldorf_Astoria_Los_Cabos_Pedregal-1.jpg?width=486,CABO SAN LUCAS,Casa Bella Vista by Waldorf Astoria Los Cabos Pedregal,Gorgeous Marina & Bay Views with Luxury Resor...,6+ -Star Platinum Villa,+,3,3.5,7
https://www.cabovillas.com/properties.asp?PID=627,https://www.cabovillas.com/Properties/Villas/Tortuga_Bay_Penthouse_2401/FULL/Tortuga_Bay_Penthouse_2401-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Tortuga Bay Penthouse 2401,Beachfront Luxury with Sweeping Ocean Views,5-Star Luxury Villa,,3,3,6
https://www.cabovillas.com/properties.asp?PID=140,https://www.cabovillas.com/Properties/Villas/Villa_Marcella/FULL/Villa_Marcella-1.jpg?width=486,"CABO SAN LUCAS, OCEANFRONT, BEACHFRONT",Villa Marcella,Luxury Beach Front Estate,6-Star Premier Villa,,5,6.5,14
https://www.cabovillas.com/properties.asp?PID=622,https://www.cabovillas.com/Properties/Villas/Casa_Kay/FULL/Casa_Kay-1.jpg?width=486,SAN JOSÉ DEL CABO,Casa Kay,"Luxury, Golf & Ocean Views at Puerto Los Cabo...",5-Star Luxury Villa,,8,9,16
https://www.cabovillas.com/properties.asp?PID=608,https://www.cabovillas.com/Properties/Villas/Villa_Bella_Vida/FULL/Villa_Bella_Vida-1.jpg?width=486,SAN JOSÉ DEL CABO,Villa Bella Vida,Luxury & Ocean Views near Excellent Golf,5.5-Star Luxury Villa,,6,5.5,14
https://www.cabovillas.com/properties.asp?PID=629,https://www.cabovillas.com/Properties/Villas/Casa_Aqua_Blanca/FULL/Casa_Aqua_Blanca-1.jpg?width=486,CORRIDOR,Casa Aqua Blanca,Modern Luxury with Ocean Views & Waterslides ...,6-Star Premier Villa,,7,7,14
https://www.cabovillas.com/properties.asp?PID=79,https://www.cabovillas.com/Properties/Villas/Villa_las_Flores/FULL/Villa_las_Flores-1.jpg?width=486,CABO SAN LUCAS,Villa las Flores,Expansive Pacific Ocean Views & Elegant Style,6-Star Premier Villa,,7,7.5,18
https://www.cabovillas.com/properties.asp?PID=653,https://www.cabovillas.com/Properties/Villas/Villa_de_Lam/FULL/Villa_de_Lam-1.jpg?width=486,CABO SAN LUCAS,Villa de Lam,Spacious Modern Escape in Pedregal,5.5-Star Luxury Villa,,6,6,16
https://www.cabovillas.com/properties.asp?PID=641,https://www.cabovillas.com/Properties/Villas/Casa_JoJo/FULL/Casa_JoJo-1.jpg?width=486,CORRIDOR,Casa JoJo,Golf Course Views & Hacienda Style Luxury,6-Star Premier Villa,,7,7+,14
https://www.cabovillas.com/properties.asp?PID=666,https://www.cabovillas.com/Properties/Villas/Casa_Bellamar_de_Cabo_Colorado/FULL/Casa_Bellamar_de_Cabo_Colorado-1.jpg?width=486,CORRIDOR,Casa Bellamar de Cabo Colorado,"Luxury & Views, Walking Distance to Beach",6-Star Premier Villa,,4,4.5,10
https://www.cabovillas.com/properties.asp?PID=326,https://www.cabovillas.com/Properties/Villas/Villa_Buena_Vista/FULL/Villa_Buena_Vista-1.jpg?width=486,CABO SAN LUCAS,Villa Buena Vista,Captivating Pedregal Villa with Views of Mari...,4.5-Star Deluxe Villa,,4,4.5,10
https://www.cabovillas.com/properties.asp?PID=242,https://www.cabovillas.com/Properties/Villas/Villa_Cerca_del_Cielo/FULL/Villa_Cerca_del_Cielo-1.jpg?width=486,CABO SAN LUCAS,Villa Cerca del Cielo,A Taste of Heaven at this Ocean-View Villa in...,5-Star Luxury Villa,,6,6.5,12
https://www.cabovillas.com/properties.asp?PID=377,https://www.cabovillas.com/Properties/Villas/Casa_Cielo_at_Pedregal/FULL/Casa_Cielo_at_Pedregal-1.jpg?width=486,CABO SAN LUCAS,Casa Cielo at Pedregal,,6-Star Premier Villa,,10,11.5,20
https://www.cabovillas.com/properties.asp?PID=521,https://www.cabovillas.com/Properties/Villas/Villa_Perla/FULL/Villa_Perla-1.jpg?width=486,CABO SAN LUCAS,Villa Perla,An Amazing Ocean View Retreat Located in the ...,5-Star Luxury Villa,,5,5.5,14
https://www.cabovillas.com/properties.asp?PID=23,https://www.cabovillas.com/Properties/Villas/Villa_Grande/FULL/Villa_Grande-1.jpg?width=486,"CABO SAN LUCAS, OCEANFRONT",Villa Grande,Exquisite Mediterranean Style Villa with Swee...,6-Star Premier Villa,,6,7.5,14
https://www.cabovillas.com/properties.asp?PID=559,https://www.cabovillas.com/Properties/Villas/Villa_de_Suenos/FULL/Villa_de_Suenos-1.jpg?width=486,SAN JOSÉ DEL CABO,Villa de Sueños,Breathtaking Luxury Villa with Amazing Views,6-Star Premier Villa,,5,6.5,10
https://www.cabovillas.com/properties.asp?PID=225,https://www.cabovillas.com/Properties/Villas/Villa_Turquesa/FULL/Villa_Turquesa-1.jpg?width=486,"CABO SAN LUCAS, OCEANFRONT",Villa Turquesa,Spectacular Cliffside Platinum Villa Overlook...,6+ -Star Platinum Villa,+,10,11+,28
https://www.cabovillas.com/properties.asp?PID=227,https://www.cabovillas.com/Properties/Villas/Villa_de_la_Playa/FULL/Villa_de_la_Playa-1.jpg?width=486,"CORRIDOR, OCEANFRONT, BEACHFRONT",Villa de la Playa,Beachfront Pool Terrace Overlooking the Sea o...,5.5-Star Luxury Villa,,6,6.5,12
https://www.cabovillas.com/properties.asp?PID=519,https://www.cabovillas.com/Properties/Villas/Villa_Mar_Azul/FULL/Villa_Mar_Azul-1.jpg?width=486,CABO SAN LUCAS,Villa Mar Azul,Views of The Bay & The Marina from this Priva...,4-Star Deluxe Villa,,3,3.5,8
https://www.cabovillas.com/properties.asp?PID=574,https://www.cabovillas.com/Properties/Villas/Villa_Colorado/FULL/Villa_Colorado-1.jpg?width=486,CABO SAN LUCAS,Villa Colorado,Walk to the Marina from this Impeccable Villa,4-Star Deluxe Villa,,3,2.5,7
https://www.cabovillas.com/properties.asp?PID=640,https://www.cabovillas.com/Properties/Villas/Villa_Perdiz/FULL/Villa_Perdiz-1.jpg?width=486,CORRIDOR,Villa Perdiz,Ocean Views on 7th Hole at The Cove,6-Star Premier Villa,,4,4,8
https://www.cabovillas.com/properties.asp?PID=468,https://www.cabovillas.com/Properties/Villas/The_Residences_at_Hacienda_Encantada/FULL/The_Residences_at_Hacienda_Encantada-1.jpg?width=486,CORRIDOR,The Residences at Hacienda Encantada,Perfect Combination of Villa Charm & Resort A...,5-Star Luxury Villa,,3,4.5,10
https://www.cabovillas.com/properties.asp?PID=581,https://www.cabovillas.com/Properties/Villas/Villa_Tanzanita_de_Law/FULL/Villa_Tanzanita_de_Law-1.jpg?width=486,CABO SAN LUCAS,Villa Tanzanita de Law,Spectacular Views and Modern Luxury,5.5-Star Luxury Villa,,9,9.5,28
https://www.cabovillas.com/properties.asp?PID=665,https://www.cabovillas.com/Properties/Villas/Residence_101_-_102_Playa_De_La_Paz/FULL/Residence_101_-_102_Playa_De_La_Paz-1.jpg?width=486,LA PAZ,Residence 101 - 102 Playa De La Paz,La Paz Luxury & Sea of Cortez Views,5-Star Luxury Villa,,4,6,10
https://www.cabovillas.com/properties.asp?PID=100,https://www.cabovillas.com/Properties/Villas/Villa_Agave_Azul/FULL/Villa_Agave_Azul-1.jpg?width=486,CORRIDOR,Villa Agave Azul,Hacienda Style Elegance - Golf & Ocean Views,5-Star Luxury Villa,,5,5.5,10
https://www.cabovillas.com/properties.asp?PID=628,https://www.cabovillas.com/Properties/Villas/Las_Olas_Penthouse_A501/FULL/Las_Olas_Penthouse_A501-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Las Olas Penthouse A501,Spectacular Views at Zipper's Beach,4-Star Deluxe Villa,,3,2,6
https://www.cabovillas.com/properties.asp?PID=378,https://www.cabovillas.com/Properties/Villas/Villa_Vista_del_Mar/FULL/Villa_Vista_del_Mar-1.jpg?width=486,"CORRIDOR, SAN JOSÉ DEL CABO",Villa Vista del Mar,Impressive Hillside Villa Boasting Gorgeous O...,5.5-Star Luxury Villa,,4,5.5,8
https://www.cabovillas.com/properties.asp?PID=173,https://www.cabovillas.com/Properties/Villas/Villa_Cortez/FULL/Villa_Cortez-1.jpg?width=486,"CORRIDOR, OCEANFRONT",Villa Cortez,Spacious Luxury Oceanfront Villa Steps to Gre...,6-Star Premier Villa,,5,6,10
https://www.cabovillas.com/properties.asp?PID=537,https://www.cabovillas.com/Properties/Villas/Villa_Danzeland/FULL/Villa_Danzeland-1.jpg?width=486,CABO SAN LUCAS,Villa Danzeland,Vibrant Pedregal Villa with Impressive Ocean ...,4.5-Star Deluxe Villa,,3,4,10`;

const villas = parseVillaData(villaData);

const ITEMS_PER_PAGE = 12;

export default function VillasLanding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'beachfront' | 'oceanfront'>('all');

  const filteredVillas = villas.filter(villa => {
    if (filter === 'beachfront') return villa.isBeachfront;
    if (filter === 'oceanfront') return villa.isOceanfront;
    return true;
  });

  const totalPages = Math.ceil(filteredVillas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedVillas = filteredVillas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Luxury Villas in Cabo San Lucas</h1>
              <p className="text-xl">Discover our handpicked collection of stunning villas with breathtaking ocean views.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      <div className="container mx-auto px-4 py-4 text-sm text-muted-foreground">
        <p>Total Villas: {villas.length}</p>
        <p>Filtered Villas: {filteredVillas.length}</p>
        <p>Current Page: {currentPage}</p>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Villas
          </Button>
          <Button 
            variant={filter === 'beachfront' ? 'default' : 'outline'}
            onClick={() => setFilter('beachfront')}
          >
            Beachfront
          </Button>
          <Button 
            variant={filter === 'oceanfront' ? 'default' : 'outline'}
            onClick={() => setFilter('oceanfront')}
          >
            Oceanfront
          </Button>
        </div>

        {/* Villa Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedVillas.map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(p => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}