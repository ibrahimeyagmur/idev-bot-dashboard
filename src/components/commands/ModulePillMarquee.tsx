import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Shield, 
  MessageCircle,
  Users,
  ClipboardList,
  Layout
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const modules = [
  { id: 'welcome', label: 'Karşılama & Veda', icon: MessageSquare, color: '#22c55e', path: 'welcome' },
  { id: 'levels', label: 'Seviye Sistemi', icon: TrendingUp, color: '#675de6', path: 'levels' },
  { id: 'embeds', label: 'Gömülü Mesajlar', icon: FileText, color: '#a855f7', path: 'embeds' },
  { id: 'roles', label: 'Tepki Rolleri', icon: Users, color: '#f59e0b', path: 'roles', coming: true },
  { id: 'automod', label: 'Otomatik Moderasyon', icon: Shield, color: '#ef4444', path: 'automod' },
  { id: 'autoreply', label: 'Otomatik Cevap', icon: MessageCircle, color: '#06b6d4', path: 'autoreply' },
  { id: 'logs', label: 'Log / Denetim', icon: ClipboardList, color: '#64748b', path: 'logs', coming: true },
  { id: 'templates', label: 'Şablonlar', icon: Layout, color: '#ec4899', path: 'templates', coming: true },
];

export function ModulePillMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const handleModuleClick = (module: typeof modules[0]) => {
    if (module.coming) return;
    if (isLoggedIn) {
      navigate(`/dashboard`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Panel Modülleri
          </h2>
          <p className="text-slate-400">
            Sürükleyerek keşfet, tıklayarak yönet
          </p>
        </motion.div>
      </div>

      {/* Draggable Container */}
      <div 
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
      >
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#12131a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#12131a] to-transparent z-10 pointer-events-none" />

        <motion.div
          drag="x"
          dragConstraints={{ left: -800, right: 100 }}
          style={{ x: springX }}
          className="flex gap-4 px-8 py-4"
        >
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 0 30px ${module.color}30`
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModuleClick(module)}
                className={`
                  relative flex-shrink-0 flex items-center gap-3 px-6 py-4 
                  bg-[#171821] rounded-2xl border border-white/10
                  transition-colors group
                  ${module.coming ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-white/20'}
                `}
                style={{
                  boxShadow: `0 0 0 1px ${module.color}10`
                }}
              >
                {/* Glow on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${module.color}10 0%, transparent 70%)`
                  }}
                />

                <div 
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${module.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: module.color }} />
                </div>

                <div className="relative">
                  <p className="font-semibold text-white whitespace-nowrap">
                    {module.label}
                  </p>
                  {module.coming && (
                    <span className="text-xs text-slate-500">Yakında</span>
                  )}
                </div>

                {module.coming && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-slate-700 rounded-full text-[10px] text-slate-300 font-medium">
                    SOON
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-slate-500 mt-4"
      >
        ← Sürükle →
      </motion.p>
    </section>
  );
}
