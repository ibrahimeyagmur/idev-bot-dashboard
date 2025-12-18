import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, BarChart3, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function LevelPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: TrendingUp, title: 'XP Sistemi', description: 'Mesaj ve aktiviteye göre XP kazanın.' },
    { icon: Award, title: 'Seviye Kartları', description: 'Özelleştirilebilir rank kartları ile seviyenizi gösterin.' },
    { icon: Crown, title: 'Seviye Rolleri', description: 'Belirli seviyelere ulaşınca otomatik rol alın.' },
    { icon: BarChart3, title: 'Liderlik Tablosu', description: 'Sunucunun en aktif üyelerini görün.' },
    { icon: Zap, title: 'XP Çarpanları', description: 'Belirli roller veya kanallar için bonus XP.' },
  ];

  const leaderboard = [
    { rank: 1, name: 'ProGamer', level: 45, xp: 12500 },
    { rank: 2, name: 'Aktif_User', level: 42, xp: 11200 },
    { rank: 3, name: 'ChatMaster', level: 38, xp: 9800 },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Seviye Sistemi
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Seviye Sistemi
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              Üyelerinizin aktivitesini ödüllendirin ve topluluğunuzda rekabeti artırın.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-yellow-400" />
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
                <span className="ml-2 text-xs text-slate-400">Liderlik Tablosu</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      user.rank === 1 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-black' :
                      user.rank === 2 ? 'bg-slate-400 text-black' :
                      'bg-orange-600 text-white'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">Seviye {user.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-400">{user.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar Example */}
              <div className="mt-6 p-4 bg-[#12131a] rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Seviye 15</span>
                  <span className="text-xs text-slate-400">2,450 / 3,000 XP</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
