import { useState, useEffect, useRef } from "react";
import { useParams, useBlocker } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Link2,
  MessageSquareOff,
  Save,
  Loader2,
  Check,
  Hash,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useDashboardInit } from "../../context/DashboardContext";
import { API_BASE } from "../../lib/api";

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
}

interface AutoModSettings {
  antiAd: {
    enabled: boolean;
    action: "delete" | "timeout" | "warn";
    ignoredChannelIds: string[];
    ignoredRoleIds: string[];
  };
  profanity: {
    enabled: boolean;
    action: "delete" | "timeout" | "warn";
    ignoredChannelIds: string[];
    ignoredRoleIds: string[];
  };
}

const defaultSettings: AutoModSettings = {
  antiAd: {
    enabled: false,
    action: "delete",
    ignoredChannelIds: [],
    ignoredRoleIds: [],
  },
  profanity: {
    enabled: false,
    action: "delete",
    ignoredChannelIds: [],
    ignoredRoleIds: [],
  },
};

export function AutoModPage() {
  const { serverId } = useParams();
  const dashboard = useDashboardInit(serverId);
  const [settings, setSettings] = useState<AutoModSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const initialDataRef = useRef<AutoModSettings | null>(null);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const channels = dashboard.channels;
  const roles = dashboard.roles;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowUnsavedModal(true);
      pendingNavigationRef.current = () => blocker.proceed();
    }
  }, [blocker]);

  useEffect(() => {
    if (initialDataRef.current) {
      const hasChanges =
        JSON.stringify(settings) !== JSON.stringify(initialDataRef.current);
      setHasUnsavedChanges(hasChanges);
    }
  }, [settings]);

  useEffect(() => {
    if (dashboard.settings.automod) {
      const merged = { ...defaultSettings, ...dashboard.settings.automod };
      setSettings(merged);
      initialDataRef.current = merged;
    }
    setIsLoading(dashboard.isLoading);
  }, [dashboard.settings, dashboard.isLoading]);

  const saveSettings = async (type: "antiAd" | "profanity") => {
    setSaving(type);
    try {
      const res = await fetch(
        `${API_BASE}/api/server/${serverId}/automod/${
          type === "antiAd" ? "antiad" : "profanity"
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(settings[type]),
        }
      );

      if (res.ok) {
        setSaved(type);
        setTimeout(() => setSaved(null), 2000);
        initialDataRef.current = { ...settings };
        setHasUnsavedChanges(false);
      }
    } catch {
    } finally {
      setSaving(null);
    }
  };

  const updateSetting = (
    type: "antiAd" | "profanity",
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const renderModCard = (
    type: "antiAd" | "profanity",
    title: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface rounded-xl border border-white/10"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings[type].enabled}
            onChange={(e) => updateSetting(type, "enabled", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
        </label>
      </div>

      {!settings[type].enabled && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
          <Hash className="w-4 h-4" />
          Ayarları düzenlemek için sistemi aktif edin.
        </div>
      )}

      <div
        className={`space-y-4 ${
          !settings[type].enabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Eylem
          </label>
          <select
            value={settings[type].action}
            onChange={(e) => updateSetting(type, "action", e.target.value)}
            disabled={!settings[type].enabled}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50 disabled:cursor-not-allowed"
          >
            <option value="delete">Mesajı Sil</option>
            <option value="timeout">Zaman Aşımı</option>
            <option value="warn">Uyar</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Hash className="w-4 h-4" />
            Etkilenmeyen Kanallar
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-lg min-h-[60px]">
            {channels.map((ch) => {
              const isSelected = settings[type].ignoredChannelIds.includes(
                ch.id
              );
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    const current = settings[type].ignoredChannelIds;
                    const updated = isSelected
                      ? current.filter((id) => id !== ch.id)
                      : [...current, ch.id];
                    updateSetting(type, "ignoredChannelIds", updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-accent text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  #{ch.name}
                </button>
              );
            })}
            {channels.length === 0 && (
              <p className="text-sm text-slate-500">Kanal bulunamadı</p>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seçmek için kanallara tıklayın
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Users className="w-4 h-4" />
            Etkilenmeyen Roller
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-lg min-h-[60px]">
            {roles.map((role) => {
              const isSelected = settings[type].ignoredRoleIds.includes(
                role.id
              );
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    const current = settings[type].ignoredRoleIds;
                    const updated = isSelected
                      ? current.filter((id) => id !== role.id)
                      : [...current, role.id];
                    updateSetting(type, "ignoredRoleIds", updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-accent text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                  style={
                    isSelected
                      ? {}
                      : { borderLeft: `3px solid ${role.color || "#99aab5"}` }
                  }
                >
                  {role.name}
                </button>
              );
            })}
            {roles.length === 0 && (
              <p className="text-sm text-slate-500">Rol bulunamadı</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <Button
            onClick={() => saveSettings(type)}
            disabled={saving === type || !settings[type].enabled}
          >
            {saving === type ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : saved === type ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved === type ? "Kaydedildi!" : "Kaydet"}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Otomatik Moderasyon
        </h1>
        <p className="text-slate-400">
          Reklam ve küfür engelleme sistemlerini yapılandırın.
        </p>
      </div>

      <div className="space-y-6">
        {renderModCard(
          "antiAd",
          "Reklam Engel",
          "Discord davetleri ve linkleri otomatik olarak engelle.",
          <div className="p-3 rounded-xl bg-red-500/20">
            <Link2 className="w-6 h-6 text-red-400" />
          </div>
        )}

        {renderModCard(
          "profanity",
          "Küfür Engel",
          "Uygunsuz kelimeleri otomatik olarak engelle.",
          <div className="p-3 rounded-xl bg-orange-500/20">
            <MessageSquareOff className="w-6 h-6 text-orange-400" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showUnsavedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ x: { duration: 0.5 } }}
              className="bg-background border border-white/10 rounded-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Kaydedilmemiş Değişiklikler
                  </h3>
                  <p className="text-sm text-slate-400">
                    Değişiklikleriniz kaybolacak!
                  </p>
                </div>
              </div>

              <p className="text-slate-300 mb-6">
                Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak
                istediğinizden emin misiniz?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    blocker.reset?.();
                  }}
                >
                  İptal
                </Button>
                <button
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    pendingNavigationRef.current?.();
                  }}
                >
                  Ayrıl
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
