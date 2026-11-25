"use client";

import { VelocityMarquee } from "./Marquee";

const REVIEWS = [
  { q: "Uso o Merino três dias seguidos na viagem e ele continua sem cheiro. Não sei como, mas funciona.", a: "Marina C.", f: "Merino Tricô" },
  { q: "O zíper é absurdo de bom. Desliza com uma mão só, até de luva.", a: "Rafael T.", f: "Tech Shell" },
  { q: "Comprei o preto e voltei pra comprar o osso. A gola alta segura o vento de verdade.", a: "Júlia M.", f: "Moletom Pesado" },
  { q: "Leve demais pra ser tão quente. Virou meu casaco de trilha na Mantiqueira.", a: "Pedro A.", f: "Polar Fleece" },
  { q: "Caimento perfeito, ombro caído do jeito certo. Parece peça de grife gringa.", a: "Lucas F.", f: "Merino Tricô" },
  { q: "Lavei umas vinte vezes e não fez bolinha. Isso diz tudo.", a: "Ana P.", f: "Moletom Pesado" },
];

function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure className="mr-5 w-[78vw] shrink-0 whitespace-normal rounded-[1.5rem] border border-paper/10 bg-coal p-7 transition-colors duration-500 hover:border-paper/40 sm:w-[420px]">
      <div className="mb-4 flex gap-1" aria-label="5 de 5 estrelas">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 18.1 5.8 22l1.7-7.6L2 9.6l7.1-.7z" />
          </svg>
        ))}
      </div>
      <blockquote className="font-serif text-2xl italic leading-snug text-paper/90">&ldquo;{r.q}&rdquo;</blockquote>
      <figcaption className="eyebrow mt-6 flex items-center justify-between !tracking-[0.2em]">
        <span>{r.a}</span>
        <span className="text-ash">{r.f}</span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  return (
    <section className="relative z-10 overflow-hidden bg-ink pb-28 pt-28 text-paper md:pb-40 md:pt-36" aria-label="Avaliações">
      <div className="mb-14 flex flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-end md:px-10">
        <div>
          <p className="eyebrow mb-5">
            <span className="text-ash">(07)</span> Quem veste
          </p>
          <h2 className="display text-7xl md:text-9xl">
            4,9<span className="text-outline">/5</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm text-paper/60">Mais de 8.300 avaliações verificadas de quem já passou um inverno com a gente.</p>
      </div>
      <VelocityMarquee baseVelocity={1.5}>
        {REVIEWS.slice(0, 3).concat(REVIEWS.slice(0, 3)).map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </VelocityMarquee>
      <div className="h-5" />
      <VelocityMarquee baseVelocity={-1.5}>
        {REVIEWS.slice(3).concat(REVIEWS.slice(3)).map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </VelocityMarquee>
    </section>
  );
}
