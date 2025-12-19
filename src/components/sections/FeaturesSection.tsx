import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { features } from "../../data/mockFeatures";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="ozellikler" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Güçlü Özellikler
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Sunucunuzu yönetmek için ihtiyacınız olan tüm araçlar tek bir yerde.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-[#171821] rounded-xl border border-white/10 p-6 transition-shadow hover:shadow-lg hover:shadow-[#675de6]/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#675de6]/10 flex items-center justify-center mb-4 group-hover:bg-[#675de6]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#675de6]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  {feature.description}
                </p>
                <Link
                  to={feature.path}
                  className="inline-flex items-center gap-1 text-sm text-[#675de6] hover:text-[#7b72f0] font-medium transition-colors group-hover:gap-2"
                >
                  Detaylar
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
