import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", animate = false, delay = 0, onClick }) => {
  
  const baseClass = `
    bg-white/10 backdrop-blur-xl border border-white/20
    bg-gradient-to-br from-white/15 to-white/5
    hover:-translate-y-1 hover:border-[#D6FF2F]/40
    hover:shadow-lg transition-all duration-300
    rounded-2xl p-6
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        onClick={onClick}
        className={baseClass}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={baseClass}>
      {children}
    </div>
  );
};

export default GlassCard;