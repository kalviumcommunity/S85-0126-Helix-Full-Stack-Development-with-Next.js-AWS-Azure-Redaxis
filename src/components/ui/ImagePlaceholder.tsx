"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  aspectRatio?: "video" | "square" | "wide" | "auto";
  label?: string;
  className?: string;
  blur?: boolean;
}

const aspectMap = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  auto: "",
};

export function ImagePlaceholder({
  aspectRatio = "video",
  label = "Photo",
  className = "",
  blur = true,
}: ImagePlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`
        rounded-[var(--radius-md)] overflow-hidden
        bg-gradient-to-br from-[#fce7eb] via-[#fbc4ce] to-[#f9a8b4]
        flex items-center justify-center
        ${aspectMap[aspectRatio]} ${className}
      `}
    >
      <div
        className={`
          w-full h-full flex items-center justify-center gap-2 text-[var(--muted)]
          ${blur ? "backdrop-blur-sm" : ""}
        `}
      >
        <ImageIcon className="w-8 h-8 opacity-60" strokeWidth={1.5} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </motion.div>
  );
}
