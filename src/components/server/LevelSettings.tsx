import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Loader2, 
  Check,
  TrendingUp,
  Plus,
  Trash2,
  Hash,
  Award
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { LevelData, Channel, Role } from '../../pages/ServerDashboard';

interface Props {
  serverId: string;
  data: LevelData;
  channels: Channel[];
  roles: Role[];
  onUpdate: (data: LevelData) => void;
  onUnsavedChange: (hasChanges: boolean) => void;
}

const defaultLevelData: LevelData = {
  enabled: false,
  xpPerMessage: 15,
  cooldown: 60,
  levelUpMessage: '🎉 {user} seviye {level} oldu!',
  levelUpChannelId: '',
  roles: [],
};

export function LevelSettings({ serverId, data, channels, roles, onUpdate, onUnsavedChange }: Props) {
  const [levelData, setLevelData] = useState<LevelData>({
    ...defaultLevelData,
    ...data,
    levelUpMessage: data.levelUpMessage || defaultLevelData.levelUpMessage,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const hasChanges = JSON.stringify(levelData) !== JSON.stringify(data);
    onUnsavedChange(hasChanges);
  }, [levelData, data, onUnsavedChange]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/api/server/${serverId}/levels`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(levelData),
      });
      
      if (res.ok) {
        const { data: newData } = await res.json();
        onUpdate(newData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save level settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const addRoleReward = () => {
    setLevelData({
      ...levelData,
      roles: [...levelData.roles, { level: 5, roleId: '' }],
    });
  };

  const removeRoleReward = (index: number) => {
    setLevelData({
      ...levelData,
      roles: levelData.roles.filter((_, i) => i !== index),
    });
  };

  const updateRoleReward = (index: number, field: 'level' | 'roleId', value: number | string) => {
    const newRoles = [...levelData.roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setLevelData({ ...levelData, roles: newRoles });
  };

  const calculateLevel = (xp: number) => Math.floor(0.1 * Math.sqrt(xp));
  const calculateXpForLevel = (level: number) => Math.pow(level / 0.1, 2);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-white/10 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Seviye Sistemi</h2>
                <p className="text-sm text-slate-400">Üyeler mesaj attıkça XP kazanır ve seviye atlar</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={levelData.enabled}
                onChange={(e) => setLevelData({ ...levelData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>

        {levelData.enabled && (
          <div className="p-6 space-y-6">
            {/* XP Settings */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* XP Per Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mesaj Başına XP
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={levelData.xpPerMessage}
                    onChange={(e) => setLevelData({ ...levelData, xpPerMessage: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <span className="w-12 text-center text-white font-medium bg-[#12131a] px-3 py-1.5 rounded-lg">
                    {levelData.xpPerMessage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Her mesaj için kazanılacak XP miktarı</p>
              </div>

              {/* Cooldown */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bekleme Süresi (saniye)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={levelData.cooldown}
                    onChange={(e) => setLevelData({ ...levelData, cooldown: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <span className="w-12 text-center text-white font-medium bg-[#12131a] px-3 py-1.5 rounded-lg">
                    {levelData.cooldown}s
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Mesajlar arası minimum bekleme süresi</p>
              </div>
            </div>

            {/* Level Up Message */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Seviye Atlama Mesajı
              </label>
              <textarea
                value={levelData.levelUpMessage}
                onChange={(e) => setLevelData({ ...levelData, levelUpMessage: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-[#12131a] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                placeholder="🎉 {user} seviye {level} oldu!"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {['{user}', '{level}', '{xp}'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setLevelData({ ...levelData, levelUpMessage: levelData.levelUpMessage + ' ' + tag })}
                    className="px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Up Channel */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Seviye Atlama Kanalı
              </label>
              <select
                value={levelData.levelUpChannelId}
                onChange={(e) => setLevelData({ ...levelData, levelUpChannelId: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#12131a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
              >
                <option value="">Mesajın gönderildiği kanal</option>
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>#{ch.name}</option>
                ))}
              </select>
            </div>

            {/* Role Rewards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Award className="w-4 h-4" />
                  Rol Ödülleri
                </label>
                <Button variant="secondary" size="sm" onClick={addRoleReward}>
                  <Plus className="w-4 h-4 mr-1" />
                  Ekle
                </Button>
              </div>

              {levelData.roles.length === 0 ? (
                <div className="text-center py-8 bg-[#12131a] rounded-lg border border-dashed border-white/10">
                  <Award className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Henüz rol ödülü eklenmemiş</p>
                  <p className="text-slate-500 text-xs mt-1">Belirli seviyelerde otomatik rol verilebilir</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {levelData.roles.map((reward, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-[#12131a] rounded-lg border border-white/10"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Seviye</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={reward.level}
                            onChange={(e) => updateRoleReward(index, 'level', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 bg-[#171821] border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Rol</label>
                          <select
                            value={reward.roleId}
                            onChange={(e) => updateRoleReward(index, 'roleId', e.target.value)}
                            className="w-full px-3 py-2 bg-[#171821] border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                          >
                            <option value="">Rol seçin</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>{role.name}</option>
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* XP Calculator Preview */}
            <div className="p-4 bg-[#12131a] rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-slate-300 mb-3">XP Hesaplayıcı</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{levelData.xpPerMessage * 10}</div>
                  <div className="text-xs text-slate-400">10 mesaj = XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {Math.round(calculateXpForLevel(5))}
                  </div>
                  <div className="text-xs text-slate-400">Level 5 için XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(calculateXpForLevel(5) / levelData.xpPerMessage)}
                  </div>
                  <div className="text-xs text-slate-400">Level 5 için mesaj</div>
                </div>
              </div>
            </div>

            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : saved ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saved ? 'Kaydedildi!' : 'Kaydet'}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
