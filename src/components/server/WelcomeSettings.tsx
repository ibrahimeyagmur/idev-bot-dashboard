import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Check,
  MessageSquare,
  LogOut,
  Hash,
} from "lucide-react";
import { Button } from "../ui/Button";
import { DiscordMessagePreview } from "./DiscordMessagePreview";
import type {
  WelcomeData,
  LeaveData,
  Channel,
} from "../../pages/ServerDashboard";
import { API_BASE } from "../../lib/api";

interface Props {
  serverId: string;
  welcome: WelcomeData;
  leave: LeaveData;
  channels: Channel[];
  onUpdate: (welcome: WelcomeData, leave: LeaveData) => void;
  onUnsavedChange: (hasChanges: boolean) => void;
}

const defaultWelcome: WelcomeData = {
  enabled: false,
  channelId: "",
  messageType: "normal",
  message: "Hoş geldin {user}, {server} sunucusuna katıldın! 🎉",
};

const defaultLeave: LeaveData = {
  enabled: false,
  channelId: "",
  messageType: "normal",
  message: "{user} aramızdan ayrıldı 😢",
};

export function WelcomeSettings({
  serverId,
  welcome,
  leave,
  channels,
  onUpdate,
  onUnsavedChange,
}: Props) {
  const [welcomeData, setWelcomeData] = useState<WelcomeData>({
    ...defaultWelcome,
    ...welcome,
    message: welcome.message || defaultWelcome.message,
  });
  const [leaveData, setLeaveData] = useState<LeaveData>({
    ...defaultLeave,
    ...leave,
    message: leave.message || defaultLeave.message,
  });
  const [saving, setSaving] = useState<"welcome" | "leave" | null>(null);
  const [saved, setSaved] = useState<"welcome" | "leave" | null>(null);

  useEffect(() => {
    const hasWelcomeChanges =
      JSON.stringify(welcomeData) !== JSON.stringify(welcome);
    const hasLeaveChanges = JSON.stringify(leaveData) !== JSON.stringify(leave);
    onUnsavedChange(hasWelcomeChanges || hasLeaveChanges);
  }, [welcomeData, leaveData, welcome, leave, onUnsavedChange]);

  const saveWelcome = async () => {
    setSaving("welcome");
    try {
      const res = await fetch(
        `${API_BASE}/api/server/${serverId}/welcome`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(welcomeData),
        }
      );

      if (res.ok) {
        const { data } = await res.json();
        onUpdate(data, leaveData);
        setSaved("welcome");
        setTimeout(() => setSaved(null), 2000);
      }
    } catch (err) {
      console.error("Failed to save welcome settings:", err);
    } finally {
      setSaving(null);
    }
  };

  const saveLeave = async () => {
    setSaving("leave");
    try {
      const res = await fetch(
        `${API_BASE}/api/server/${serverId}/leave`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(leaveData),
        }
      );

      if (res.ok) {
        const { data } = await res.json();
        onUpdate(welcomeData, data);
        setSaved("leave");
        setTimeout(() => setSaved(null), 2000);
      }
    } catch (err) {
      console.error("Failed to save leave settings:", err);
    } finally {
      setSaving(null);
    }
  };

  const parseMessage = (message: string) => {
    return message
      .replace(/{user}/g, "@Kullanıcı")
      .replace(/{server}/g, "Sunucu Adı")
      .replace(/{count}/g, "128");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Karşılama Mesajı
                </h2>
                <p className="text-sm text-slate-400">
                  Yeni üyeler katıldığında gönderilecek mesaj
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={welcomeData.enabled}
                onChange={(e) =>
                  setWelcomeData({ ...welcomeData, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>

        {welcomeData.enabled && (
          <div className="p-6 grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Kanal
                </label>
                <select
                  value={welcomeData.channelId}
                  onChange={(e) =>
                    setWelcomeData({
                      ...welcomeData,
                      channelId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-[#12131a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                >
                  <option value="">Kanal seçin</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mesaj Türü
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setWelcomeData({ ...welcomeData, messageType: "normal" })
                    }
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                      welcomeData.messageType === "normal"
                        ? "bg-accent/20 border-accent text-white"
                        : "bg-[#12131a] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    Normal Mesaj
                  </button>
                  <button
                    onClick={() =>
                      setWelcomeData({ ...welcomeData, messageType: "embed" })
                    }
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                      welcomeData.messageType === "embed"
                        ? "bg-accent/20 border-accent text-white"
                        : "bg-[#12131a] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    Gömülü Mesaj
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mesaj
                </label>
                <textarea
                  value={welcomeData.message}
                  onChange={(e) =>
                    setWelcomeData({ ...welcomeData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-[#12131a] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                  placeholder="Hoş geldin {user}!"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {["{user}", "{server}", "{count}"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setWelcomeData({
                          ...welcomeData,
                          message: welcomeData.message + " " + tag,
                        })
                      }
                      className="px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={saveWelcome}
                disabled={saving === "welcome"}
                className="w-full"
              >
                {saving === "welcome" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : saved === "welcome" ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saved === "welcome" ? "Kaydedildi!" : "Kaydet"}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Önizleme
              </label>
              <DiscordMessagePreview
                type={welcomeData.messageType}
                content={parseMessage(welcomeData.message)}
                username="GenelBot"
              />
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Veda Mesajı
                </h2>
                <p className="text-sm text-slate-400">
                  Üyeler ayrıldığında gönderilecek mesaj
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={leaveData.enabled}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>

        {leaveData.enabled && (
          <div className="p-6 grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Kanal
                </label>
                <select
                  value={leaveData.channelId}
                  onChange={(e) =>
                    setLeaveData({ ...leaveData, channelId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#12131a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                >
                  <option value="">Kanal seçin</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      #{ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mesaj Türü
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setLeaveData({ ...leaveData, messageType: "normal" })
                    }
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                      leaveData.messageType === "normal"
                        ? "bg-accent/20 border-accent text-white"
                        : "bg-[#12131a] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    Normal Mesaj
                  </button>
                  <button
                    onClick={() =>
                      setLeaveData({ ...leaveData, messageType: "embed" })
                    }
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                      leaveData.messageType === "embed"
                        ? "bg-accent/20 border-accent text-white"
                        : "bg-[#12131a] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    Gömülü Mesaj
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mesaj
                </label>
                <textarea
                  value={leaveData.message}
                  onChange={(e) =>
                    setLeaveData({ ...leaveData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-[#12131a] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                  placeholder="{user} aramızdan ayrıldı 😢"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {["{user}", "{server}", "{count}"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setLeaveData({
                          ...leaveData,
                          message: leaveData.message + " " + tag,
                        })
                      }
                      className="px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={saveLeave}
                disabled={saving === "leave"}
                className="w-full"
              >
                {saving === "leave" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : saved === "leave" ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saved === "leave" ? "Kaydedildi!" : "Kaydet"}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Önizleme
              </label>
              <DiscordMessagePreview
                type={leaveData.messageType}
                content={parseMessage(leaveData.message)}
                username="GenelBot"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
