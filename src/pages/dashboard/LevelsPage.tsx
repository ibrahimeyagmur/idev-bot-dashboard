import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDashboardInit } from "../../context/DashboardContext";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Save,
  Loader2,
  Check,
  Hash,
  Plus,
  Trash2,
  Award,
  Zap,
  Clock,
  MessageSquare,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

interface LevelData {
  enabled: boolean;
  xpPerMessage: number;
  cooldown: number;
  levelUpMessage: string;
  levelUpChannelId: string;
  roles: { level: number; roleId: string }[];
}

const defaultLevelData: LevelData = {
  enabled: false,
  xpPerMessage: 15,
  cooldown: 60,
  levelUpMessage: "🎉 Tebrikler {user}! Artık **Seviye {level}** oldun!",
  levelUpChannelId: "",
  roles: [],
};

export function LevelsPage() {
  const { serverId } = useParams();
  const {
    channels,
    roles,
    settings,
    isLoading: contextLoading,
  } = useDashboardInit(serverId);
  const [levelData, setLevelData] = useState<LevelData>(defaultLevelData);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!contextLoading && settings) {
      if (settings.levels)
        setLevelData({ ...defaultLevelData, ...settings.levels });
      setIsLoading(false);
    }
  }, [contextLoading, settings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/server/${serverId}/levels`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(levelData),
        }
      );

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const addRoleReward = () => {
    setLevelData((prev) => ({
      ...prev,
      roles: [...prev.roles, { level: 1, roleId: "" }],
    }));
  };

  const updateRoleReward = (
    index: number,
    field: "level" | "roleId",
    value: any
  ) => {
    setLevelData((prev) => ({
      ...prev,
      roles: prev.roles.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      ),
    }));
  };

  const removeRoleReward = (index: number) => {
    setLevelData((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
  };

  const calculateLevel = (xp: number): number => {
    return Math.floor(0.1 * Math.sqrt(xp));
  };

  const calculateXpForLevel = (level: number): number => {
    return Math.pow(level / 0.1, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 via-accent/20 to-pink-500/20 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-accent">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Seviye Sistemi
              </h1>
              <p className="text-slate-300">
                Üyelerinizin aktivitesini ödüllendirin ve rekabeti artırın
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={levelData.enabled}
              onChange={(e) =>
                setLevelData((prev) => ({ ...prev, enabled: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </motion.div>

      {!levelData.enabled && (
        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
          <Sparkles className="w-4 h-4" />
          Ayarları düzenlemek için sistemi aktif edin.
        </div>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${
          !levelData.enabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-surface rounded-xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm text-slate-400">Mesaj Başına XP</span>
          </div>
          <input
            type="number"
            value={levelData.xpPerMessage}
            onChange={(e) =>
              setLevelData((prev) => ({
                ...prev,
                xpPerMessage: parseInt(e.target.value) || 0,
              }))
            }
            min={1}
            max={100}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-2xl font-bold text-white focus:outline-none focus:border-accent/50 text-center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 bg-surface rounded-xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Cooldown (saniye)</span>
          </div>
          <input
            type="number"
            value={levelData.cooldown}
            onChange={(e) =>
              setLevelData((prev) => ({
                ...prev,
                cooldown: parseInt(e.target.value) || 0,
              }))
            }
            min={0}
            max={3600}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-2xl font-bold text-white focus:outline-none focus:border-accent/50 text-center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-surface rounded-xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-slate-400">XP/Dakika</span>
          </div>
          <div className="text-2xl font-bold text-white text-center py-3">
            ~
            {levelData.cooldown > 0
              ? Math.round((60 / levelData.cooldown) * levelData.xpPerMessage)
              : levelData.xpPerMessage}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={`mb-6 p-6 bg-surface rounded-xl border border-white/10 ${
          !levelData.enabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Seviye Gereksinimleri
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[5, 10, 25, 50].map((level) => (
            <div key={level} className="p-4 bg-white/5 rounded-xl text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">{level}</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Seviye {level}</p>
              <p className="text-white font-semibold">
                {Math.round(calculateXpForLevel(level)).toLocaleString()} XP
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ~
                {Math.round(
                  calculateXpForLevel(level) / levelData.xpPerMessage
                )}{" "}
                mesaj
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mb-6 p-6 bg-surface rounded-xl border border-white/10 ${
          !levelData.enabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Seviye Atlama Bildirimi
        </h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Hash className="w-4 h-4" />
              Bildirim Kanalı
            </label>
            <select
              value={levelData.levelUpChannelId}
              onChange={(e) =>
                setLevelData((prev) => ({
                  ...prev,
                  levelUpChannelId: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
            >
              <option value="">Aynı kanalda</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  #{ch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Mesaj
            </label>
            <textarea
              value={levelData.levelUpMessage}
              onChange={(e) =>
                setLevelData((prev) => ({
                  ...prev,
                  levelUpMessage: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Değişkenler: {"{user}"} {"{level}"} {"{xp}"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mb-6 p-6 bg-surface rounded-xl border border-white/10 ${
          !levelData.enabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Rol Ödülleri
          </h2>
          <Button size="sm" onClick={addRoleReward}>
            <Plus className="w-4 h-4 mr-1" />
            Ekle
          </Button>
        </div>

        {levelData.roles.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            Henüz rol ödülü eklenmemiş
          </p>
        ) : (
          <div className="space-y-3">
            {levelData.roles.map((roleReward, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      Seviye
                    </label>
                    <input
                      type="number"
                      value={roleReward.level}
                      onChange={(e) =>
                        updateRoleReward(
                          index,
                          "level",
                          parseInt(e.target.value) || 1
                        )
                      }
                      min={1}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      Rol
                    </label>
                    <select
                      value={roleReward.roleId}
                      onChange={(e) =>
                        updateRoleReward(index, "roleId", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent/50"
                    >
                      <option value="">Rol seçin</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => removeRoleReward(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <div
        className={`flex justify-end ${
          !levelData.enabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Button onClick={saveSettings} disabled={saving || !levelData.enabled}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : saved ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </div>
  );
}
