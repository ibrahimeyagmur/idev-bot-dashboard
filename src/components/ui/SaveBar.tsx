import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, Check } from 'lucide-react';
import { Button } from './Button';

interface SaveBarProps {
  show: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function SaveBar({ show, saving, saved, onSave, onReset }: SaveBarProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="max-w-[800px] mx-auto pointer-events-auto">
            <div className="bg-[#1e1f22] border border-white/10 rounded-lg shadow-2xl p-4 flex items-center justify-between gap-4">
              <p className="text-slate-300 text-sm">
                Dikkat! Kaydedilmemiş değişiklikleriniz var.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onReset}
                  disabled={saving}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:underline transition-colors disabled:opacity-50"
                >
                  Sıfırla
                </button>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="!py-2 !px-4"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : saved ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saved ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
