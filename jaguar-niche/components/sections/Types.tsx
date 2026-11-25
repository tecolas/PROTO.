"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TYPES, COLORS, brl } from "@/lib/catalog";
import { addToCart, openSizes, setType, useUI } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";
import { fabricPreview } from "../three/fabric";
import Button from "../ui/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Types() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const idx = useUI((s) => s.type);
  const color = useUI((s) => s.color);
  const t = TYPES[idx];
  const [swatches, setSwatches] = useState<Record<string, string>>({});

  useEffect(() => {
    // generate macro swatches after first paint so they don't block the intro
    const id = window.setTimeout(() => {
      const m: Record<string, string> = {};
      TYPES.forEach((x) => (m[x.id] = fabricPreview(x.id, 0.1, 1)));
      setSwatches(m);
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      st.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${TYPES.length * 90}%`,
        pin: ".types-pin",
        anticipatePin: 1,
        onUpdate: (self) => {
          setType(Math.min(TYPES.length - 1, Math.floor(self.progress * TYPES.length)));
          gsap.set(".types-progress", { scaleY: self.progress });
        },
      });
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const s = st.current;
    if (!s) return setType(i);
    scrollToTarget(s.start + (s.end - s.start) * ((i + 0.5) / TYPES.length));
  };

  return (
    <section id="modelos" ref={root} className="relative text-ink">
      <div className="types-pin relative h-[100svh] overflow-hidden">
        <div className="absolute inset-x-5 top-24 flex items-center justify-between md:inset-x-10 md:top-28">
          <p className="eyebrow">
            <span className="text-ash">(03)</span> Modelos
          </p>
          <p className="display text-2xl tabular-nums text-ink/40">
            <span className="text-ink">{String(idx + 1).padStart(2, "0")}</span> / {String(TYPES.length).padStart(2, "0")}
          </p>
        </div>

        {/* vertical selector */}
        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-4 md:right-10 md:flex">
          <div className="relative h-56 w-px bg-ink/15">
            <div className="types-progress absolute inset-0 origin-top bg-ink" style={{ transform: "scaleY(0)" }} />
          </div>
          <ul className="flex flex-col gap-4">
            {TYPES.map((x, i) => (
              <li key={x.id}>
                <button
                  onClick={() => jump(i)}
                  data-cursor="hover"
                  className={`group flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                    i === idx ? "text-ink" : "text-ink/35 hover:text-ink/80"
                  }`}
                >
                  <span
                    className="h-7 w-7 rounded-full border border-ink/20 bg-cover transition-transform duration-500"
                    style={{
                      backgroundImage: swatches[x.id] ? `url(${swatches[x.id]})` : undefined,
                      transform: `scale(${i === idx ? 1.15 : 0.85})`,
                    }}
                  />
                  {x.short}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-x-5 bottom-8 md:inset-x-10 md:bottom-auto md:top-1/2 md:w-[50%] md:-translate-y-1/2">
          <div className="pointer-events-none absolute -inset-x-5 -bottom-8 -top-28 bg-gradient-to-t from-paper via-paper/85 to-transparent md:hidden" />
          <div className="relative">
            <div className="mb-4 flex gap-2 md:hidden">
              {TYPES.map((x, i) => (
                <button
                  key={x.id}
                  onClick={() => jump(i)}
                  aria-label={x.name}
                  className="h-1.5 rounded-full bg-ink transition-all duration-500"
                  style={{ width: i === idx ? 28 : 8, opacity: i === idx ? 1 : 0.25 }}
                />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={t.id} initial="hidden" animate="show" exit="exit">
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                  className="mb-3 font-serif text-xl italic md:text-2xl"
                >
                  {t.tagline}
                </motion.p>
                <h3 className="display text-[14vw] md:text-[6.6vw]" aria-label={t.name}>
                  {t.name.split(" ").map((word, wi) => (
                    <span key={wi} className="block overflow-hidden pb-[0.04em]">
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
                  <p className="mt-5 hidden max-w-md text-[15px] leading-relaxed text-ink/70 md:block">{t.description}</p>
                  <dl className="mt-6 grid max-w-lg grid-cols-3 border-t border-ink/15">
                    {[
                      ["Gramatura", t.weight],
                      ["Toque", t.feel],
                      ["Clima", t.climate],
                    ].map(([k, v]) => (
                      <div key={k} className="border-r border-ink/15 py-3 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3">
                        <dt className="eyebrow !text-[9px] text-ash">{k}</dt>
                        <dd className="mt-1 text-sm font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex items-center gap-5">
                    <Button
                      label="Add"
                      onClick={() =>
                        addToCart({
                          key: `${t.id}-${COLORS[color].id}-M`,
                          name: `Quarter Zip ${t.name}`,
                          detail: `${COLORS[color].name} · M`,
                          price: t.price,
                          hex: COLORS[color].hex,
                        })
                      }
                    >
                      Adicionar — {brl(t.price)}
                    </Button>
                    <button onClick={() => openSizes()} className="u-link hidden text-sm font-medium sm:inline">
                      Tabela de medidas
                    </button>
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
