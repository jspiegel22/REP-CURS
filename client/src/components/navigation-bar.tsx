import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiTiktok, SiInstagram, SiYoutube, SiWhatsapp, SiFacebook, SiPinterest } from "react-icons/si";

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
                <nav className="flex flex-col">
                  {/* Main Navigation Cards */}
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <Link href="/resorts">
                      <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                        <img
                          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
                          alt="Resorts"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                          <span className="text-white font-semibold">Resorts & Hotels</span>
                        </div>
                      </a>
                    </Link>
                    <Link href="/villas">
                      <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                        <img
                          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
                          alt="Villas"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                          <span className="text-white font-semibold">Luxury Villas</span>
                        </div>
                      </a>
                    </Link>
                    <Link href="/adventures">
                      <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                        <img
                          src="https://images.unsplash.com/photo-1564351943427-3d61951984e9?w=800"
                          alt="Adventures"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                          <span className="text-white font-semibold">Adventures</span>
                        </div>
                      </a>
                    </Link>
                    <Link href="/restaurants">
                      <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                        <img
                          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
                          alt="Restaurants"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                          <span className="text-white font-semibold">Restaurants</span>
                        </div>
                      </a>
                    </Link>
                  </div>

                  {/* Featured Adventures Section */}
                  <div className="px-4 py-6 border-t border-white/10">
                    <h3 className="text-white/60 text-sm font-semibold mb-4">Featured Adventures</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/adventure/luxury-cabo-sailing">
                        <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                          <img
                            src="https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp"
                            alt="Luxury Sailing"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                            <span className="text-white font-semibold">Luxury Sailing</span>
                          </div>
                        </a>
                      </Link>
                      <Link href="/adventure/whale-watching">
                        <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                          <img
                            src="https://cdn.sanity.io/images/esqfj3od/production/76c1e97bb2129788a3907f7809aba1b85f328cbb-608x912.webp"
                            alt="Whale Watching"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                            <span className="text-white font-semibold">Whale Watching</span>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>

                  {/* Guides Section */}
                  <div className="px-4 py-6 border-t border-white/10">
                    <h3 className="text-white/60 text-sm font-semibold mb-4">Guides</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/guides/activities">
                        <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                          <img
                            src="https://images.unsplash.com/photo-1533760881669-80db4d7b341c?w=800"
                            alt="Activity Guide"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                            <span className="text-white font-semibold">Activity Guide</span>
                          </div>
                        </a>
                      </Link>
                      <Link href="/guides/local-tips">
                        <a className="relative rounded-lg overflow-hidden aspect-[4/3]">
                          <img
                            src="https://images.unsplash.com/photo-1563461660947-507ef49e9c47?w=800"
                            alt="Local Tips"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex items-end p-4">
                            <span className="text-white font-semibold">Local Tips</span>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="mt-8 px-6 py-4 border-t border-white/10">
                    <h3 className="text-white/60 text-sm font-semibold mb-4">Follow Us</h3>
                    <div className="flex gap-6 flex-wrap">
                      <a href="https://www.tiktok.com/@atcabo" className="text-white hover:text-white/80">
                        <SiTiktok className="w-6 h-6" />
                      </a>
                      <a href="https://instagram.com/cabo" className="text-white hover:text-white/80">
                        <SiInstagram className="w-6 h-6" />
                      </a>
                      <a href="https://www.youtube.com/@atCabo" className="text-white hover:text-white/80">
                        <SiYoutube className="w-6 h-6" />
                      </a>
                      <a href="https://wa.me/526242446303" className="text-white hover:text-white/80">
                        <SiWhatsapp className="w-6 h-6" />
                      </a>
                      <a href="https://www.facebook.com/cabosanlucasbaja" className="text-white hover:text-white/80">
                        <SiFacebook className="w-6 h-6" />
                      </a>
                      <a href="https://www.pinterest.com/instacabo/" className="text-white hover:text-white/80">
                        <SiPinterest className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/">
              <a className="text-2xl font-bold text-white">@cabo</a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
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