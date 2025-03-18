import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const mainMenuItems = [
  {
    title: "VILLAS",
    href: "/villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
  },
  {
    title: "RESORTS",
    href: "/resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  },
  {
    title: "YACHTS",
    href: "/adventures/luxury-sailing",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
  },
  {
    title: "ADVENTURES",
    href: "/adventures",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
  }
];

const gridMenuItems = [
  {
    title: "BACHELOR/ETTE",
    href: "/group-trips/bachelor-bachelorette",
    image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31"
  },
  {
    title: "RESTAURANTS",
    href: "/restaurants",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88"
  },
  {
    title: "LOCAL EVENTS",
    href: "/events",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
  },
  {
    title: "REAL ESTATE",
    href: "/real-estate",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  },
  {
    title: "GUIDES",
    href: "/guides",
    image: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af"
  },
  {
    title: "LUXURY CONCIERGE",
    href: "/group-trips/luxury-concierge",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e"
  }
];

const bottomRowItems = [
  {
    title: "INFLUENCERS",
    href: "/group-trips/influencer",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113"
  },
  {
    title: "WORK WITH US",
    href: "/work-with-us",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    title: "WEDDINGS",
    href: "/weddings",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f"
  }
];

const stays = [
  {
    title: "Villas",
    href: "/villa",
    description: "Luxury private villas with stunning ocean views",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
  },
  {
    title: "Resorts",
    href: "/resort",
    description: "World-class resorts and hotels",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  },
  {
    title: "Real Estate",
    href: "/real-estate",
    description: "Find your dream property in Cabo",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  }
];

const adventures = [
  {
    title: "Luxury Sailing",
    href: "/adventures/luxury-sailing",
    description: "Private yacht charters and sailing experiences",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
  },
  {
    title: "Private Yachts",
    href: "/adventures/private-yachts",
    description: "Exclusive yacht rentals for special occasions",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
  },
  {
    title: "Whale Watching",
    href: "/adventures/whale-watching",
    description: "Unforgettable whale watching tours",
    image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8"
  }
];

const groupTrips = [
  {
    title: "Family Trips",
    href: "/group-trips/family",
    description: "Create lasting memories with your loved ones",
    image: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa"
  },
  {
    title: "Bachelor/Bachelorette",
    href: "/group-trips/bachelor-bachelorette",
    description: "Unforgettable celebration packages",
    image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31"
  },
  {
    title: "Luxury Concierge",
    href: "/group-trips/luxury-concierge",
    description: "Personalized VIP experiences",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e"
  }
];

const socialLinks = [
  { icon: SiTiktok, href: "https://www.tiktok.com/@atcabo", label: "TikTok" },
  { icon: SiInstagram, href: "https://instagram.com/cabo", label: "Instagram" },
  { icon: SiYoutube, href: "https://www.youtube.com/@atCabo", label: "YouTube" },
  { icon: SiWhatsapp, href: "https://wa.me/526242446303", label: "WhatsApp" },
  { icon: SiFacebook, href: "https://www.facebook.com/cabosanlucasbaja", label: "Facebook" },
  { icon: SiPinterest, href: "https://www.pinterest.com/instacabo/", label: "Pinterest" }
];

const NavigationBar = () => {
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
                {/* Larger Close Button with Background */}
                <div className="absolute right-4 top-4">
                  <button className="bg-white rounded-lg p-2 shadow-sm border">
                    <X className="h-12 w-12 text-black" />
                  </button>
                </div>

                <nav className="flex flex-col h-full overflow-y-auto">
                  {/* Nike-style mobile menu with image tiles */}
                  <div className="p-3">
                    {/* Main Menu Items - Full Width */}
                    <div className="grid grid-cols-1 gap-2">
                      {mainMenuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block">
                            <div className="relative h-32 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center">
                                <span className="text-white text-xl font-semibold px-4">{item.title}</span>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>

                    {/* Grid Menu Items - 2x3 Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {gridMenuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block">
                            <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-2">
                                <span className="text-white text-xs font-semibold px-1">{item.title}</span>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Row - 3x1 Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {bottomRowItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="block">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-2">
                                <span className="text-white text-xs font-semibold px-1">{item.title}</span>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>

                    {/* Social Media Links */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-center space-x-6">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2F4F4F] hover:text-[#1F3F3F] transition-colors"
                          >
                            <social.icon size={20} />
                          </a>
                        ))}
                      </div>
                    </div>
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
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">STAYS</NavigationMenuTrigger>
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
                  <NavigationMenuLink asChild>
                    <Link href="/restaurants">
                      <a className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2">EATS</a>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">ADVENTURES</NavigationMenuTrigger>
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
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">GROUP TRIPS</NavigationMenuTrigger>
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
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent">MORE</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/events">
                            <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87" alt="Events" className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">Local Events</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">Discover what's happening in Cabo</p>
                              </div>
                            </a>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/guides">
                            <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src="https://images.unsplash.com/photo-1516546453174-5e1098a4b4af" alt="Guides" className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">Guides</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">Expert tips and local insights</p>
                              </div>
                            </a>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/weddings">
                            <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f" alt="Weddings" className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">Weddings</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">Plan your dream destination wedding</p>
                              </div>
                            </a>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/work-with-us">
                            <a className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978" alt="Work with Us" className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">Work with Us</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">Join our network of partners</p>
                              </div>
                            </a>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
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
};

export default NavigationBar;