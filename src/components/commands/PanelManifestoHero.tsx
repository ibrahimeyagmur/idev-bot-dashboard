import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  ToggleRight,
  Palette,
  MessageSquare,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export function PanelManifestoHero() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      login();
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#675de6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#675de6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#675de6]/10 border border-[#675de6]/30 text-[#675de6] text-sm font-semibold mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#675de6] animate-pulse" />
              Komut yok.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              Her şey{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#675de6] to-[#8b7cf7]">
                Panelden
              </span>{" "}
              Yönetilir.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl"
            >
              IDev'de slash/prefix komutlarla uğraşmazsın. Tüm sistemler web
              panelde: karşılama, seviye, embed, tepki rolleri, otomatik
              moderasyon ve otomatik cevaplar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" onClick={handleDashboard}>
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard'a Git
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Özellikleri Gör
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#675de6]/20 to-[#8b7cf7]/20 rounded-3xl blur-2xl" />

              <div className="relative bg-[#171821] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#12131a]">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs text-slate-500">
                    IDev Dashboard
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <motion.div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Karşılama Sistemi
                        </p>
                        <p className="text-xs text-slate-500">Aktif</p>
                      </div>
                    </div>
                    <ToggleRight className="w-8 h-8 text-green-400" />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-[#675de6]" />
                        <span className="text-xs text-slate-400">Seviye</span>
                      </div>
                      <p className="text-lg font-semibold text-white">2,847</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-slate-400">
                          Engellenen
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-white">156</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#12131a] rounded-lg border-l-4 border-[#675de6]">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-[#675de6]" />
                      <span className="text-sm font-medium text-[#675de6]">
                        Embed Önizleme
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Hoş geldin mesajı hazır!
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 py-2 px-3 bg-[#675de6] rounded-lg text-center text-sm font-medium text-white">
                      Kaydet
                    </div>
                    <div className="py-2 px-3 bg-white/5 rounded-lg text-sm text-slate-400 border border-white/10">
                      İptal
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute -top-6 -right-6 p-3 bg-[#171821] rounded-xl border border-white/10 shadow-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-[#675de6]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
