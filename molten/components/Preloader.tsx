"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ui } from "@/lib/store";
import { getLenis } from "@/lib/scroll";

const WORD = "MOLTEN".split("");

export default function Preloader() {
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(progress, (v) => `scaleX(${v / 100})`);

  useEffect(() => {
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    let cancelled = false;

    // crawl to 82% while assets load, then race to 100
    const crawl = animate(progress, 82, { duration: 2.2, ease: [0.3, 0.1, 0.2, 1] });
    const start = performance.now();

    const finish = () => {
      if (cancelled) return;
      crawl.stop();
      const wait = Math.max(0, 1500 - (performance.now() - start));
      window.setTimeout(() => {
        animate(progress, 100, {
          duration: 0.6,
          ease: [0.7, 0, 0.3, 1],
          onComplete: () => !cancelled && setDone(true),
        });
      }, wait);
    };

    if (ui.get().loaded) finish();
    const unsub = ui.subscribe(() => ui.get().loaded && finish());
    const safety = window.setTimeout(finish, 6000);

    return () => {
      cancelled = true;
      unsub();
      window.clearTimeout(safety);
      crawl.stop();
    };
  }, [progress]);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => ui.set({ introDone: true }), 380);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
        getLenis()?.start();
      }}
    >
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 md:p-10 tex-lines"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.3em] text-ash">
            <span>Molten Sauce Co.</span>
            <span className="hidden md:block">Heating the kitchen</span>
            <span>Est. 2019</span>
          </div>

          <div className="flex justify-center overflow-hidden">
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                className="display text-[22vw] text-ember md:text-[17vw]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-110%" }}
                transition={{ duration: 1, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <p className="max-w-[18rem] font-serif text-xl italic leading-tight text-cream/80 md:text-2xl">
                Firing up the smokers, fermenting the good stuff…
              </p>
              <motion.span className="display text-6xl tabular-nums text-cream md:text-8xl">{rounded}</motion.span>
            </div>
            <div className="h-[2px] w-full bg-cream/10">
              <motion.div className="h-full origin-left bg-ember" style={{ transform: bar }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
