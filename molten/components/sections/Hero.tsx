"use client";

import { motion } from "framer-motion";
import { useUI } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";
import FireButton from "../ui/FireButton";

const EASE = [0.16, 1, 0.3, 1] as const;

function Badge() {
  const text = "100% natural · slow fermented · hand sealed · ";
  return (
    <div className="relative h-28 w-28 md:h-36 md:w-36">
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow" aria-hidden>
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="15.5" letterSpacing="3.4" fill="#f6ede3" fontWeight="600" style={{ textTransform: "uppercase" }}>
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-ember text-ink">
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <path d="M12 4v16M6 14l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export default function Hero() {
  const intro = useUI((s) => s.introDone);
  const show = intro ? "show" : "hidden";

  const rise = (d: number) => ({
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 1.2, ease: EASE, delay: d } },
  });
  const fade = (d: number) => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: d } },
  });

  return (
    <section id="top" className="relative flex h-[100svh] min-h-[640px] flex-col justify-between px-5 pb-6 pt-28 md:px-10 md:pb-10">
      <h1 className="sr-only">Molten — small-batch, fire-fermented gourmet hot sauce</h1>

      {/* top meta row */}
      <motion.div
        initial="hidden"
        animate={show}
        className="flex items-start justify-between text-[11px] uppercase tracking-[0.28em] text-cream/70"
      >
        <motion.p variants={fade(0.1)} className="max-w-[12rem]">
          <span className="text-ember">(01)</span> Gourmet hot sauce, fire-fermented in small batches
        </motion.p>
        <motion.div variants={fade(0.2)} className="hidden text-right md:block">
          <p>Batch Nº 417</p>
          <p className="text-cream/40">Sealed 11.2026</p>
        </motion.div>
      </motion.div>

      {/* bottom row */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div initial="hidden" animate={show} className="md:max-w-[34%]">
          <h2 className="font-serif text-[12vw] italic leading-[0.9] text-cream md:text-[4vw]">
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" variants={rise(0.15)}>
                Sauce with
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" variants={rise(0.25)}>
                a <span className="text-ember">pulse.</span>
              </motion.span>
            </span>
          </h2>
          <motion.div variants={fade(0.6)} className="mt-5 flex flex-wrap gap-2 md:mt-6 md:gap-3">
            <FireButton onClick={() => scrollToTarget("#shop")} label="Shop">
              Shop the heat
            </FireButton>
            <FireButton variant="ghost" onClick={() => scrollToTarget("#flavors")}>
              Flavors
            </FireButton>
          </motion.div>
        </motion.div>

        <div className="flex items-end gap-8 md:max-w-[34%]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            className="hidden max-w-[17rem] text-[14px] leading-relaxed text-cream/70 md:block"
          >
            Oak-smoked chiles, ninety days of slow fermentation and a jar you&apos;ll want to keep. Gourmet heat for people who read the label.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -60 }}
            animate={intro ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            className="hidden shrink-0 md:block"
          >
            <button onClick={() => scrollToTarget("#story")} aria-label="Scroll to story" data-cursor="hover">
              <Badge />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
