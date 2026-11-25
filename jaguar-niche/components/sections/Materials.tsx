"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TYPES, type FabricKind } from "@/lib/catalog";
import { fabricPreview } from "../three/fabric";
import { RevealWords } from "../ui/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DETAILS: Record<FabricKind, { origin: string; bullets: string[] }> = {
  merino: { origin: "Lã de ovelhas merino, Uruguai", bullets: ["Não pinica", "Regula temperatura", "Dispensa lavagens frequentes"] },
  fleece: { origin: "Garrafas PET recicladas, Brasil", bullets: ["Seca em 40 min", "Felpa dupla face", "Ultraleve"] },
  tech: { origin: "Nylon 6.6 ripstop, Japão", bullets: ["Repelente sem PFC", "Corta-vento", "Dobra no bolso"] },
  terry: { origin: "Algodão orgânico, Paraíba", bullets: ["480 g/m²", "Pré-encolhido", "Fica mais macio com o tempo"] },
};

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Macro fabric swatch with a magnifier lens that follows the pointer. */
function Swatch({ src }: { src?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const [bgPos, setBgPos] = useState("50% 50%");

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-char"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = e.clientX - r.left,
          py = e.clientY - r.top;
        x.set(px - 70);
        y.set(py - 70);
        setBgPos(`${(px / r.width) * 100}% ${(py / r.height) * 100}%`);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      data-cursor="hover"
    >
      {src && (
        <div
          className="absolute inset-0 bg-[length:50%] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          style={{ backgroundImage: `url(${src})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      {src && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 hidden h-[140px] w-[140px] rounded-full border border-paper/60 shadow-2xl md:block"
          style={{ x: sx, y: sy, backgroundImage: `url(${src})`, backgroundSize: "130%", backgroundPosition: bgPos }}
          animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      )}
    </div>
  );
}

export default function Materials() {
  const root = useRef<HTMLElement>(null);
  const [srcs, setSrcs] = useState<Record<string, string>>({});

  useEffect(() => {
    const m: Record<string, string> = {};
    TYPES.forEach((t) => (m[t.id] = fabricPreview(t.id, 0.06, 2)));
    setSrcs(m);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mat-band",
        { xPercent: 0 },
        { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
      );
      ScrollTrigger.batch(".mat-card", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.09 }),
      });
    },
    { scope: root },
  );

  return (
    <section
      id="materiais"
      ref={root}
      className="relative z-10 overflow-hidden rounded-t-[2.5rem] bg-ink pb-28 pt-24 text-paper md:rounded-t-[4rem] md:pb-40 md:pt-36"
    >
      <div className="tex-noise pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />
      <div className="relative px-5 md:px-10">
        <p className="eyebrow">
          <span className="text-ash">(05)</span> Materiais
        </p>
      </div>

      <div className="relative mt-6 whitespace-nowrap">
        <h2 className="mat-band display inline-block pl-5 text-[19vw] md:pl-10 md:text-[13vw]">
          Matéria-prima<span className="text-outline">.</span> Matéria-prima<span className="text-outline">.</span>
        </h2>
      </div>

      <div className="relative mt-10 grid gap-10 px-5 md:mt-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <RevealWords as="p" className="font-serif text-3xl italic leading-tight md:text-5xl" text="A gente começa pela fibra. O resto é consequência." />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <p className="max-w-lg text-base leading-relaxed text-paper/70">
            Cada tecido é desenvolvido com fornecedores que a gente visita. Rastreamos a origem, testamos abrasão, encolhimento e pilling antes de
            qualquer peça chegar até você. Passe o mouse nas amostras para ver de perto.
          </p>
        </div>
      </div>

      <ul className="relative mt-16 grid gap-5 px-5 sm:grid-cols-2 md:mt-24 md:px-10 xl:grid-cols-4">
        {TYPES.map((t, i) => (
          <li key={t.id} className="mat-card group">
            <Swatch src={srcs[t.id]} />
            <div className="mt-5 flex items-baseline justify-between">
              <h3 className="display text-2xl md:text-3xl">{t.short}</h3>
              <span className="eyebrow text-ash">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-1 text-sm text-paper/60">{DETAILS[t.id].origin}</p>
            <ul className="mt-4 space-y-2 border-t border-paper/15 pt-4">
              {DETAILS[t.id].bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <span className="h-1 w-1 rounded-full bg-paper" />
                  {b}
                </li>
              ))}
              <li className="flex items-center justify-between pt-2 text-sm">
                <span className="text-paper/50">Gramatura</span>
                <span className="font-semibold">{t.weight}</span>
              </li>
            </ul>
          </li>
        ))}
      </ul>

      <dl className="relative mt-20 grid grid-cols-2 gap-y-10 px-5 md:mt-28 md:grid-cols-4 md:px-10">
        {[
          { n: 18.5, d: 1, s: " µm", l: "Merino superfino" },
          { n: 480, s: " g", l: "Por m² de moletom" },
          { n: 32, s: "", l: "Garrafas por fleece" },
          { n: 10000, s: "", l: "mm de coluna d'água" },
        ].map((s) => (
          <div key={s.l} className="flex flex-col border-l border-paper/30 pl-4">
            <dd className="display text-5xl md:text-7xl">
              <Counter to={s.n} suffix={s.s} decimals={s.d ?? 0} />
            </dd>
            <dt className="eyebrow mt-2 text-ash">{s.l}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
