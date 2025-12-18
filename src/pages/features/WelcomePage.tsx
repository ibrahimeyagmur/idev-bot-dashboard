import { useNavigate } from 'react-router-dom';
import { MessageSquare, Image, Mail, UserPlus, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function WelcomePage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: MessageSquare, title: 'Özelleştirilebilir Mesajlar', description: 'Değişkenlerle kişiselleştirilmiş karşılama mesajları oluşturun.' },
    { icon: Image, title: 'Görsel Kartlar', description: 'Profesyonel görünümlü karşılama kartları tasarlayın.' },
    { icon: Mail, title: 'DM Karşılama', description: 'Yeni üyelere özel mesaj gönderin.' },
    { icon: UserPlus, title: 'Otomatik Rol', description: 'Katılan üyelere otomatik rol atayın.' },
    { icon: Heart, title: 'Veda Mesajları', description: 'Ayrılan üyeler için özel mesajlar ayarlayın.' },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              Karşılama Sistemi
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Karşılama Mesajları
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              Yeni üyelerinizi sıcak bir şekilde karşılayın ve topluluğunuza dahil olmalarını sağlayın.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-blue-400" />
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
                <span className="ml-2 text-xs text-slate-400">Karşılama Önizleme</span>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-[#12131a] rounded-lg p-4 border border-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#675de6] to-[#8b7cf7] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ID</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#675de6]">IDev</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#675de6] text-white">BOT</span>
                      <span className="text-xs text-slate-500">Bugün 14:32</span>
                    </div>
                    <div className="bg-[#171821] rounded-lg p-4 border-l-4 border-[#675de6]">
                      <p className="text-white mb-2">🎉 <strong>Hoş geldin, @YeniÜye!</strong></p>
                      <p className="text-sm text-slate-400">Sunucumuza katıldığın için teşekkürler. Kuralları okumayı unutma!</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-slate-500">👥 1,234 üye</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
