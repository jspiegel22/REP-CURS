import { useState } from "react";
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
    title: "STAYS",
    href: "/stays",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
  },
  {
    title: "ADVENTURES",
    href: "/adventures",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
  },
  {
    title: "GROUP TRIPS",
    href: "/group-trips",
    image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31"
  },
  {
    title: "BLOG",
    href: "/blog",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
  }
];

const stays = [
  {
    title: "Luxury Villas",
    href: "/villas",
    description: "Exclusive private villas with stunning ocean views",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
  },
  {
    title: "Resorts",
    href: "/resorts",
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
    title: "All Adventures",
    href: "/adventures",
    description: "Explore all our exciting adventures",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
  },
  {
    title: "ATV Tours",
    href: "/adventures/atv",
    description: "Thrilling desert and mountain adventures",
    image: "https://images.unsplash.com/photo-1623176035122-4e07bc19bab7"
  },
  {
    title: "Private Yachts",
    href: "/adventures/private-yachts",
    description: "Luxury yacht charters and experiences",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
  },
  {
    title: "Whale Watching",
    href: "/adventures/whale-watching",
    description: "Unforgettable whale watching experiences",
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
    title: "Corporate Events",
    href: "/group-trips/corporate",
    description: "Presidents club, celebrations and corporate outings",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72"
  },
  {
    title: "Luxury Concierge",
    href: "/group-trips/luxury-concierge",
    description: "Personalized VIP experiences",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e"
  },
  {
    title: "Influencer Trips",
    href: "/group-trips/influencer",
    description: "Special packages for content creators",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113"
  }
];

const moreMenuItems = [
  {
    title: "Real Estate",
    href: "/real-estate",
    description: "Find your dream property in Cabo",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  },
  {
    title: "Property Management",
    href: "/property-management",
    description: "Let us manage your Cabo property for optimal returns",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
  },
  {
    title: "Local Events",
    href: "/events",
    description: "Discover what's happening in Cabo",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
  },
  {
    title: "Travel Guides",
    href: "/guides",
    description: "Expert tips and local insights",
    image: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af"
  },
  {
    title: "Work with Us",
    href: "/work-with-us",
    description: "Partnership opportunities",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    title: "Weddings",
    href: "/weddings",
    description: "Plan your dream destination wedding",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f"
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#2F4F4F] p-2 h-10 w-10 rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] bg-white p-0">
                <nav className="flex flex-col h-full overflow-y-auto">
                  {/* Mobile Menu Grid */}
                  <div className="p-3">
                    {/* Main Categories */}
                    <div className="grid grid-cols-1 gap-2">
                      {[...stays.filter(item => item.title !== "Real Estate"), ...adventures].map((item) => (
                        <Link key={item.href} href={item.href} className="block group">
                          <div className="relative h-32 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center">
                              <span className="text-white text-xl font-semibold px-4">{item.title}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Group Trips */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {groupTrips.map((item) => (
                        <Link key={item.href} href={item.href} className="block group">
                          <div className="relative aspect-square rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-2">
                              <span className="text-white text-sm font-semibold px-1">{item.title}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Additional Pages */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[...moreMenuItems].slice(0, 6).map((item) => (
                        <Link key={item.href} href={item.href} className="block group">
                          <div className="relative aspect-square rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-2">
                              <span className="text-white text-xs font-semibold px-1">{item.title}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Social Links */}
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

          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/">
              <a className="text-2xl font-bold text-[#2F4F4F] hover:text-[#1F3F3F]">@cabo</a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Stays Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent text-sm">STAYS</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4">
                      {stays.filter(item => item.title !== "Real Estate").map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Adventures Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent text-sm">ADVENTURES</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4">
                      {adventures.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Group Trips Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent text-sm">GROUP TRIPS</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4">
                      {groupTrips.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Eats Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/restaurants" className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2 text-sm uppercase">
                      EATS
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Blog Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blog" className="text-[#2F4F4F] hover:text-[#1F3F3F] px-4 py-2 text-sm uppercase">
                      BLOG
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* More Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#2F4F4F] bg-transparent text-sm">MORE</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
                      {[...moreMenuItems].map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} className="flex gap-4 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                              <div>
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Cart Button */}
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="sm" className="text-[#2F4F4F] p-2 h-10 w-10 rounded-full">
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;