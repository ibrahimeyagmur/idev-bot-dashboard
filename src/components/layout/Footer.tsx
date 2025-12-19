import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter } from "lucide-react";

const footerLinks = {
  ozellikler: [
    { label: "Karşılama Mesajları", href: "/ozellikler/karsilama-mesajlari" },
    { label: "Seviye Sistemi", href: "/ozellikler/seviye-sistemi" },
    { label: "Gömülü Mesajlar", href: "/ozellikler/gomulu-mesajlar" },
  ],
  kaynaklar: [
    { label: "Komutlar", href: "/komutlar" },
    { label: "Destek", href: "/destek" },
  ],
  yasal: [
    { label: "Gizlilik Politikası", href: "#" },
    { label: "Kullanım Şartları", href: "#" },
    { label: "Çerez Politikası", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0d0e14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#675de6] to-[#8b7cf7] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">IDev</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Discord sunucunuzu profesyonel bir seviyeye taşıyın. Güçlü
              özellikler, kolay kurulum.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Özellikler
            </h4>
            <ul className="space-y-2">
              {footerLinks.ozellikler.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Kaynaklar</h4>
            <ul className="space-y-2">
              {footerLinks.kaynaklar.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Yasal</h4>
            <ul className="space-y-2">
              {footerLinks.yasal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} IDev. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
