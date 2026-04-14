// animationOnScroll.jsx — COMPLETE FIXED FILE

import { motion } from "framer-motion";

// 🔥 Jump animation
export const JumpIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// 🔥 Fade animation — 4 directions
export const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const initial = {
    up:    { opacity: 0, y: 40 },
    down:  { opacity: 0, y: -40 },
    left:  { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
  }[direction];

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// 🔥 Stagger container
export const StaggerContainer = ({ children }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.15 } },
    }}
  >
    {children}
  </motion.div>
);

// 🔥 Stagger child
export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
  >
    {children}
  </motion.div>
);

export default JumpIn;