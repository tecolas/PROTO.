"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { jar } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = [
  {
    n: "01",
    word: "Fire",
    title: "Blistered over open oak.",
    body: "Every chile is hand-sorted and charred over white-oak coals until the skins blister and the sugars turn to smoke. No liquid smoke. No shortcuts.",
    facts: ["White oak", "700°F", "12 min char"],
  },
  {
    n: "02",
    word: "Time",
    title: "Ninety days in the dark.",
    body: "The mash rests in ceramic crocks with sea salt and nothing else. Wild lactobacillus does the slow work, building a depth you simply can't fake.",
    facts: ["90 days", "64°F", "Wild ferment"],
  },
  {
    n: "03",
    word: "Seal",
    title: "Sealed by hand. Numbered by batch.",
    body: "We blend, taste, adjust and seal every jar by hand — then number it, so you know exactly which fire it came from.",
    facts: ["Batch-numbered", "Glass only", "Zero plastic"],
  },
];

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".chapter");
      const words = gsap.utils.toArray<HTMLElement>(".chapter-word");
      const ticks = gsap.utils.toArray<HTMLElement>(".chapter-tick");

      gsap.set(chapters.slice(1), { autoAlpha: 0 });
      gsap.set(words.slice(1), { yPercent: 100 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          pin: ".story-pin",
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // ---- jar choreography inside the pin ----
      tl.fromTo(jar, { spin: 0 }, { spin: Math.PI * 2, duration: 3 }, 0);
      tl.fromTo(jar, { spread: 1 }, { spread: 1.45, duration: 1.4, ease: "sine.inOut" }, 0.2);
      tl.to(jar, { spread: 0.95, duration: 1.2, ease: "sine.inOut" }, 1.6);
      tl.fromTo(jar, { lid: 1, steam: 1 }, { lid: 0, steam: 0, duration: 0.8, ease: "power2.inOut" }, 2.05);

      // progress
      tl.fromTo(".story-progress", { scaleX: 0 }, { scaleX: 1, duration: 3 }, 0);

      // ---- chapter transitions ----
      chapters.forEach((ch, i) => {
        if (i === 0) return;
        const prev = chapters[i - 1];
        const at = i * 1.0 - 0.3;
        tl.to(prev.querySelectorAll(".line"), { yPercent: -110, duration: 0.35, stagger: 0.03, ease: "power2.in" }, at)
          .to(prev, { autoAlpha: 0, duration: 0.05 }, at + 0.4)
          .set(ch, { autoAlpha: 1 }, at + 0.4)
          .fromTo(
            ch.querySelectorAll(".line"),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.45, stagger: 0.04, ease: "power3.out" },
            at + 0.42,
          )
          .to(words[i - 1], { yPercent: -100, duration: 0.6, ease: "power2.inOut" }, at + 0.1)
          .fromTo(words[i], { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power2.inOut" }, at + 0.1)
          .to(ticks[i], { color: "#ff5b0b", duration: 0.1 }, at + 0.4);
      });
      tl.to({}, { duration: 0.3 }); // hold at the end
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} className="relative">
      <div className="story-pin relative h-[100svh] overflow-hidden">
        {/* top bar */}
        <div className="absolute inset-x-5 top-24 flex items-center gap-6 md:inset-x-10 md:top-28">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cream/70">
            <span className="text-ember">(02)</span> The process
          </p>
          <div className="relative h-px flex-1 bg-cream/15">
            <div className="story-progress absolute inset-0 origin-left bg-ember" />
          </div>
          <div className="flex gap-4 text-[11px] tracking-[0.2em] text-cream/40">
            {CHAPTERS.map((c, i) => (
              <span key={c.n} className="chapter-tick" style={i === 0 ? { color: "#ff5b0b" } : undefined}>
                {c.n}
              </span>
            ))}
          </div>
        </div>

        {/* giant chapter word on the right edge (desktop) */}
        <div className="pointer-events-none absolute -right-4 bottom-[-4vw] hidden h-[23vw] overflow-hidden md:block">
          {CHAPTERS.map((c) => (
            <span
              key={c.word}
              className="chapter-word display text-outline absolute bottom-0 right-0 block text-[26vw] text-cream/15"
            >
              {c.word}
            </span>
          ))}
          <span className="display invisible block text-[26vw]">Fire</span>
        </div>

        {/* chapter copy */}
        <div className="absolute inset-x-5 bottom-8 md:inset-x-auto md:right-10 md:top-1/2 md:bottom-auto md:w-[42%] md:-translate-y-1/2 lg:right-[8%] lg:w-[36%]">
          <div className="pointer-events-none absolute -inset-x-5 -bottom-8 -top-24 bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
          <div className="relative grid">
            {CHAPTERS.map((c) => (
              <article key={c.n} className="chapter col-start-1 row-start-1">
                <div className="overflow-hidden">
                  <p className="line display text-6xl text-ember md:text-8xl">{c.n}</p>
                </div>
                <h3 className="mt-3 font-serif text-4xl italic leading-[0.95] md:text-6xl">
                  {c.title.split(". ").map((t, i, a) => (
                    <span key={i} className="block overflow-hidden pb-1">
                      <span className="line block">{t + (i < a.length - 1 ? "." : "")}</span>
                    </span>
                  ))}
                </h3>
                <div className="mt-5 overflow-hidden">
                  <p className="line max-w-md text-[15px] leading-relaxed text-cream/70">{c.body}</p>
                </div>
                <div className="mt-6 overflow-hidden">
                  <ul className="line flex flex-wrap gap-2">
                    {c.facts.map((f) => (
                      <li key={f} className="rounded-full border border-cream/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-cream/80">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
