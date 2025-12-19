import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  TrendingUp,
  Palette,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Shield,
  Server,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { API_BASE } from "../lib/api";
import { WelcomeSettings } from "../components/server/WelcomeSettings";
import { LevelSettings } from "../components/server/LevelSettings";
import { EmbedBuilder } from "../components/server/EmbedBuilder";

interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
}

interface ServerSettings {
  guild: GuildInfo;
  welcome: WelcomeData;
  leave: LeaveData;
  levels: LevelData;
  embeds: EmbedData[];
}

export interface WelcomeData {
  enabled: boolean;
  channelId: string;
  messageType: "normal" | "embed";
  message: string;
}

export interface LeaveData {
  enabled: boolean;
  channelId: string;
  messageType: "normal" | "embed";
  message: string;
}

export interface LevelData {
  enabled: boolean;
  xpPerMessage: number;
  cooldown: number;
  levelUpMessage: string;
  levelUpChannelId: string;
  roles: { level: number; roleId: string }[];
}

export interface EmbedData {
  id: string;
  title: string;
  description: string;
  color: string;
  thumbnail: string;
  image: string;
  footer: string;
  fields: { name: string; value: string; inline: boolean }[];
}

export interface Channel {
  id: string;
  name: string;
  type: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
}

type TabType = "welcome" | "levels" | "embeds";

const tabs = [
  { id: "welcome" as TabType, label: "Karşılama & Veda", icon: MessageSquare },
  { id: "levels" as TabType, label: "Seviye Sistemi", icon: TrendingUp },
  { id: "embeds" as TabType, label: "Gömülü Mesajlar", icon: Palette },
];

export function ServerDashboard() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("welcome");
  const [settings, setSettings] = useState<ServerSettings | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !serverId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [settingsRes, channelsRes, rolesRes] = await Promise.all([
          fetch(`${API_BASE}/api/server/${serverId}/settings`, {
            credentials: "include",
          }),
          fetch(`${API_BASE}/api/server/${serverId}/channels`, {
            credentials: "include",
          }),
          fetch(`${API_BASE}/api/server/${serverId}/roles`, {
            credentials: "include",
          }),
        ]);

        if (!settingsRes.ok) {
          const err = await settingsRes.json();
          throw new Error(err.error || "Ayarlar yüklenemedi");
        }

        const [settingsData, channelsData, rolesData] = await Promise.all([
          settingsRes.json(),
          channelsRes.json(),
          rolesRes.json(),
        ]);

        setSettings(settingsData);
        setChannels(channelsData.channels || []);
        setRoles(rolesData.roles || []);
      } catch (err: any) {
        console.error("Failed to fetch settings:", err);
        setError(err.message || "Ayarlar yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, serverId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Yetkisiz Erişim
          </h1>
          <p className="text-slate-400 mb-6">
            Bu sayfayı görüntülemek için giriş yapmalısınız.
          </p>
          <Button onClick={() => navigate("/dashboard")}>Giriş Yap</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#675de6] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Sunucu ayarları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Hata</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
            <Button onClick={() => window.location.reload()}>
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard'a Dön
          </button>

          <div className="flex items-center gap-4">
            {settings.guild.icon ? (
              <img
                src={settings.guild.icon}
                alt={settings.guild.name}
                className="w-16 h-16 rounded-xl"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#675de6]/20 flex items-center justify-center">
                <Server className="w-8 h-8 text-[#675de6]" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {settings.guild.name}
              </h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Bu sunucuyu yönetiyorsunuz
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-[#171821] border border-white/10 rounded-xl p-2 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        if (
                          confirm(
                            "Kaydedilmemiş değişiklikler var. Devam etmek istiyor musunuz?"
                          )
                        ) {
                          setHasUnsavedChanges(false);
                          setActiveTab(tab.id);
                        }
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#675de6] text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {hasUnsavedChanges && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Kaydedilmemiş değişiklikler var
                </p>
              </div>
            )}
          </aside>

          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "welcome" && (
                  <WelcomeSettings
                    serverId={serverId!}
                    welcome={settings.welcome}
                    leave={settings.leave}
                    channels={channels}
                    onUpdate={(welcome, leave) => {
                      setSettings({ ...settings, welcome, leave });
                    }}
                    onUnsavedChange={setHasUnsavedChanges}
                  />
                )}

                {activeTab === "levels" && (
                  <LevelSettings
                    serverId={serverId!}
                    data={settings.levels}
                    channels={channels}
                    roles={roles}
                    onUpdate={(levels) => {
                      setSettings({ ...settings, levels });
                    }}
                    onUnsavedChange={setHasUnsavedChanges}
                  />
                )}

                {activeTab === "embeds" && (
                  <EmbedBuilder
                    serverId={serverId!}
                    embeds={settings.embeds}
                    channels={channels}
                    onUpdate={(embeds) => {
                      setSettings({ ...settings, embeds });
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
