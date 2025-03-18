import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const stays = [
  { 
    title: "Villas", 
    href: "/villa", 
    description: "Luxury private villas with stunning ocean views",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=150"
  },
  { 
    title: "Resorts", 
    href: "/resort", 
    description: "World-class resorts and hotels",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150"
  },
];

const adventures = [
  { 
    title: "Luxury Sailing", 
    href: "/adventures/luxury-sailing", 
    description: "Private yacht charters and sailing experiences",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=150"
  },
  { 
    title: "Private Yachts", 
    href: "/adventures/private-yachts", 
    description: "Exclusive yacht rentals for special occasions",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=150"
  },
  { 
    title: "Whale Watching", 
    href: "/adventures/whale-watching", 
    description: "Unforgettable whale watching tours",
    image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=150"
  },
];

const groupTrips = [
  { 
    title: "Family Trips", 
    href: "/group-trips/family", 
    description: "Create lasting memories with your loved ones",
    image: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=150"
  },
  { 
    title: "Bachelor/Bachelorette", 
    href: "/group-trips/bachelor-bachelorette", 
    description: "Unforgettable celebration packages",
    image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31?w=150"
  },
  { 
    title: "Luxury Concierge", 
    href: "/group-trips/luxury-concierge", 
    description: "Personalized VIP experiences",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=150"
  },
];

export default function NavigationBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center">
          {/* Mobile Menu - Left */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#2F4F4F]">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] bg-white p-0">
                <nav className="flex flex-col h-full overflow-y-auto">
                  {/* Nike-style mobile menu with image tiles */}
                  <div className="p-4 space-y-4">
                    {/* Stays Section */}
                    <div className="space-y-4">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811"
                          alt="Stays"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center">
                          <span className="text-white text-xl font-semibold px-4">Stays</span>
                        </div>
                      </div>
                      {stays.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">{item.title}</a>
                        </Link>
                      ))}
                    </div>

                    {/* Adventures Section */}
                    <div className="space-y-4">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
                          alt="Adventures"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center">
                          <span className="text-white text-xl font-semibold px-4">Adventures</span>
                        </div>
                      </div>
                      {adventures.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">{item.title}</a>
                        </Link>
                      ))}
                    </div>

                    {/* Group Trips Section */}
                    <div className="space-y-4">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1541956064527-8ec10ac76c31"
                          alt="Group Trips"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center">
                          <span className="text-white text-xl font-semibold px-4">Group Trips</span>
                        </div>
                      </div>
                      {groupTrips.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">{item.title}</a>
                        </Link>
                      ))}
                    </div>

                    {/* Other Links */}
                    <Link href="/restaurants">
                      <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">Restaurants</a>
                    </Link>
                    <Link href="/weddings">
                      <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">Weddings</a>
                    </Link>
                    <Link href="/work-with-us">
                      <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">Work with Us</a>
                    </Link>
                    <Link href="/group-trips/influencer">
                      <a className="block text-[#2F4F4F] hover:text-[#1F3F3F] py-2">Influencers</a>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/">
              <a className="text-2xl font-bold text-[#2F4F4F] hover:text-[#1F3F3F]">@cabo</a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">Stays</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4">
                      {stays.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                                <div>
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                                </div>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">Adventures</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4">
                      {adventures.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                                <div>
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                                </div>
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
                      <a className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2">Restaurants</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/weddings">
                      <a className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2">Weddings</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/group-trips/influencer">
                      <a className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2">Influencers</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">Group Trips</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4">
                      {groupTrips.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                                <div>
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                                </div>
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
                    <Link href="/work-with-us">
                      <a className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2">Work with Us</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Cart Button - Right */}
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="icon" className="text-[#2F4F4F]">
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}