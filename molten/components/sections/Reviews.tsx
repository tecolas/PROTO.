"use client";

import { VelocityMarquee } from "./Marquee";

const REVIEWS = [
  { q: "Ember Original lives on my counter now. It's smoky in a way that makes everything taste grilled.", a: "Dana R.", f: "Ember Original" },
  { q: "Black Gold on ramen is a religious experience. Deep, sweet, a little funky. Perfect.", a: "Marcus T.", f: "Black Gold" },
  { q: "The mango hits first, then the fire. I keep going back for more, against my better judgement.", a: "Priya S.", f: "Mango Inferno" },
  { q: "Bought Reaper's Reserve as a joke. Not a joke. Absolutely incredible flavor under the pain.", a: "Jonah K.", f: "Reaper's Reserve" },
  { q: "The jar alone is worth it. I've reused three as spice jars. The sauce is even better.", a: "Lena M.", f: "The Full Burn" },
  { q: "Finally a hot sauce with a real ingredient list. You can taste the fermentation.", a: "Theo B.", f: "Ember Original" },
];

function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure className="mr-5 w-[78vw] shrink-0 whitespace-normal rounded-[1.5rem] border border-cream/10 bg-coal p-7 transition-colors duration-500 hover:border-ember/60 sm:w-[420px]">
      <div className="mb-4 flex gap-1 text-ember" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 18.1 5.8 22l1.7-7.6L2 9.6l7.1-.7z" />
          </svg>
        ))}
      </div>
      <blockquote className="font-serif text-2xl italic leading-snug text-cream/90">&ldquo;{r.q}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.22em]">
        <span className="text-cream">{r.a}</span>
        <span className="text-ash">{r.f}</span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  return (
    <section className="relative z-10 overflow-hidden bg-ink pb-28 md:pb-40" aria-label="Customer reviews">
      <div className="mb-14 flex flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-end md:px-10">
        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-cream/70">
            <span className="text-ember">(06)</span> Word of mouth
          </p>
          <h2 className="display text-7xl md:text-9xl">
            4.9<span className="text-ember">/5</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm text-cream/60">From 12,400+ verified reviews by people whose tastebuds have never been the same.</p>
      </div>
      <VelocityMarquee baseVelocity={1.6}>
        {REVIEWS.slice(0, 3).concat(REVIEWS.slice(0, 3)).map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </VelocityMarquee>
      <div className="h-5" />
      <VelocityMarquee baseVelocity={-1.6}>
        {REVIEWS.slice(3).concat(REVIEWS.slice(3)).map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </VelocityMarquee>
    </section>
  );
}
