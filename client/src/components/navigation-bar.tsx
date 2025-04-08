import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

const stays = [
  {
    title: "Luxury Villas",
    href: "/stays/villas",
    description: "Exclusive private villas with stunning ocean views",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
  },
  {
    title: "Resorts",
    href: "/stays/resorts",
    description: "World-class resorts and hotels",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  }
];

const adventures = [
  {
    title: "Water Activities",
    href: "/adventures/water",
    description: "Snorkeling, diving & more",
    image: "https://images.unsplash.com/photo-1564543331-0b5aa2eda2ce"
  },
  {
    title: "Land Adventures",
    href: "/adventures/land",
    description: "ATV tours & desert expeditions",
    image: "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6"
  },
  {
    title: "Luxury Experiences",
    href: "/adventures/luxury",
    description: "Private yacht charters & exclusive tours",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
  }
];

const groupTrips = [
  {
    title: "Bachelor Parties",
    href: "/group-trips/bachelor",
    description: "Unforgettable celebrations for the groom-to-be",
    image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31"
  },
  {
    title: "Bachelorette Parties",
    href: "/group-trips/bachelorette",
    description: "Perfect celebrations for the bride-to-be",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205"
  },
  {
    title: "Family Trips",
    href: "/group-trips/family",
    description: "Memorable vacations for the whole family",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf"
  },
  {
    title: "Luxury Concierge",
    href: "/group-trips/luxury-concierge",
    description: "Tailored experiences for discerning travelers",
    image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570"
  },
  {
    title: "Influencer Trips",
    href: "/group-trips/influencer",
    description: "Curated experiences for content creators",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
  }
];

const eats = [
  {
    title: "Restaurants",
    href: "/eats/restaurants",
    description: "Fine dining & local favorites",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
  },
  {
    title: "Bars & Nightlife",
    href: "/eats/bars",
    description: "Best bars & clubs in Cabo",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b"
  },
  {
    title: "Beach Clubs",
    href: "/eats/beach-clubs",
    description: "Luxury beach clubs & day parties",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206"
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">@cabo</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>STAYS</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/stays"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Find Your Perfect Stay
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Choose from our curated selection of luxury villas and world-class resorts.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {stays.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href={item.href}
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>ADVENTURES</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/adventures"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Discover Cabo Adventures
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Experience the best activities and tours in Cabo San Lucas.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {adventures.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href={item.href}
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>GROUP TRIPS</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/group-trips"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Plan Your Group Trip
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Specialized experiences for bachelor parties, family trips, and more.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {groupTrips.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href={item.href}
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>EATS</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/eats"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Discover Cabo's Food Scene
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          From fine dining to local favorites, explore the best places to eat and drink.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {eats.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href={item.href}
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/blog" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                BLOG
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>MORE</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/more"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          More Resources
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Additional information and services to enhance your Cabo experience.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {moreMenuItems.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href={item.href}
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="/cart" className="relative">
            <span className="sr-only">Cart</span>
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              0
            </span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/stays" className="text-lg font-medium">STAYS</Link>
                <Link href="/adventures" className="text-lg font-medium">ADVENTURES</Link>
                <Link href="/group-trips" className="text-lg font-medium">GROUP TRIPS</Link>
                <Link href="/eats" className="text-lg font-medium">EATS</Link>
                <Link href="/blog" className="text-lg font-medium">BLOG</Link>
                <Link href="/more" className="text-lg font-medium">MORE</Link>
              </nav>
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;