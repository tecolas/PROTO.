"use client";

import { motion } from "framer-motion";

export function Chili({ className = "", filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M16.2 6.6c2.4.4 3.9 2.6 3.4 5.4-.8 4.6-5.4 9-11.6 10.2-1.8.3-3.6.1-4.6-.6-.5-.4-.3-1.1.3-1.2 4.4-.7 7.1-3.6 8.3-8.2.8-3.2 1.8-5.9 4.2-5.6z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.3}
        strokeLinejoin="round"
      />
      <path d="M13.6 7.4c.9-1.4 2.9-1.9 4.6-.9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M16.4 6.4c-.1-1.6.6-3.1 2.1-4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

export default function Heat({ level, color = "var(--color-ember)", size = "h-5 w-5" }: { level: number; color?: string; size?: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Heat level ${level} of 5`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 18 }}
          style={{ color: i < level ? color : "rgba(246,237,227,0.22)" }}
        >
          <Chili className={size} filled={i < level} />
        </motion.span>
      ))}
    </div>
  );
}
