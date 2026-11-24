"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FLAVORS } from "@/lib/flavors";
import { addToCart, setFlavor, useUI } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";
import Heat from "../ui/Heat";
import FireButton from "../ui/FireButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Flavors() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const idx = useUI((s) => s.flavor);
  const f = FLAVORS[idx];

  useGSAP(
    () => {
      st.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${FLAVORS.length * 90}%`,
        pin: ".flavor-pin",
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(FLAVORS.length - 1, Math.floor(self.progress * FLAVORS.length));
          setFlavor(i);
          gsap.set(".flavor-progress", { scaleY: self.progress });
        },
        onLeaveBack: () => setFlavor(0),
      });
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const s = st.current;
    if (!s) return setFlavor(i);
    const y = s.start + (s.end - s.start) * ((i + 0.5) / FLAVORS.length);
    scrollToTarget(y);
  };

  return (
    <section id="flavors" ref={root} className="relative">
      <div className="flavor-pin relative h-[100svh] overflow-hidden">
        {/* accent wash */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-[20%] top-1/2 h-[120vh] w-[80vw] -translate-y-1/2 rounded-full blur-[120px]"
          animate={{ backgroundColor: f.accent, opacity: 0.16 }}
          transition={{ duration: 1.2 }}
        />

        <div className="absolute inset-x-5 top-24 flex items-center justify-between md:inset-x-10 md:top-28">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cream/70">
            <span className="text-ember">(03)</span> The flavors
          </p>
          <p className="display text-2xl tabular-nums text-cream/60">
            <span className="text-cream">{String(idx + 1).padStart(2, "0")}</span> / {String(FLAVORS.length).padStart(2, "0")}
          </p>
        </div>

        {/* vertical selector */}
        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-4 md:right-10 md:flex">
          <div className="relative h-56 w-px bg-cream/15">
            <div className="flavor-progress absolute inset-0 origin-top bg-ember" style={{ transform: "scaleY(0)" }} />
          </div>
          <ul className="flex flex-col gap-5">
            {FLAVORS.map((fl, i) => (
              <li key={fl.id}>
                <button
                  onClick={() => jump(i)}
                  data-cursor="hover"
                  className={`group flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                    i === idx ? "text-cream" : "text-cream/35 hover:text-cream/80"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full transition-transform duration-500"
                    style={{ background: fl.accent, transform: `scale(${i === idx ? 1.6 : 0.8})` }}
                  />
                  {fl.short}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* content */}
        <div className="absolute inset-x-5 bottom-8 md:inset-x-10 md:bottom-auto md:top-1/2 md:w-[52%] md:-translate-y-1/2">
          <div className="pointer-events-none absolute -inset-x-5 -bottom-8 -top-28 bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
          <div className="relative">
            <div className="mb-4 flex gap-2 md:hidden">
              {FLAVORS.map((fl, i) => (
                <button
                  key={fl.id}
                  onClick={() => jump(i)}
                  aria-label={fl.name}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: i === idx ? 28 : 8, background: i === idx ? fl.accent : "rgba(246,237,227,0.3)" }}
                />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={f.id} initial="hidden" animate="show" exit="exit">
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                  className="mb-3 font-serif text-xl italic md:text-2xl"
                  style={{ color: f.accent }}
                >
                  {f.tagline}
                </motion.p>
                <h3 className="display text-[19vw] leading-[0.82] md:text-[8.5vw]" aria-label={f.name}>
                  {f.name.split(" ").map((word, wi) => (
                    <span key={wi} className="block overflow-hidden">
                      {word.split("").map((ch, ci) => (
                        <motion.span
                          key={ci}
                          className="inline-block"
                          variants={{
                            hidden: { y: "105%" },
                            show: { y: "0%", transition: { duration: 0.8, ease: EASE, delay: wi * 0.08 + ci * 0.025 } },
                            exit: { y: "-105%", transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0], delay: ci * 0.012 } },
                          }}
                        >
                          {ch}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </h3>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.25 } },
                    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
                  }}
                >
                  <p className="mt-6 hidden max-w-md text-[15px] leading-relaxed text-cream/70 md:block">{f.description}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div>
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-ash">Heat · {f.scoville}</p>
                      <Heat level={f.heat} color={f.accent} />
                    </div>
                    <div>
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-ash">Tasting notes</p>
                      <p className="text-sm text-cream/90">{f.notes.join(" · ")}</p>
                    </div>
                    <div className="hidden lg:block">
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-ash">Pairs with</p>
                      <p className="text-sm text-cream/90">{f.pairs.join(", ")}</p>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-5">
                    <FireButton
                      label="Add"
                      onClick={() => addToCart({ id: f.id, name: f.name, price: f.price, color: f.accent })}
                    >
                      Add to cart — ${f.price}
                    </FireButton>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
