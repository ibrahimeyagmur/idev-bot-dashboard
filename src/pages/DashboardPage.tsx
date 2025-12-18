import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import {
  LayoutDashboard,
  Shield,
  Plus,
  Loader2,
  RefreshCw,
  AlertCircle,
  Server,
  Search,
} from "lucide-react";
import { api, type Guild } from "../lib/api";

export function DashboardPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading, user, login } = useAuth();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitingGuildId, setInvitingGuildId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const INITIAL_SHOW_COUNT = 7;

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchGuilds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getGuilds();
        setGuilds(response.guilds);
      } catch (err) {
        console.error("Failed to fetch guilds:", err);
        setError("Sunucular alınamadı. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuilds();
  }, [isLoggedIn]);

  const manageableGuilds = useMemo(() => {
    return guilds
      .filter((g) => g.isManageable)
      .filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (a.botInstalled && !b.botInstalled) return -1;
        if (!a.botInstalled && b.botInstalled) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [guilds, searchQuery]);

  const handleInviteBot = async (guildId: string) => {
    setInvitingGuildId(guildId);
    try {
      const { url } = await api.getBotInviteUrl(guildId);
      window.location.href = url;
    } catch (err) {
      console.error("Failed to get invite URL:", err);
      setError("Davet linki alınamadı.");
      setInvitingGuildId(null);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    api
      .getGuilds()
      .then((response) => setGuilds(response.guilds))
      .catch(() => setError("Sunucular alınamadı. Lütfen tekrar deneyin."))
      .finally(() => setIsLoading(false));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#675de6] animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 text-[#675de6] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400 mb-6">
            Kontrol paneline erişmek için giriş yapmalısınız.
          </p>
          <Button onClick={login}>Giriş Yap</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hoş geldin, {user?.name}! 👋
          </h1>
          <p className="text-slate-400">
            Yönetebileceğin sunucuları aşağıda görebilirsin.
          </p>
        </div>

        {!isLoading && manageableGuilds.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Sunucu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#171821] border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#675de6]/50 focus:ring-1 focus:ring-[#675de6]/50 transition-colors"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tekrar Dene
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#171821] border border-white/10 rounded-xl p-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="h-9 w-24 bg-white/10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {manageableGuilds.length > 0 ? (
              <>
                <div className="space-y-4">
                  {(showAll
                    ? manageableGuilds
                    : manageableGuilds.slice(0, INITIAL_SHOW_COUNT)
                  ).map((guild) => (
                    <div
                      key={guild.id}
                      className="bg-[#171821] border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-[#675de6]/30 transition-colors"
                    >
                      {guild.icon ? (
                        <img
                          src={guild.icon}
                          alt={guild.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#675de6]/20 flex items-center justify-center">
                          <Server className="w-6 h-6 text-[#675de6]" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {guild.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            Yönetici
                          </span>
                        </div>
                      </div>

                      {guild.botInstalled ? (
                        <Button
                          onClick={() => navigate(`/dashboard/${guild.id}`)}
                          size="sm"
                          variant="secondary"
                        >
                          Yönet
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleInviteBot(guild.id)}
                          disabled={invitingGuildId === guild.id}
                          size="sm"
                        >
                          {invitingGuildId === guild.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Botu Ekle
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {!showAll && manageableGuilds.length > INITIAL_SHOW_COUNT && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full mt-4 py-3 text-sm font-medium text-slate-400 hover:text-white bg-[#171821] border border-white/10 rounded-xl hover:border-[#675de6]/30 transition-colors"
                  >
                    Diğer {manageableGuilds.length - INITIAL_SHOW_COUNT}{" "}
                    sunucuyu göster
                  </button>
                )}
              </>
            ) : (
              <div className="bg-[#171821] border border-white/10 rounded-xl p-8 text-center">
                <Server className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Yönetilebilir sunucu bulunamadı
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Yönetici yetkisine sahip olduğunuz sunucu bulunmuyor.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
