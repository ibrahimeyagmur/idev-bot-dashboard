import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const featureLinks = [
  { label: "Karşılama Mesajları", href: "/ozellikler/karsilama-mesajlari" },
  { label: "Seviye Sistemi", href: "/ozellikler/seviye-sistemi" },
  { label: "Gömülü Mesajlar", href: "/ozellikler/gomulu-mesajlar" },
  { label: "Otomatik Moderasyon", href: "/ozellikler/otomasyon" },
];

const resourceLinks = [
  { label: "Destek", href: "/destek" },
  { label: "Komutlar", href: "/komutlar" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { isLoggedIn, user, login, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#12131a]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#675de6] to-[#8b7cf7] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white font-[var(--font-heading)]">
              IDev
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown("features")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "features" ? null : "features"
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Sparkles className="w-4 h-4" />
                Özellikler
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === "features" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === "features" && (
                <div className="absolute top-full left-0 pt-2 w-52">
                  <div className="py-2 bg-[#171821] rounded-xl border border-white/10 shadow-xl shadow-black/20">
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown("resources")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "resources" ? null : "resources"
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <BookOpen className="w-4 h-4" />
                Kaynaklar
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === "resources" && (
                <div className="absolute top-full left-0 pt-2 w-48">
                  <div className="py-2 bg-[#171821] rounded-xl border border-white/10 shadow-xl shadow-black/20">
                    {resourceLinks.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === "user" ? null : "user")
                  }
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-[#675de6]/50"
                  />
                  <span className="text-sm text-slate-200 font-medium">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openDropdown === "user" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === "user" && (
                  <div className="absolute top-full right-0 pt-2 w-48">
                    <div className="py-2 bg-[#171821] rounded-xl border border-white/10 shadow-xl shadow-black/20">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setOpenDropdown(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={login} variant="primary">
                Giriş Yap
              </Button>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#171821] border-t border-white/5">
          <div className="px-4 py-4 space-y-2">
            <div>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "features-mobile"
                      ? null
                      : "features-mobile"
                  )
                }
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Özellikler
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === "features-mobile" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === "features-mobile" && (
                <div className="pl-6 mt-1 space-y-1">
                  {featureLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "resources-mobile"
                      ? null
                      : "resources-mobile"
                  )
                }
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Kaynaklar
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === "resources-mobile" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === "resources-mobile" && (
                <div className="pl-6 mt-1 space-y-1">
                  {resourceLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/5">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 mb-2">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full ring-2 ring-[#675de6]/50"
                    />
                    <span className="text-sm text-slate-200 font-medium">
                      {user.name}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    login();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Giriş Yap
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
