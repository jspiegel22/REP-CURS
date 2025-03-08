import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu } from "lucide-react";

export default function NavigationBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-[#2F4F4F]">Cabo Travels</a>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" asChild className="text-[#2F4F4F]">
              <Link href="/resorts">Resorts & Hotels</Link>
            </Button>
            <Button variant="ghost" asChild className="text-[#2F4F4F]">
              <Link href="/villas">Luxury Villas</Link>
            </Button>
            <Button variant="ghost" asChild className="text-[#2F4F4F]">
              <Link href="/adventures">Adventures</Link>
            </Button>
            <Button variant="ghost" asChild className="text-[#2F4F4F]">
              <Link href="/restaurants">Restaurants</Link>
            </Button>
            <Button variant="ghost" asChild className="text-[#2F4F4F]">
              <Link href="/concierge">Luxury Concierge</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}