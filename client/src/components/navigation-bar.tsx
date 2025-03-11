import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu } from "lucide-react";

export default function NavigationBar() {
  return (
    <nav className="bg-[#2F4F4F] border-b border-[#2F4F4F]/20">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-white">Cabo Travels</a>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" asChild className="text-white hover:text-white/80">
              <Link href="/resorts">Resorts & Hotels</Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-white/80">
              <Link href="/villas">Luxury Villas</Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-white/80">
              <Link href="/adventures">Adventures</Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-white/80">
              <Link href="/restaurants">Restaurants</Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-white/80">
              <Link href="/concierge">Luxury Concierge</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}