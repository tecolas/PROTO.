"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RevealWords } from "../ui/Reveal";
import { Chili } from "../ui/Heat";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONS: Record<string, React.ReactNode> = {
  habanero: (
    <g {...stroke}>
      <path d="M32 14c-8 0-14 6-14 15 0 12 6 21 14 21s14-9 14-21c0-9-6-15-14-15z" />
      <path d="M32 14c0-4 2-7 6-8M26 16c2 2 10 2 12 0" />
      <path d="M24 28c0 6 2 12 5 15" opacity=".5" />
    </g>
  ),
  garlic: (
    <g {...stroke}>
      <path d="M32 10c0 6-16 12-16 26a16 14 0 0 0 32 0c0-14-16-20-16-26z" />
      <path d="M32 22c-4 6-6 12-6 26M32 22c4 6 6 12 6 26M32 22v28" opacity=".6" />
      <path d="M28 6l4 4 4-4" />
    </g>
  ),
  salt: (
    <g {...stroke}>
      <path d="M20 44l8-20 10 4-6 20z" />
      <path d="M38 46l6-14 8 4-5 12z" />
      <path d="M14 50h40" />
      <path d="M24 16l2 3M40 14v4M48 20l-2 3" opacity=".6" />
    </g>
  ),
  mango: (
    <g {...stroke}>
      <path d="M22 22c8-10 26-8 28 8 2 14-10 24-22 22-10-2-14-18-6-30z" />
      <path d="M30 16c-1-4 1-8 5-9 2 4 0 8-5 9z" />
      <path d="M28 30c4 4 10 6 16 4" opacity=".5" />
    </g>
  ),
  oak: (
    <g {...stroke}>
      <path d="M20 50h24M24 50c0-6 2-10 8-14 6 4 8 8 8 14" />
      <path d="M26 30c-4-4-2-10 2-12 0-4 4-6 6-4 4-2 8 2 6 6 4 2 4 8 0 10" />
      <path d="M32 36V24" opacity=".6" />
    </g>
  ),
  lime: (
    <g {...stroke}>
      <circle cx="32" cy="32" r="16" />
      <circle cx="32" cy="32" r="12" opacity=".5" />
      <path d="M32 20v24M20 32h24M24 24l16 16M40 24L24 40" opacity=".5" />
    </g>
  ),
};

const INGREDIENTS = [
  { key: "habanero", name: "Habanero", origin: "Yucatán, MX", fact: "Hand-picked at peak orange for fruity, floral fire." },
  { key: "garlic", name: "Black Garlic", origin: "Gilroy, CA", fact: "Aged 90 days until sweet, sticky and balsamic." },
  { key: "salt", name: "Smoked Sea Salt", origin: "Maldon, UK", fact: "Cold-smoked over oak for a campfire finish." },
  { key: "mango", name: "Alphonso Mango", origin: "Ratnagiri, IN", fact: "The king of mangoes. Honeyed, jammy, bright." },
  { key: "oak", name: "White Oak Smoke", origin: "Our yard", fact: "Real coals. Real smoke. Never from a bottle." },
  { key: "lime", name: "Key Lime", origin: "Florida Keys, US", fact: "Squeezed same-day for a sharp, clean lift." },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

export default function Ingredients() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ing-band",
        { xPercent: 0 },
        {
          xPercent: -35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
      gsap.utils.toArray<HTMLElement>(".float-chili").forEach((el, i) => {
        gsap.to(el, {
          yPercent: -120 - i * 60,
          rotate: i % 2 ? 40 : -50,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
      ScrollTrigger.batch(".ing-card", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 80, opacity: 0, rotate: (i) => (i % 2 ? 4 : -4) },
            { y: 0, opacity: 1, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 },
          ),
      });
    },
    { scope: root },
  );

  return (
    <section
      id="ingredients"
      ref={root}
      className="relative z-10 overflow-hidden rounded-t-[2.5rem] bg-ember pb-28 pt-24 text-ink md:rounded-t-[4rem] md:pb-40 md:pt-36"
    >
      <div className="tex-halftone pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="tex-paper pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply" aria-hidden />

      {/* floating parallax chiles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Chili className="float-chili absolute left-[6%] top-[30%] h-20 w-20 text-blood/70" />
        <Chili className="float-chili absolute right-[8%] top-[18%] h-28 w-28 text-ink/80" />
        <Chili className="float-chili absolute right-[30%] top-[62%] h-14 w-14 text-gold" />
      </div>

      <div className="relative px-5 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">
          <span className="opacity-60">(04)</span> Ingredients
        </p>
      </div>

      <div className="relative mt-6 whitespace-nowrap">
        <h2 className="ing-band display inline-block pl-5 text-[24vw] md:pl-10 md:text-[17vw]">
          Nothing to hide<span className="text-cream">.</span> Nothing to hide<span className="text-cream">.</span>
        </h2>
      </div>

      <div className="relative mt-10 grid gap-10 px-5 md:mt-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <RevealWords
            as="p"
            className="font-serif text-3xl italic leading-tight md:text-5xl"
            text="Seven ingredients, tops. If you can't pronounce it, it isn't in the jar."
          />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="max-w-lg text-base leading-relaxed text-ink/80">
            We source from growers we can call by name — and we print every single ingredient on the front of the label, not hidden on the
            back. No gums, no thickeners, no &ldquo;natural flavors&rdquo;. Just fire, time and produce.
          </p>
        </div>
      </div>

      <ul className="relative mt-16 grid gap-px overflow-hidden px-5 sm:grid-cols-2 md:mt-24 md:px-10 lg:grid-cols-3">
        {INGREDIENTS.map((it, i) => (
          <li key={it.key} className="ing-card">
            <motion.div
              whileHover="hover"
              initial="rest"
              animate="rest"
              data-cursor="hover"
              className="group relative h-full overflow-hidden border-t-2 border-ink/80 p-6 md:p-8"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 origin-bottom bg-ink"
                variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="relative flex items-start justify-between transition-colors duration-500 group-hover:text-cream">
                <span className="display text-xl opacity-60">{String(i + 1).padStart(2, "0")}</span>
                <motion.svg
                  viewBox="0 0 64 64"
                  className="h-20 w-20 md:h-24 md:w-24"
                  variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -12, scale: 1.12 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  aria-hidden
                >
                  {ICONS[it.key]}
                </motion.svg>
              </div>
              <div className="relative mt-8 transition-colors duration-500 group-hover:text-cream">
                <h3 className="display text-4xl md:text-5xl">{it.name}</h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] opacity-60 group-hover:text-ember group-hover:opacity-100">
                  {it.origin}
                </p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-80">{it.fact}</p>
              </div>
            </motion.div>
          </li>
        ))}
      </ul>

      <dl className="relative mt-20 grid grid-cols-2 gap-y-10 px-5 md:mt-28 md:grid-cols-4 md:px-10">
        {[
          { n: 0, s: "", l: "Preservatives" },
          { n: 90, s: "", l: "Days fermented" },
          { n: 7, s: "", l: "Ingredients, max" },
          { n: 100, s: "%", l: "Plant-based" },
        ].map((s) => (
          <div key={s.l} className="flex flex-col border-l-2 border-ink/80 pl-4">
            <dt className="order-2 mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] opacity-70">{s.l}</dt>
            <dd className="display order-1 text-7xl md:text-9xl">
              <Counter to={s.n} suffix={s.s} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
