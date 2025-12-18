import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  TrendingUp,
  Palette,
  Shield,
  MessageCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Loader2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface SystemStatus {
  welcome: { enabled: boolean };
  leave: { enabled: boolean };
  levels: { enabled: boolean };
  automod: {
    antiAd: { enabled: boolean };
    profanity: { enabled: boolean };
  };
  autoreply: { enabled: boolean };
}

const systemCards = [
  {
    id: 'welcome',
    title: 'Karşılama & Veda',
    description: 'Yeni üyeleri karşılayın ve ayrılanları uğurlayın.',
    icon: MessageSquare,
    path: '/welcome',
    color: 'from-blue-500 to-cyan-500',
    getStatus: (s: SystemStatus) => s.welcome?.enabled || s.leave?.enabled,
  },
  {
    id: 'autoreply',
    title: 'Otomatik Cevap',
    description: 'Belirli kelimelere otomatik yanıt verin.',
    icon: MessageCircle,
    path: '/autoreply',
    color: 'from-green-500 to-emerald-500',
    getStatus: (s: SystemStatus) => s.autoreply?.enabled,
  },
  {
    id: 'automod',
    title: 'Otomatik Moderasyon',
    description: 'Reklam ve küfür engelleme sistemi.',
    icon: Shield,
    path: '/automod',
    color: 'from-red-500 to-orange-500',
    getStatus: (s: SystemStatus) => s.automod?.antiAd?.enabled || s.automod?.profanity?.enabled,
  },
  {
    id: 'levels',
    title: 'Seviye Sistemi',
    description: 'Üyelerinizin aktivitesini ödüllendirin.',
    icon: TrendingUp,
    path: '/levels',
    color: 'from-purple-500 to-pink-500',
    getStatus: (s: SystemStatus) => s.levels?.enabled,
  },
  {
    id: 'embeds',
    title: 'Gömülü Mesajlar',
    description: 'Profesyonel embed mesajlar oluşturun.',
    icon: Palette,
    path: '/embeds',
    color: 'from-amber-500 to-yellow-500',
    getStatus: () => true,
  },
];

export function OverviewPage() {
  const { serverId } = useParams();
  const [settings, setSettings] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [botInstalled, setBotInstalled] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/server/${serverId}/settings`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setBotInstalled(true);
        } else if (res.status === 409) {
          setBotInstalled(false);
        }
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };

    if (serverId) fetchSettings();
  }, [serverId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Kontrol Paneli</h1>
        <p className="text-slate-400">
          Sunucu ayarlarınızı buradan yönetin ve sistemleri yapılandırın.
        </p>
      </div>

      {/* Bot Health Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-surface rounded-xl border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent" />
          Sunucu Durumu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            {botInstalled ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <div>
              <p className="text-sm font-medium text-white">Bot Durumu</p>
              <p className="text-xs text-slate-400">
                {botInstalled ? 'Kurulu ve aktif' : 'Kurulu değil'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">Yetkiler</p>
              <p className="text-xs text-slate-400">Yönetici yetkiniz var</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            {settings ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <p className="text-sm font-medium text-white">Ayarlar</p>
              <p className="text-xs text-slate-400">
                {settings ? 'Yüklendi' : 'Yüklenemedi'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemCards.map((card, index) => {
          const Icon = card.icon;
          const isEnabled = settings ? card.getStatus(settings) : false;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/dashboard/${serverId}${card.path}`}
                className="block p-6 bg-surface rounded-xl border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      isEnabled
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {isEnabled ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4">{card.description}</p>
                <div className="flex items-center text-sm text-accent">
                  Yapılandır
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
