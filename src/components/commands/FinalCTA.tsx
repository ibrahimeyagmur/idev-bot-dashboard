import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function FinalCTA() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  const handleAddBot = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`,
      '_blank'
    );
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#675de6]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Komut Yerine{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#675de6] to-[#8b7cf7]">
              Kontrol
            </span>
          </h2>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Artık komut ezberlemek yok. Panelden her şeyi görsel olarak yönet, 
            değişiklikleri anında gör, hataları minimize et.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={handleDashboard}>
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Sunucu Seç
            </Button>
            <Button variant="secondary" size="lg" onClick={handleAddBot}>
              <Plus className="w-5 h-5 mr-2" />
              Botu Ekle
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-slate-500">Komut ezberle</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#675de6]">6+</p>
              <p className="text-sm text-slate-500">Panel modülü</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">∞</p>
              <p className="text-sm text-slate-500">Özelleştirme</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
