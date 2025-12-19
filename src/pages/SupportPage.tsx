import {
  MessageCircle,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type FAQ } from "../lib/api";
import { Button } from "../components/ui/Button";
import { mockFAQ } from "../data/mockFeatures";

export function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [faqList, setFaqList] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const data = await api.getFAQ();
        setFaqList(data.length > 0 ? data : mockFAQ);
      } catch (error) {
        console.error("Failed to fetch FAQ:", error);
        setFaqList(mockFAQ);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFAQ();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#675de6]/10 border border-[#675de6]/20 text-[#675de6] text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Destek
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Yardıma mı İhtiyacınız Var?
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Sorularınız için Discord destek sunucumuza katılın veya sıkça
            sorulan sorulara göz atın.
          </p>
        </motion.div>

        <div className="bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-2xl p-8 mb-16 text-center">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Destek Sunucumuza Katılın
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Topluluğumuzla tanışın, sorularınızı sorun ve en son
            güncellemelerden haberdar olun.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.open("https://discord.gg/example", "_blank")}
            className="!bg-white !text-black hover:!bg-white/90 focus-visible:ring-white/50"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Discord'a Katıl
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Sıkça Sorulan Sorular
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#675de6] animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {faqList.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-[#171821] border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-medium text-white">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 border-t border-white/5 pt-4">
                          <p className="text-slate-400">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Başka sorularınız mı var?{" "}
            <a
              href="mailto:ibrahim.e.yagmur@gmail.com"
              className="text-[#675de6] hover:text-[#7b72f0] transition-colors"
            >
              ibrahim.e.yagmur@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
