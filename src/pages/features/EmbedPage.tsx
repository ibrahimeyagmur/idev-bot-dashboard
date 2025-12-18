import { useNavigate } from 'react-router-dom';
import { FileText, Palette, Image, Clock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function EmbedPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: FileText, title: 'Görsel Oluşturucu', description: 'Sürükle-bırak ile embed oluşturun.' },
    { icon: Palette, title: 'Renk Özelleştirme', description: 'Embed renklerini markanıza uygun yapın.' },
    { icon: Image, title: 'Medya Desteği', description: 'Resim ve thumbnail ekleyin.' },
    { icon: Clock, title: 'Zamanlanmış Gönderim', description: 'Embedleri otomatik gönderin.' },
    { icon: Save, title: 'Şablonlar', description: 'Sık kullandığınız embedleri kaydedin.' },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              Embed Sistemi
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Gömülü Mesajlar
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              Profesyonel görünümlü embed mesajlar oluşturun ve sunucunuzu güzelleştirin.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-purple-400" />
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
                <span className="ml-2 text-xs text-slate-400">Embed Önizleme</span>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-[#12131a] rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-semibold text-purple-400">Sunucu Duyurusu</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">🎉 Yeni Güncelleme!</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Bot büyük bir güncelleme aldı! Yeni özellikler:
                </p>
                
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-slate-400">• Gelişmiş seviye sistemi</p>
                  <p className="text-sm text-slate-400">• Yeni moderasyon araçları</p>
                  <p className="text-sm text-slate-400">• Performans iyileştirmeleri</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>📅 15 Aralık 2024</span>
                  <span>👁️ 1,234 görüntüleme</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
