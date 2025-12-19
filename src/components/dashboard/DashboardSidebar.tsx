import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  TrendingUp,
  Palette,
  Shield,
  MessageCircle,
  ChevronDown,
  Server,
  Check,
  Plus,
  Sparkles,
} from "lucide-react";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  botInstalled: boolean;
}

interface Props {
  guilds: Guild[];
  currentGuild: Guild | null;
}

const menuItems = [
  { id: "overview", label: "Kontrol Paneli", icon: LayoutDashboard, path: "" },
  { id: "settings", label: "Ayarlar", icon: Settings, path: "/settings" },
  {
    id: "welcome",
    label: "Karşılama & Veda",
    icon: MessageSquare,
    path: "/welcome",
  },
  {
    id: "autoreply",
    label: "Otomatik Cevap",
    icon: MessageCircle,
    path: "/autoreply",
  },
  {
    id: "automod",
    label: "Otomatik Moderasyon",
    icon: Shield,
    path: "/automod",
  },
  { id: "levels", label: "Seviye Sistemi", icon: TrendingUp, path: "/levels" },
  { id: "embeds", label: "Gömülü Mesajlar", icon: Palette, path: "/embeds" },
];

export function DashboardSidebar({ guilds, currentGuild }: Props) {
  const location = useLocation();
  const { serverId } = useParams();
  const [isServerSwitcherOpen, setIsServerSwitcherOpen] = useState(false);

  const getGuildIcon = (guild: Guild) => {
    if (!guild.icon) return null;
    if (guild.icon.startsWith("http")) {
      return guild.icon;
    }
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`;
  };

  const isActive = (path: string) => {
    const basePath = `/dashboard/${serverId}`;
    if (path === "") {
      return (
        location.pathname === basePath || location.pathname === `${basePath}/`
      );
    }
    return location.pathname === `${basePath}${path}`;
  };

  return (
    <aside className="w-64 bg-[#12131a] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#8b7cf7] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">IDev</span>
        </Link>
      </div>

      <div className="p-3 border-b border-white/10">
        <button
          onClick={() => setIsServerSwitcherOpen(!isServerSwitcherOpen)}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {currentGuild ? (
            <>
              {getGuildIcon(currentGuild) ? (
                <img
                  src={getGuildIcon(currentGuild)!}
                  alt={currentGuild.name}
                  className="w-8 h-8 rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Server className="w-4 h-4 text-accent" />
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">
                  {currentGuild.name}
                </p>
                <p className="text-xs text-slate-400">
                  {currentGuild.botInstalled
                    ? "Bot kurulu"
                    : "Bot kurulu değil"}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Server className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-400">Sunucu seç</span>
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isServerSwitcherOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isServerSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              <div className="bg-surface rounded-lg border border-white/10 max-h-64 overflow-y-auto">
                {guilds.map((guild) => (
                  <Link
                    key={guild.id}
                    to={`/dashboard/${guild.id}`}
                    onClick={() => setIsServerSwitcherOpen(false)}
                    className={`flex items-center gap-3 p-2.5 hover:bg-white/5 transition-colors ${
                      guild.id === serverId ? "bg-accent/10" : ""
                    }`}
                  >
                    {getGuildIcon(guild) ? (
                      <img
                        src={getGuildIcon(guild)!}
                        alt={guild.name}
                        className="w-7 h-7 rounded-lg"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                        <Server className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                    <span className="flex-1 text-sm text-white truncate">
                      {guild.name}
                    </span>
                    {guild.id === serverId && (
                      <Check className="w-4 h-4 text-accent" />
                    )}
                    {!guild.botInstalled && (
                      <span className="text-xs text-amber-400">Bot yok</span>
                    )}
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  onClick={() => setIsServerSwitcherOpen(false)}
                  className="flex items-center gap-3 p-2.5 hover:bg-white/5 transition-colors border-t border-white/10"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span className="text-sm text-accent">Tüm sunucular</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={`/dashboard/${serverId}${item.path}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                active
                  ? "bg-accent text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 text-xs text-slate-500">
          IDev Dashboard v1.0
        </div>
      </div>
    </aside>
  );
}
