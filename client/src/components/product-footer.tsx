import { SiTiktok, SiInstagram, SiYoutube, SiWhatsapp, SiFacebook, SiPinterest } from "react-icons/si";

export function ProductFooter() {
  return (
    <footer className="bg-[#2F4F4F] text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold">@cabo</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.tiktok.com/@atcabo" className="hover:text-white/80">
              <SiTiktok className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/cabo" className="hover:text-white/80">
              <SiInstagram className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@atCabo" className="hover:text-white/80">
              <SiYoutube className="w-5 h-5" />
            </a>
            <a href="https://wa.me/526242446303" className="hover:text-white/80">
              <SiWhatsapp className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/cabosanlucasbaja" className="hover:text-white/80">
              <SiFacebook className="w-5 h-5" />
            </a>
            <a href="https://www.pinterest.com/instacabo/" className="hover:text-white/80">
              <SiPinterest className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
