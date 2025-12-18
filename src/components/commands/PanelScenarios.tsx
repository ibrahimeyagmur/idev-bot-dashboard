import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, MessageCircle, FileText, Check } from 'lucide-react';

const scenarios = [
  {
    id: 'welcome',
    label: 'Karşılama Mesajı',
    icon: MessageSquare,
    color: '#22c55e',
    bullets: [
      'Kanal seç',
      'Mesaj yaz veya embed oluştur',
      'Değişkenleri kullan: {user}, {server}',
      'Kaydet ve aktif et',
    ],
    preview: {
      type: 'welcome',
      content: 'Hoş geldin {user}! 🎉 Sunucumuzun 1,234. üyesisin.',
    },
  },
  {
    id: 'automod',
    label: 'Reklam Engel',
    icon: Shield,
    color: '#ef4444',
    bullets: [
      'Reklam engelini aç',
      'İstisna kanalları seç',
      'İstisna rolleri belirle',
      'Eylem türünü seç: Sil / Uyar / Timeout',
    ],
    preview: {
      type: 'automod',
      content: 'discord.gg/xxx linki engellendi',
    },
  },
  {
    id: 'autoreply',
    label: 'Otomatik Cevap',
    icon: MessageCircle,
    color: '#06b6d4',
    bullets: [
      'Tetikleyici kelime belirle',
      'Eşleşme türü: İçerir / Tam',
      'Yanıt mesajını yaz',
      'Kuralı aktif et',
    ],
    preview: {
      type: 'autoreply',
      keyword: 'merhaba',
      response: 'Merhaba! 👋 Nasıl yardımcı olabilirim?',
    },
  },
  {
    id: 'embed',
    label: 'Embed Oluştur',
    icon: FileText,
    color: '#a855f7',
    bullets: [
      'Başlık ve açıklama ekle',
      'Renk seç',
      'Resim/thumbnail ekle',
      'Kanala gönder',
    ],
    preview: {
      type: 'embed',
      title: '📢 Duyuru',
      description: 'Yeni güncelleme yayında!',
    },
  },
];

export function PanelScenarios() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Panelde Neler Var?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Her sistem için görsel arayüz. Tıkla, ayarla, kaydet.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Scenario Switcher */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              const isActive = activeScenario.id === scenario.id;
              return (
                <motion.button
                  key={scenario.id}
                  onClick={() => setActiveScenario(scenario)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-white/5 border-white/20'
                      : 'bg-transparent border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${scenario.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: scenario.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{scenario.label}</h3>
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1.5 overflow-hidden"
                          >
                            {scenario.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                <Check className="w-3.5 h-3.5" style={{ color: scenario.color }} />
                                {bullet}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Right - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-24"
          >
            <div className="bg-[#171821] rounded-2xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#12131a]">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-slate-500">Discord Önizleme</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScenario.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeScenario.preview.type === 'welcome' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#675de6] flex items-center justify-center">
                            <span className="text-white font-bold">I</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#675de6]">IDev Bot</span>
                            <span className="text-slate-500 text-xs ml-2">bugün 12:00</span>
                          </div>
                        </div>
                        <div className="ml-12 p-4 bg-[#12131a] rounded-lg border-l-4" style={{ borderColor: activeScenario.color }}>
                          <p className="text-slate-300">{activeScenario.preview.content}</p>
                        </div>
                      </div>
                    )}

                    {activeScenario.preview.type === 'automod' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-[#12131a] rounded-lg opacity-50 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                              SİLİNDİ
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-600" />
                            <span className="text-white text-sm">Spammer</span>
                          </div>
                          <p className="text-slate-400 text-sm line-through">
                            Herkese merhaba! {activeScenario.preview.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <Shield className="w-5 h-5 text-red-400" />
                          <div>
                            <p className="text-sm text-red-400 font-medium">Reklam Engellendi</p>
                            <p className="text-xs text-slate-500">Link tespit edildi ve silindi</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScenario.preview.type === 'autoreply' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-sm">👤</span>
                          </div>
                          <div>
                            <span className="font-medium text-white text-sm">Kullanıcı</span>
                            <span className="text-slate-500 text-xs ml-2">şimdi</span>
                          </div>
                        </div>
                        <p className="ml-10 text-slate-300 text-sm">{activeScenario.preview.keyword}</p>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <div className="w-8 h-8 rounded-full bg-[#675de6] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">I</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#675de6] text-sm">IDev Bot</span>
                            <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">OTOMATİK</span>
                          </div>
                        </div>
                        <p className="ml-10 text-slate-300 text-sm">{activeScenario.preview.response}</p>
                      </div>
                    )}

                    {activeScenario.preview.type === 'embed' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#675de6] flex items-center justify-center">
                            <span className="text-white font-bold">I</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#675de6]">IDev Bot</span>
                            <span className="text-slate-500 text-xs ml-2">bugün 15:30</span>
                          </div>
                        </div>
                        <div className="ml-12 p-4 bg-[#12131a] rounded-lg border-l-4" style={{ borderColor: activeScenario.color }}>
                          <h4 className="font-semibold text-white mb-1">{activeScenario.preview.title}</h4>
                          <p className="text-slate-400 text-sm">{activeScenario.preview.description}</p>
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-slate-500">IDev Bot • Bugün 15:30</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
