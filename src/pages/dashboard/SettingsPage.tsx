import { motion } from 'framer-motion';
import { User, Shield, LogOut, Calendar, Server } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export function SettingsPage() {
  const { user, logout } = useAuth();

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
    }
    return user?.avatarUrl || `https://cdn.discordapp.com/embed/avatars/0.png`;
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Ayarlar</h1>
        <p className="text-slate-400">Hesap bilgilerinizi ve güvenlik ayarlarını yönetin.</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 bg-surface rounded-xl border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Profil Bilgileri
        </h2>

        <div className="flex items-start gap-6">
          <img
            src={getAvatarUrl()}
            alt={user?.username || 'User'}
            className="w-24 h-24 rounded-xl"
          />
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider">Kullanıcı Adı</label>
                <p className="text-white font-medium">{user?.username}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider">Discord ID</label>
                <p className="text-white font-mono text-sm">{user?.id}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider">Görünen Ad</label>
                <p className="text-white">{user?.name || user?.username}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider">Plan</label>
                <p className="text-accent font-medium">Free</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Session Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-6 bg-surface rounded-xl border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Oturum Bilgileri
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Giriş Yöntemi</p>
            <p className="text-white flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 71 55" fill="currentColor">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3## 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.0384 50.6034 51.2558 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1099 30.1693C30.1099 34.1136 27.2802 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7680 23.0133 47.3178 23.0133C50.9040 23.0133 53.7543 26.2532 53.7099 30.1693C53.7099 34.1136 50.9040 37.3253 47.3178 37.3253Z"/>
              </svg>
              Discord OAuth2
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Oturum Durumu</p>
            <p className="text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Aktif
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-surface rounded-xl border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Güvenlik
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Oturumunuzu sonlandırarak tüm cihazlardan çıkış yapabilirsiniz.
        </p>
        <Button variant="secondary" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Çıkış Yap
        </Button>
      </motion.div>
    </div>
  );
}
