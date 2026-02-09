"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: "0 12px 40px -12px rgba(225, 29, 72, 0.15)",
            }
          : undefined
      }
      className={`
        rounded-[var(--radius-lg)] border border-[var(--glass-border)]
        bg-[var(--glass-bg)] backdrop-blur-xl
        shadow-[var(--shadow-glass)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
