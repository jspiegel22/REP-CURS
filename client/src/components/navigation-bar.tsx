import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiTiktok, SiInstagram, SiYoutube, SiWhatsapp, SiFacebook, SiPinterest } from "react-icons/si";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const stays = [
  { title: "Villas", href: "/villa", description: "Luxury private villas with stunning ocean views" },
  { title: "Resorts", href: "/resort", description: "World-class resorts and hotels" },
];

const adventures = [
  { title: "Luxury Sailing", href: "/adventures/luxury-sailing", description: "Private yacht charters and sailing experiences" },
  { title: "Private Yachts", href: "/adventures/private-yachts", description: "Exclusive yacht rentals for special occasions" },
  { title: "Whale Watching", href: "/adventures/whale-watching", description: "Unforgettable whale watching tours" },
];

const groupTrips = [
  { title: "Family Trips", href: "/group-trips/family", description: "Create lasting memories with your loved ones" },
  { title: "Bachelor/Bachelorette", href: "/group-trips/bachelor-bachelorette", description: "Unforgettable celebration packages" },
  { title: "Luxury Concierge", href: "/group-trips/luxury-concierge", description: "Personalized VIP experiences" },
  { title: "Influencer Partnerships", href: "/group-trips/influencer", description: "Exclusive partnerships for content creators" },
];

export default function NavigationBar() {
  return (
    <nav className="bg-[#2F4F4F] border-b border-[#2F4F4F]/20">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center">
          {/* Mobile Menu - Left */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] bg-[#2F4F4F] border-r border-[#2F4F4F]/20 p-0">
                <nav className="flex flex-col h-full overflow-y-auto">
                  {/* Mobile menu content */}
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-white/60 text-sm font-semibold">Stays</h3>
                      {stays.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block text-white hover:text-white/80 py-2">{item.title}</a>
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white/60 text-sm font-semibold">Adventures</h3>
                      {adventures.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block text-white hover:text-white/80 py-2">{item.title}</a>
                        </Link>
                      ))}
                    </div>
                    <Link href="/restaurants">
                      <a className="block text-white hover:text-white/80 py-2">Eats</a>
                    </Link>
                    <Link href="/weddings">
                      <a className="block text-white hover:text-white/80 py-2">Weddings</a>
                    </Link>
                    <div className="space-y-2">
                      <h3 className="text-white/60 text-sm font-semibold">Group Trips</h3>
                      {groupTrips.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block text-white hover:text-white/80 py-2">{item.title}</a>
                        </Link>
                      ))}
                    </div>
                    <Link href="/transportation">
                      <a className="block text-white hover:text-white/80 py-2">Transportation</a>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/">
              <a className="text-2xl font-bold text-white hover:text-white/80">@cabo</a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white bg-transparent">Stays</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {stays.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white bg-transparent">Adventures</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {adventures.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/restaurants">
                      <a className="text-white hover:text-white/80 px-4 py-2">Eats</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/weddings">
                      <a className="text-white hover:text-white/80 px-4 py-2">Weddings</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white bg-transparent">Group Trips</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {groupTrips.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/transportation">
                      <a className="text-white hover:text-white/80 px-4 py-2">Transportation</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Cart Button - Right */}
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="icon" className="text-white">
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}