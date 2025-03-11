import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavigationBar() {
  return (
    <nav className="bg-[#2F4F4F] border-b border-[#2F4F4F]/20">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-white">@cabo</a>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#2F4F4F] border-l border-[#2F4F4F]/20 p-0">
                <nav className="flex flex-col py-4">
                  <Link href="/">
                    <a className="px-6 py-4 text-lg font-semibold text-white hover:bg-white/10">Home</a>
                  </Link>
                  <Link href="/resorts">
                    <a className="px-6 py-4 text-lg text-white hover:bg-white/10">Resorts & Hotels</a>
                  </Link>
                  <Link href="/villas">
                    <a className="px-6 py-4 text-lg text-white hover:bg-white/10">Luxury Villas</a>
                  </Link>
                  <Link href="/adventures">
                    <a className="px-6 py-4 text-lg text-white hover:bg-white/10">Adventures</a>
                  </Link>
                  <Link href="/restaurants">
                    <a className="px-6 py-4 text-lg text-white hover:bg-white/10">Restaurants</a>
                  </Link>
                  <Link href="/concierge">
                    <a className="px-6 py-4 text-lg text-white hover:bg-white/10">Luxury Concierge</a>
                  </Link>

                  {/* Social Links */}
                  <div className="mt-8 px-6">
                    <h3 className="text-white/60 text-sm font-semibold mb-4">Follow Us</h3>
                    <div className="space-y-3">
                      <a href="https://www.tiktok.com/@atcabo" className="text-white hover:text-white/80 block">TikTok</a>
                      <a href="https://instagram.com/cabo" className="text-white hover:text-white/80 block">Instagram</a>
                      <a href="https://www.youtube.com/@atCabo" className="text-white hover:text-white/80 block">YouTube</a>
                      <a href="https://wa.me/526242446303" className="text-white hover:text-white/80 block">WhatsApp</a>
                      <a href="https://www.facebook.com/cabosanlucasbaja" className="text-white hover:text-white/80 block">Facebook</a>
                      <a href="https://www.pinterest.com/instacabo/" className="text-white hover:text-white/80 block">Pinterest</a>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}