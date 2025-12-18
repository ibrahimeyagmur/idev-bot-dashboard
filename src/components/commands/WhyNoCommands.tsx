import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Users } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    title: 'Daha Hızlı Kurulum',
    description: 'Komut ezberlemeye gerek yok. Panelden birkaç tıkla her şeyi ayarla.',
    color: '#f59e0b',
  },
  {
    icon: ShieldCheck,
    title: 'Daha Az Hata',
    description: 'Yanlış yazım, eksik parametre derdi yok. Görsel arayüzle hatasız yapılandırma.',
    color: '#22c55e',
  },
  {
    icon: Users,
    title: 'Herkes İçin Anlaşılır',
    description: 'Teknik bilgi gerektirmez. Sunucu yöneticileri kolayca kullanabilir.',
    color: '#675de6',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function WhyNoCommands() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#675de6]/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Neden Komut Yok?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Slash komutlar geçmişte kaldı. İşte web panel'in avantajları:
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <div 
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: `${reason.color}20` }}
                />

                {/* Card */}
                <div className="relative h-full p-8 bg-[#171821] rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${reason.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: reason.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {reason.description}
                  </p>

                  {/* Decorative Line */}
                  <div 
                    className="absolute bottom-0 left-8 right-8 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: reason.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
