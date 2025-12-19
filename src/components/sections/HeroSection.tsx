import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Users,
  MessageSquare,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export function HeroSection() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSecondaryClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      document
        .getElementById("ozellikler")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddBot = () => {
    alert("Bot ekleme işlemi simüle edildi! (Mock)");
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#675de6]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#675de6]/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#675de6]/10 border border-[#675de6]/20 text-[#675de6] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Discord için en iyi çözüm
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5">
              Profesyonel bir{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#675de6] to-[#8b7cf7]">
                Discord Sunucusu
              </span>{" "}
              Oluşturun!
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Karşılama deneyimlerinden sosyal etkileşimlere, gelişmiş
              moderasyondan çok daha fazlasına kadar her detayı kontrol etmenizi
              sağlayan, tamamen özelleştirilebilir çok amaçlı bir bot.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button onClick={handleAddBot} size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Discord'a Ekle
              </Button>
              <Button
                onClick={handleSecondaryClick}
                variant="secondary"
                size="lg"
              >
                {isLoggedIn ? "Kontrol Paneline Git" : "Özelliklere Göz Atın"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 mt-10 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-slate-400">Sunucu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500K+</div>
                <div className="text-sm text-slate-400">Kullanıcı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-slate-400">Uptime</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#171821] rounded-2xl border border-white/10 p-6 shadow-2xl shadow-[#675de6]/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#675de6] to-[#8b7cf7] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      IDev Dashboard
                    </div>
                    <div className="text-xs text-slate-400">
                      Sunucu Yönetimi
                    </div>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-medium">
                  Çevrimiçi
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-white">
                      Karşılama Sistemi
                    </span>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-[#675de6] relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm text-white">Seviye Sistemi</span>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-[#675de6] relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-sm text-white">Moderasyon</span>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-slate-600 relative">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-lg font-bold text-white">1,234</div>
                  <div className="text-xs text-slate-400">Üye</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-lg font-bold text-white">89</div>
                  <div className="text-xs text-slate-400">Çevrimiçi</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-lg font-bold text-[#675de6]">PRO</div>
                  <div className="text-xs text-slate-400">Plan</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 p-3 rounded-xl bg-[#171821] border border-white/10 shadow-lg">
              <Users className="w-6 h-6 text-[#675de6]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
