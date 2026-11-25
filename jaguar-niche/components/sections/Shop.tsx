"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { COLORS, TYPES, brl, type ZipType } from "@/lib/catalog";
import { addToCart, openSizes } from "@/lib/store";
import ZipArt from "../ui/ZipArt";
import Button from "../ui/Button";
import { RevealWords, FadeUp } from "../ui/Reveal";

const SIZES = ["PP", "P", "M", "G", "GG"];

function ProductCard({ t, i }: { t: ZipType; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(i % COLORS.length);
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);
  const c = COLORS[color];

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const jx = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 150, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const shine = useMotionTemplate`radial-gradient(380px circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 60%)`;

  const add = () => {
    addToCart({ key: `${t.id}-${c.id}-${size}`, name: `Quarter Zip ${t.name}`, detail: `${c.name} · ${size}`, price: t.price, hex: c.hex });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

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
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-bone p-5"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: shine }} />
        <div className="relative flex items-start justify-between">
          <span className="display text-base text-ink/40">Nº {String(i + 1).padStart(2, "0")}</span>
          <span className="rounded-full border border-ink/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/70">{t.weight}</span>
        </div>

        <div className="pointer-events-none relative my-3 flex h-64 items-center justify-center">
          <div className="tex-dots absolute inset-6 rounded-full text-ink/10" />
          <motion.div style={{ x: jx }} className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.05, rotate: 3 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-105"
              >
                <ZipArt hex={c.hex} kind={t.id} title={`${t.name} ${c.name}`} className="h-56 drop-shadow-[0_24px_24px_rgba(0,0,0,0.25)]" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="relative mt-auto">
          <h3 className="display text-2xl leading-none md:text-3xl">{t.name}</h3>
          <p className="mt-2 text-sm text-ink/60">{c.name}</p>

          <div className="mt-4 flex items-center gap-2" role="radiogroup" aria-label="Cor">
            {COLORS.map((col, ci) => (
              <button
                key={col.id}
                role="radio"
                aria-checked={ci === color}
                aria-label={col.name}
                onClick={() => setColor(ci)}
                className="relative h-6 w-6 rounded-full transition-transform hover:scale-110"
                style={{ background: col.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.2)" }}
              >
                {ci === color && <motion.span layoutId={`ring-${t.id}`} className="absolute -inset-1 rounded-full border border-ink" />}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="eyebrow !text-[10px] text-ash">Tamanho</span>
            <button onClick={() => openSizes()} className="u-link text-xs font-medium text-ink/70 hover:text-ink">
              Tabela de medidas
            </button>
          </div>
          <div className="mb-5 mt-2 flex gap-1.5" role="radiogroup" aria-label="Tamanho">
            {SIZES.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={s === size}
                onClick={() => setSize(s)}
                className={`relative h-9 flex-1 rounded-full text-[11px] font-semibold tracking-wider transition-colors ${
                  s === size ? "text-paper" : "text-ink/60 hover:text-ink"
                }`}
              >
                {s === size && <motion.span layoutId={`size-${t.id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className="relative">{s}</span>
              </button>
            ))}
          </div>

          <button
            onClick={add}
            data-cursor="hover"
            data-cursor-label="Add"
            className="relative flex h-12 w-full items-center justify-between overflow-hidden rounded-full bg-ink pl-5 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={added ? "a" : "b"} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                {added ? "Na sacola ✓" : "Adicionar"}
              </motion.span>
            </AnimatePresence>
            <motion.span
              animate={added ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="flex h-9 items-center rounded-full bg-paper px-4 text-ink"
            >
              {brl(t.price)}
            </motion.span>
          </button>
        </div>
      </motion.article>
    </FadeUp>
  );
}

export default function Shop() {
  const bundle = 1189;
  return (
    <section id="loja" className="relative z-10 bg-paper px-5 py-28 text-ink md:px-10 md:py-40">
      <div className="tex-grid pointer-events-none absolute inset-0 text-ink opacity-[0.04]" aria-hidden />
      <div className="relative mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-5">
            <span className="text-ash">(06)</span> Vitrine
          </p>
          <h2 className="display text-[15vw] md:text-[8.5vw]">
            <RevealWords text="Escolha" />
            <br />
            <RevealWords text="o seu." className="font-serif font-normal normal-case italic tracking-normal" delay={0.15} />
          </h2>
        </div>
        <FadeUp className="max-w-sm">
          <p className="text-[15px] leading-relaxed text-ink/70">
            Quatro construções, cinco tons, cinco tamanhos. Troca grátis em 30 dias e frete grátis acima de R$ 600.
          </p>
        </FadeUp>
      </div>

      <div className="relative grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {TYPES.map((t, i) => (
          <ProductCard key={t.id} t={t} i={i} />
        ))}
      </div>

      <FadeUp className="relative mt-5">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[1.75rem] bg-ink p-8 text-paper md:grid-cols-2 md:p-14">
          <div className="tex-lines pointer-events-none absolute inset-0 text-paper opacity-[0.05]" aria-hidden />
          <div className="relative">
            <span className="inline-block rounded-full bg-paper px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
              Economize R$ 189
            </span>
            <h3 className="display mt-5 text-5xl md:text-7xl">Kit Camadas</h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper/70">
              Merino por baixo, Tech Shell por cima. O sistema de duas camadas que resolve do café da manhã na serra ao vento da orla.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Button
                variant="paper"
                label="Add"
                onClick={() => addToCart({ key: "kit-camadas", name: "Kit Camadas", detail: "Merino + Tech Shell · Preto", price: bundle, hex: "#141414" })}
              >
                Adicionar kit — {brl(bundle)}
              </Button>
              <span className="display text-2xl line-through opacity-40">{brl(1378)}</span>
            </div>
          </div>
          <div className="relative flex items-end justify-center -space-x-14">
            {[
              { hex: "#141414", kind: "merino" as const },
              { hex: "#ecebe6", kind: "tech" as const },
            ].map((z, i) => (
              <motion.div
                key={i}
                initial={{ y: 80, opacity: 0, rotate: i ? 10 : -10 }}
                whileInView={{ y: 0, opacity: 1, rotate: i ? 6 : -6 }}
                whileHover={{ y: -16, rotate: 0, zIndex: 10 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.1 }}
                className="relative"
              >
                <ZipArt hex={z.hex} kind={z.kind} className="h-52 drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] md:h-72" />
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
