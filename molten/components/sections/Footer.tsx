"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToTarget } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const valid = /\S+@\S+\.\S+/.test(email);

  return (
    <form
      className="relative mt-10 max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        setState("sending");
        window.setTimeout(() => setState("done"), 900);
      }}
    >
      <label htmlFor="nl" className="sr-only">
        Email address
      </label>
      <div className="group flex h-16 items-center rounded-full border border-ink/30 bg-ink/5 pl-6 pr-2 transition-colors focus-within:border-ink">
        <input
          id="nl"
          type="email"
          value={email}
          disabled={state !== "idle"}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-full flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-ink/40"
        />
        <motion.button
          type="submit"
          layout
          disabled={!valid || state !== "idle"}
          className="flex h-12 items-center justify-center overflow-hidden rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-[0.2em] text-ember disabled:cursor-not-allowed"
          animate={{ width: state === "idle" ? "auto" : 48, opacity: valid || state !== "idle" ? 1 : 0.5 }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state === "idle" && (
              <motion.span key="i" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                Join the fire
              </motion.span>
            )}
            {state === "sending" && (
              <motion.span
                key="s"
                className="block h-4 w-4 rounded-full border-2 border-ember border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              />
            )}
            {state === "done" && (
              <motion.svg key="d" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3}>
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <AnimatePresence>
        {state === "done" && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 pl-6 text-sm font-medium">
            You&apos;re in. First drop alert incoming. 🔥
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mark-letter",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: ".mark", start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative z-10 overflow-hidden bg-ink">
      <div className="relative mx-3 overflow-hidden rounded-[2.5rem] bg-ember px-6 py-20 text-ink md:mx-6 md:rounded-[4rem] md:px-14 md:py-28">
        <div className="tex-halftone pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">
              <span className="opacity-60">(07)</span> The Molten list
            </p>
            <h2 className="display mt-6 text-[17vw] md:text-[9vw]">
              Turn up
              <br />
              the heat.
            </h2>
            <Newsletter />
          </div>
          <div className="flex flex-col justify-end gap-2 md:col-span-3 md:col-start-10">
            <p className="font-serif text-2xl italic leading-tight">
              Limited batches, first dibs on Reaper&apos;s Reserve, and recipes that need a fire extinguisher.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-10 px-5 pb-6 pt-20 text-sm md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <p className="font-serif text-3xl italic leading-tight text-cream/90">Made slowly, over real fire, by a small crew who take heat seriously.</p>
        </div>
        {[
          { t: "Shop", l: ["All sauces", "The Full Burn", "Gift cards", "Wholesale"] },
          { t: "Company", l: ["Our process", "Growers", "Journal", "Careers"] },
          { t: "Help", l: ["Shipping", "Returns", "FAQ", "Contact"] },
        ].map((c, i) => (
          <div key={c.t} className={i === 0 ? "md:col-span-2 md:col-start-7" : "md:col-span-2"}>
            <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-ash">{c.t}</p>
            <ul className="space-y-2">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="u-link text-cream/80 hover:text-cream">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mark relative select-none px-3 md:px-6" aria-hidden>
        <div className="display flex justify-between overflow-hidden pt-[1vw] text-[27.5vw] leading-[0.9] text-ember">
          {"MOLTEN".split("").map((c, i) => (
            <span key={i} className="mark-letter inline-block">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/10 px-5 py-6 text-[11px] uppercase tracking-[0.22em] text-ash md:flex-row md:px-10">
        <span>© 2026 Molten Sauce Co.</span>
        <span>Fire-fermented in small batches</span>
        <button onClick={() => scrollToTarget(0)} className="u-link text-cream" data-cursor="hover">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
