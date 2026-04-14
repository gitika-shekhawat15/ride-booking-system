// Stats.jsx — COMPLETE FILE

import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Rides Completed" },
  { value: "4.8★", label: "Average Rating" },
  { value: "3 min", label: "Pickup Time" },
  { value: "500+", label: "Active Drivers" },
];

const Stats = () => {
  return (
    <section id="stats" className="bg-transparent py-12 px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            className="
              p-5 rounded-xl text-center
              bg-white/10 backdrop-blur-xl border border-white/20
              bg-gradient-to-br from-white/15 to-white/5
              hover:-translate-y-1 hover:border-[#D6FF2F]/40
              hover:shadow-lg transition-all duration-300
            "
          >
            <h2 className="text-2xl font-bold text-[#D6FF2F]">{item.value}</h2>
            <p className="text-white/80 text-sm mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;