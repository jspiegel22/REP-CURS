import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full bg-[url('https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">Experience the Magic of Cabo San Lucas</h1>
            <p className="text-xl mb-8">Discover luxury resorts, thrilling adventures, and unforgettable experiences in paradise.</p>
            <div className="space-x-4">
              <Button asChild size="lg" variant="default">
                <Link href="/listings/resort">Browse Resorts</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/listings/adventure">View Adventures</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
