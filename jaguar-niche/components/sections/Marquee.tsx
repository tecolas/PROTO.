"use client";

import Logo from "../ui/Logo";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/** Scroll-velocity reactive marquee: speeds up & flips direction with scroll. */
export function VelocityMarquee({
  children,
  baseVelocity = 3,
  className = "",
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const smooth = useSpring(v, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smooth, [-2000, 0, 2000], [8, 0, -8]);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    let next = x.get() - move;
    // wrap between -50% and 0
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    x.set(next);
  });

  const tx = useTransform(x, (val) => `${val}%`);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex w-max" style={{ x: tx, skewX: skew }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

const WORDS = ["Merino", "Fleece", "Tech Shell", "Moletom", "Zíper metálico", "Feito para durar"];

export default function Marquee() {
  return (
    <section aria-label="Valores Jaguar Niche" className="relative z-10 -my-6 py-16">
      <div className="-rotate-2 scale-105 bg-ink py-4 text-paper md:py-6">
        <VelocityMarquee baseVelocity={2.2}>
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="display flex items-center gap-8 pr-8 text-5xl md:text-8xl">
              {w}
              <Logo className="h-8 w-8 md:h-12 md:w-12" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="absolute inset-x-0 top-1/2 -z-10 rotate-2 bg-paper py-3 text-ink">
        <VelocityMarquee baseVelocity={-1.4}>
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="pr-10 text-sm uppercase tracking-[0.4em]">
              {w} ·
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
