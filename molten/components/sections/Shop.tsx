"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FLAVORS, type Flavor } from "@/lib/flavors";
import { addToCart } from "@/lib/store";
import JarArt from "../ui/JarArt";
import Heat from "../ui/Heat";
import { RevealWords, FadeUp } from "../ui/Reveal";
import FireButton from "../ui/FireButton";

function AddButton({ onAdd, price }: { onAdd: () => void; price: number }) {
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        onAdd();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      data-cursor="hover"
      data-cursor-label="Add"
      className="relative flex h-12 w-full items-center justify-between overflow-hidden rounded-full border border-cream/15 bg-ink/60 pl-5 pr-1.5 text-sm font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:border-ember"
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span key="a" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-ember">
            Added ✓
          </motion.span>
        ) : (
          <motion.span key="b" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            Add to cart
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        animate={added ? { rotate: 360, scale: [1, 1.25, 1] } : { rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-9 items-center rounded-full bg-ember px-4 text-ink"
      >
        ${price}
      </motion.span>
    </button>
  );
}

function ProductCard({ f, i }: { f: Flavor; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const jx = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 150, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const shine = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, ${f.accent}33, transparent 60%)`;

  return (
    <FadeUp delay={i * 0.08} className="[perspective:1200px]">
      <motion.article
        ref={ref}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cream/10 bg-coal p-5"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: shine }} />
        <div className="relative flex items-start justify-between">
          <span className="display text-lg text-cream/40">Nº {String(i + 1).padStart(2, "0")}</span>
          <span className="rounded-full border border-cream/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream/70">
            {f.scoville}
          </span>
        </div>

        <div className="pointer-events-none relative my-4 flex h-64 items-center justify-center">
          <div
            className="absolute h-44 w-44 rounded-full opacity-50 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-80"
            style={{ background: f.accent }}
          />
          <motion.div style={{ x: jx }} className="relative">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110"
            >
              <JarArt sauce={f.sauce} accent={f.accent} name={f.name} className="h-56 drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)]" />
            </motion.div>
          </motion.div>
        </div>

        <div className="relative mt-auto">
          <h3 className="display text-4xl leading-none">{f.name}</h3>
          <p className="mt-2 text-sm text-cream/60">{f.notes.join(" · ")}</p>
          <div className="mb-5 mt-4 flex items-center justify-between">
            <Heat level={f.heat} color={f.accent} size="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-ash">8 fl oz</span>
          </div>
          <AddButton price={f.price} onAdd={() => addToCart({ id: f.id, name: f.name, price: f.price, color: f.accent })} />
        </div>
      </motion.article>
    </FadeUp>
  );
}

export default function Shop() {
  const bundlePrice = 54;
  return (
    <section id="shop" className="relative z-10 bg-ink px-5 py-28 md:px-10 md:py-40">
      <div className="tex-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-cream/70">
            <span className="text-ember">(05)</span> The lineup
          </p>
          <h2 className="display text-[18vw] md:text-[10vw]">
            <RevealWords text="Shop the" />
            <br />
            <RevealWords text="heat." className="text-ember" delay={0.15} />
          </h2>
        </div>
        <FadeUp className="max-w-sm">
          <p className="text-[15px] leading-relaxed text-cream/70">
            Four signature sauces. Every jar batch-numbered and shipped within 48 hours of sealing. Free shipping over $45.
          </p>
        </FadeUp>
      </div>

      <div className="relative grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {FLAVORS.map((f, i) => (
          <ProductCard key={f.id} f={f} i={i} />
        ))}
      </div>

      {/* bundle */}
      <FadeUp className="relative mt-5">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[1.75rem] bg-ember p-8 text-ink md:grid-cols-2 md:p-14">
          <div className="tex-halftone pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <span className="inline-block rounded-full bg-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ember">
              Save $13
            </span>
            <h3 className="display mt-5 text-6xl md:text-8xl">The Full Burn</h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/80">
              All four signature jars in a hand-stamped wooden crate. The perfect gift for the friend who puts hot sauce on everything — including
              your cooking.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <FireButton
                variant="dark"
                label="Add"
                onClick={() => addToCart({ id: "bundle", name: "The Full Burn (×4)", price: bundlePrice, color: "#ff5b0b" })}
              >
                Add bundle — ${bundlePrice}
              </FireButton>
              <span className="display text-3xl line-through opacity-50">$67</span>
            </div>
          </div>
          <div className="relative flex items-end justify-center -space-x-10 md:-space-x-14">
            {FLAVORS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ y: 80, opacity: 0, rotate: (i - 1.5) * 10 }}
                whileInView={{ y: 0, opacity: 1, rotate: (i - 1.5) * 6 }}
                whileHover={{ y: -20, rotate: 0, zIndex: 10 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.08 }}
                className="relative"
                style={{ zIndex: i === 1 || i === 2 ? 2 : 1 }}
              >
                <JarArt sauce={f.sauce} accent={f.accent} name={f.name} className="h-40 drop-shadow-[0_20px_25px_rgba(0,0,0,0.45)] md:h-60" />
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
