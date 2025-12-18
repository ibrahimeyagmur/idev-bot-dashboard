import { useNavigate } from 'react-router-dom';
import { Shield, Link2, Filter, Settings, UserX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function AutomationPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: Link2, title: 'Reklam Engelleme', description: 'Discord davetlerini ve linkleri otomatik engelleyin.' },
    { icon: Filter, title: 'Küfür Filtresi', description: 'Uygunsuz kelimeleri otomatik tespit edin ve silin.' },
    { icon: Settings, title: 'Özel Kurallar', description: 'Kanal ve rol istisnalarını ayarlayın.' },
    { icon: UserX, title: 'Otomatik Eylemler', description: 'Mesaj silme, uyarı veya zaman aşımı.' },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Moderasyon Sistemi
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Otomatik Moderasyon
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              Reklam ve küfür engelleme ile sunucunuzu 7/24 koruyun.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => isLoggedIn ? navigate('/dashboard') : login()}
            >
              {isLoggedIn ? "Dashboard'a Git" : 'Giriş Yap'}
            </Button>
          </div>

          {/* Right Content - Preview */}
          <Card className="p-0 overflow-hidden">
            <div className="bg-[#1e1f2a] p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-400">Moderasyon Önizleme</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Spam Message */}
              <div className="bg-[#12131a] rounded-lg p-4 opacity-50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-500/20 px-3 py-1 rounded text-red-400 text-xs font-medium">
                    SİLİNDİ
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">Spammer</span>
                    <span className="text-slate-500 text-sm ml-2">bugün 14:32</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm line-through">Herkese merhaba! discord.gg/xxx sunucumuza katılın!</p>
              </div>

              {/* Moderation Log */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
                <Link2 className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm text-red-400 font-medium">Reklam Engellendi</p>
                  <p className="text-xs text-slate-500">discord.gg/xxx linki tespit edildi ve silindi</p>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-center gap-3">
                <Filter className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm text-orange-400 font-medium">Küfür Engellendi</p>
                  <p className="text-xs text-slate-500">Uygunsuz kelime tespit edildi ve silindi</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
