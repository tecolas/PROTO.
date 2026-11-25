"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { COLORS, isLight } from "@/lib/catalog";
import { garment, setColor, ui, useUI } from "@/lib/store";
import Magnetic from "../ui/Magnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const EASE = [0.16, 1, 0.3, 1] as const;

const PAIRS: Record<string, string> = {
  preto: "Denim cru, cinza e tudo mais.",
  branco: "Preto total ou tons de areia.",
  grafite: "Off-white e jeans lavado.",
  mescla: "Preto, marinho, verde-oliva.",
  osso: "Marrom, preto e linho.",
};

export default function Colors() {
  const root = useRef<HTMLElement>(null);
  const idx = useUI((s) => s.color);
  const active = useUI((s) => s.colorsActive);
  const c = COLORS[idx];
  const onDark = isLight(c.hex); // light garment → dark stage

  // keep the 3D tint (mist/particles/rims) in sync with the stage
  useEffect(() => {
    if (!active) return;
    gsap.to(garment, { dark: onDark ? 1 : 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
  }, [active, onDark]);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          ui.set({ colorsActive: self.isActive });
          if (!self.isActive) gsap.to(garment, { dark: 0, duration: 0.6, overwrite: "auto" });
        },
      });
    },
    { scope: root },
  );

  const fg = active && onDark ? "text-paper" : "text-ink";

  return (
    <section id="cores" ref={root} className={`relative h-[100svh] min-h-[680px] overflow-hidden transition-colors duration-700 ${fg}`}>
      <div className="absolute inset-x-5 top-24 flex items-center justify-between md:inset-x-10 md:top-28">
        <p className="eyebrow">
          <span className="opacity-50">(04)</span> Cores
        </p>
        <p className="eyebrow opacity-60">{COLORS.length} tons, zero cor</p>
      </div>

      {/* giant outlined colour name behind everything */}
      <div className="pointer-events-none absolute inset-x-0 top-[24%] flex justify-center overflow-hidden md:top-[30%]" aria-hidden>
        <AnimatePresence mode="wait">
          <motion.p
            key={c.id}
            className="display text-outline whitespace-nowrap text-[17vw] opacity-30 md:text-[13vw]"
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: "0%", opacity: 0.3 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {c.name.split(" ")[0]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-5 bottom-8 flex flex-col gap-8 md:inset-x-10 md:bottom-10 md:flex-row md:items-end md:justify-between">
        <div className="min-h-[7.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="eyebrow opacity-50">{c.code}</p>
              <h3 className="display mt-2 text-4xl md:text-5xl">{c.name}</h3>
              <p className="mt-2 font-serif text-lg italic opacity-70 md:text-xl">Combina com: {PAIRS[c.id]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div role="radiogroup" aria-label="Escolha a cor" className="flex items-end gap-3 md:gap-5">
          {COLORS.map((col, i) => {
            const on = i === idx;
            return (
              <Magnetic key={col.id} strength={0.4}>
                <button
                  role="radio"
                  aria-checked={on}
                  aria-label={col.name}
                  onClick={() => setColor(i)}
                  data-cursor="hover"
                  className="group flex flex-col items-center gap-3"
                >
                  <span
                    className="relative block h-12 w-12 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 md:h-16 md:w-16"
                    style={{ background: col.hex, boxShadow: "inset 0 0 0 1px rgba(128,128,128,0.45)" }}
                  >
                    <motion.span
                      className="absolute -inset-1.5 rounded-full border-2 border-current"
                      initial={false}
                      animate={{ scale: on ? 1 : 0.7, opacity: on ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    />
                  </span>
                  <span className={`text-[10px] uppercase tracking-[0.2em] transition-opacity ${on ? "opacity-100" : "opacity-40"}`}>
                    {col.code}
                  </span>
                </button>
              </Magnetic>
            );
          })}
        </div>
      </div>
    </section>
  );
}
