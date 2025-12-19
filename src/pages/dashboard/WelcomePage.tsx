import { useState, useEffect, useRef } from 'react';
import { useParams, useBlocker } from 'react-router-dom';
import { useDashboardInit } from '../../context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Save,
  Loader2,
  Check,
  Hash,
  UserPlus,
  UserMinus,
  AlertTriangle,
  Palette,
  Type,
  Image,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DiscordMessagePreview } from '../../components/server/DiscordMessagePreview';
import { API_BASE } from '../../lib/api';


interface EmbedData {
  title: string;
  description: string;
  color: string;
  thumbnail: string;
  image: string;
  footer: string;
}

interface WelcomeData {
  enabled: boolean;
  channelId: string;
  messageType: 'normal' | 'embed';
  message: string;
  embed?: EmbedData;
}

interface LeaveData {
  enabled: boolean;
  channelId: string;
  messageType: 'normal' | 'embed';
  message: string;
  embed?: EmbedData;
}

const defaultEmbed: EmbedData = {
  title: '',
  description: '',
  color: '#5865F2',
  thumbnail: '',
  image: '',
  footer: '',
};

const defaultWelcome: WelcomeData = {
  enabled: false,
  channelId: '',
  messageType: 'normal',
  message: 'Hoş geldin {user}! Sunucumuzun {count}. üyesisin!',
  embed: { ...defaultEmbed },
};

const defaultLeave: LeaveData = {
  enabled: false,
  channelId: '',
  messageType: 'normal',
  message: '{user} sunucudan ayrıldı. Artık {count} üyeyiz.',
  embed: { ...defaultEmbed },
};

export function WelcomePage() {
  const { serverId } = useParams();
  const { channels, settings, isLoading: contextLoading } = useDashboardInit(serverId);
  const [welcomeData, setWelcomeData] = useState<WelcomeData>(defaultWelcome);
  const [leaveData, setLeaveData] = useState<LeaveData>(defaultLeave);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ welcome?: string; leave?: string }>({});
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const initialDataRef = useRef<{ welcome: WelcomeData; leave: LeaveData } | null>(null);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowUnsavedModal(true);
      pendingNavigationRef.current = () => blocker.proceed();
    }
  }, [blocker]);

  useEffect(() => {
    if (initialDataRef.current) {
      const hasChanges =
        JSON.stringify(welcomeData) !== JSON.stringify(initialDataRef.current.welcome) ||
        JSON.stringify(leaveData) !== JSON.stringify(initialDataRef.current.leave);
      setHasUnsavedChanges(hasChanges);
    }
  }, [welcomeData, leaveData]);

  useEffect(() => {
    if (!contextLoading && settings) {
      const welcomeFromServer = { ...defaultWelcome, ...settings.welcome, embed: { ...defaultEmbed, ...settings.welcome?.embed } };
      const leaveFromServer = { ...defaultLeave, ...settings.leave, embed: { ...defaultEmbed, ...settings.leave?.embed } };
      setWelcomeData(welcomeFromServer);
      setLeaveData(leaveFromServer);
      initialDataRef.current = { welcome: welcomeFromServer, leave: leaveFromServer };
      setIsLoading(false);
    }
  }, [contextLoading, settings]);

  const validateData = (type: 'welcome' | 'leave', data: WelcomeData | LeaveData): boolean => {
    if (data.enabled) {
      if (!data.channelId) {
        setValidationErrors(prev => ({ ...prev, [type]: 'Kanal seçimi zorunludur' }));
        return false;
      }
      if (data.messageType === 'normal' && !data.message.trim()) {
        setValidationErrors(prev => ({ ...prev, [type]: 'Mesaj zorunludur' }));
        return false;
      }
      if (data.messageType === 'embed' && !data.embed?.description.trim()) {
        setValidationErrors(prev => ({ ...prev, [type]: 'Embed açıklaması zorunludur' }));
        return false;
      }
    }
    setValidationErrors(prev => ({ ...prev, [type]: undefined }));
    return true;
  };

  const saveSettings = async (type: 'welcome' | 'leave') => {
    const data = type === 'welcome' ? welcomeData : leaveData;
    
    if (!validateData(type, data)) return;
    
    setSaving(type);
    try {
      const res = await fetch(`${API_BASE}/api/server/${serverId}/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaved(type);
        setTimeout(() => setSaved(null), 2000);
        if (type === 'welcome') {
          initialDataRef.current = { ...initialDataRef.current!, welcome: { ...welcomeData } };
        } else {
          initialDataRef.current = { ...initialDataRef.current!, leave: { ...leaveData } };
        }
        setHasUnsavedChanges(false);
      }
    } catch {
    } finally {
      setSaving(null);
    }
  };

  const getPreviewMessage = (message: string) => {
    return message
      .replace(/{user}/g, '@Kullanıcı')
      .replace(/{count}/g, '1234')
      .replace(/{server}/g, 'Sunucu Adı');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const updateEmbed = (data: WelcomeData | LeaveData, setData: (data: any) => void, field: keyof EmbedData, value: string) => {
    setData({
      ...data,
      embed: { ...data.embed, [field]: value },
    });
  };

  const renderSection = (
    type: 'welcome' | 'leave',
    title: string,
    icon: React.ReactNode,
    data: WelcomeData | LeaveData,
    setData: (data: any) => void
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 bg-surface rounded-xl border ${validationErrors[type] ? 'border-red-500/50' : 'border-white/10'}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-slate-400">
              {type === 'welcome' ? 'Yeni üyeleri karşılayın' : 'Ayrılan üyeleri uğurlayın'}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => setData({ ...data, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
        </label>
      </div>

      {validationErrors[type] && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {validationErrors[type]}
        </div>
      )}

      {!data.enabled && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          Ayarları düzenlemek için sistemi aktif edin.
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!data.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Hash className="w-4 h-4" />
              Kanal <span className="text-red-400">*</span>
            </label>
            <select
              value={data.channelId}
              onChange={(e) => setData({ ...data, channelId: e.target.value })}
              disabled={!data.enabled}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50 disabled:cursor-not-allowed"
            >
              <option value="">Kanal seçin</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>#{ch.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Mesaj Türü</label>
            <div className="flex gap-2">
              <button
                onClick={() => setData({ ...data, messageType: 'normal' })}
                disabled={!data.enabled}
                className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                  data.messageType === 'normal'
                    ? 'bg-accent border-accent text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                } disabled:cursor-not-allowed`}
              >
                Normal
              </button>
              <button
                onClick={() => setData({ ...data, messageType: 'embed' })}
                disabled={!data.enabled}
                className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                  data.messageType === 'embed'
                    ? 'bg-accent border-accent text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                } disabled:cursor-not-allowed`}
              >
                Embed
              </button>
            </div>
          </div>

          {data.messageType === 'normal' && (
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Mesaj <span className="text-red-400">*</span>
              </label>
              <textarea
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                placeholder="Mesajınızı yazın..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Değişkenler: {'{user}'} {'{count}'} {'{server}'}
              </p>
            </div>
          )}

          {data.messageType === 'embed' && (
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Type className="w-4 h-4" />
                  Başlık
                </label>
                <input
                  type="text"
                  value={data.embed?.title || ''}
                  onChange={(e) => updateEmbed(data, setData, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
                  placeholder="Embed başlığı"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <FileText className="w-4 h-4" />
                  Açıklama <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={data.embed?.description || ''}
                  onChange={(e) => updateEmbed(data, setData, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50 resize-none"
                  placeholder="Embed açıklaması..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Değişkenler: {'{user}'} {'{count}'} {'{server}'}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Palette className="w-4 h-4" />
                  Renk
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.embed?.color || '#5865F2'}
                    onChange={(e) => updateEmbed(data, setData, 'color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.embed?.color || '#5865F2'}
                    onChange={(e) => updateEmbed(data, setData, 'color', e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent/50"
                    placeholder="#5865F2"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Image className="w-4 h-4" />
                  Küçük Resim URL
                </label>
                <input
                  type="text"
                  value={data.embed?.thumbnail || ''}
                  onChange={(e) => updateEmbed(data, setData, 'thumbnail', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Image className="w-4 h-4" />
                  Büyük Resim URL
                </label>
                <input
                  type="text"
                  value={data.embed?.image || ''}
                  onChange={(e) => updateEmbed(data, setData, 'image', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Alt Yazı
                </label>
                <input
                  type="text"
                  value={data.embed?.footer || ''}
                  onChange={(e) => updateEmbed(data, setData, 'footer', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
                  placeholder="Alt yazı"
                />
              </div>
            </div>
          )}

          <Button onClick={() => saveSettings(type)} disabled={saving === type}>
            {saving === type ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : saved === type ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved === type ? 'Kaydedildi!' : 'Kaydet'}
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Önizleme</label>
          <DiscordMessagePreview
            type={data.messageType}
            content={data.messageType === 'normal' ? getPreviewMessage(data.message) : getPreviewMessage(data.embed?.description || '')}
            username="IDev"
            embedColor={data.embed?.color || '#5865F2'}
            embedTitle={data.embed?.title}
            embedFooter={data.embed?.footer}
            embedImage={data.embed?.image}
            embedThumbnail={data.embed?.thumbnail}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Karşılama & Veda</h1>
        <p className="text-slate-400">
          Yeni üyeleri karşılayın ve ayrılan üyeleri uğurlayın.
        </p>
      </div>

      <div className="space-y-6">
        {renderSection(
          'welcome',
          'Karşılama Mesajı',
          <div className="p-3 rounded-xl bg-green-500/20">
            <UserPlus className="w-6 h-6 text-green-400" />
          </div>,
          welcomeData,
          setWelcomeData
        )}

        {renderSection(
          'leave',
          'Veda Mesajı',
          <div className="p-3 rounded-xl bg-red-500/20">
            <UserMinus className="w-6 h-6 text-red-400" />
          </div>,
          leaveData,
          setLeaveData
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
                  <h3 className="text-lg font-semibold text-white">Kaydedilmemiş Değişiklikler</h3>
                  <p className="text-sm text-slate-400">Değişiklikleriniz kaybolacak!</p>
                </div>
              </div>

              <p className="text-slate-300 mb-6">
                Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinizden emin misiniz?
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
