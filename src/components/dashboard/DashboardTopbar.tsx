import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogOut, User, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Props {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export function DashboardTopbar({ title, breadcrumbs = [] }: Props) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    if (user?.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
    }
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
  };

  const getDisplayName = () => {
    return user?.name || user?.username || "Kullanıcı";
  };

  return (
    <header className="h-16 bg-background border-b border-white/10 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-40">
      <div className="flex items-center gap-2">
        {breadcrumbs.length > 0 && (
          <>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-sm text-slate-400">{crumb.label}</span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            ))}
          </>
        )}
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <img
            src={getAvatarUrl()}
            alt={getDisplayName()}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-white">{getDisplayName()}</p>
            <p className="text-xs text-slate-400">@{user?.username}</p>
          </div>
        </button>

        <AnimatePresence>
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl()}
                      alt={getDisplayName()}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-slate-400">
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Sunucularım</span>
                  </Link>
                  <a
                    href="https://discord.com/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Discord'u Aç</span>
                  </a>
                </div>
                <div className="p-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Çıkış Yap</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
