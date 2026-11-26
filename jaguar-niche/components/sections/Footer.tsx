"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToTarget } from "@/lib/scroll";
import { openSizes } from "@/lib/store";
import NextLink from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, openWhatsApp, whatsappLink, WHATSAPP_DISPLAY } from "@/lib/contact";
import { PAGES, pageHref } from "@/lib/institutional";
import { WhatsIcon } from "../SizeGuide";

/** href = external (new tab), to = internal page, onClick = in-page action */
type Link = { label: string; href?: string; to?: string; onClick?: () => void; icon?: React.ReactNode };
const wa = (msg: string) => () => openWhatsApp(msg);

const COLUMNS: { t: string; l: Link[] }[] = [
  {
    t: "Loja",
    l: [
      { label: "Quarter zips", onClick: () => scrollToTarget("#loja") },
      { label: "Kit Camadas", onClick: () => scrollToTarget("#loja") },
      { label: "Vale-presente", onClick: wa("Olá! Quero comprar um vale-presente da Jaguar Niche.") },
      { label: "Atacado", onClick: wa("Olá! Tenho interesse em comprar no atacado da Jaguar Niche.") },
    ],
  },
  {
    t: "Jaguar Niche",
    l: [
      { label: "Nossa história", onClick: () => scrollToTarget("#historia") },
      { label: "Materiais", onClick: () => scrollToTarget("#materiais") },
      { label: "Cores", onClick: () => scrollToTarget("#cores") },
      { label: "Trabalhe conosco", onClick: wa("Olá! Gostaria de trabalhar com a Jaguar Niche.") },
    ],
  },
  {
    t: "Ajuda",
    l: [
      { label: "Entregas", onClick: wa("Olá! Tenho uma dúvida sobre entrega.") },
      { label: "Trocas", onClick: wa("Olá! Preciso de ajuda com uma troca.") },
      { label: "Tabela de medidas", onClick: () => openSizes() },
      { label: "Contato", href: whatsappLink() },
    ],
  },
  {
    t: "Institucional",
    l: [
      ...PAGES.map((p) => ({ label: p.label, to: pageHref(p.slug) })),
      { label: "Meus pedidos", onClick: wa("Olá! Quero acompanhar o meu pedido na Jaguar Niche.") },
    ],
  },
  {
    t: "Contato",
    l: [
      {
        label: INSTAGRAM_HANDLE,
        href: INSTAGRAM_URL,
        icon: (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        ),
      },
      { label: WHATSAPP_DISPLAY, href: whatsappLink(), icon: <WhatsIcon className="h-4 w-4" /> },
    ],
  },
];

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
        E-mail
      </label>
      <div className="flex h-16 items-center rounded-full border border-ink/25 pl-6 pr-2 transition-colors focus-within:border-ink">
        <input
          id="nl"
          type="email"
          value={email}
          disabled={state !== "idle"}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="h-full min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-ink/35"
        />
        <motion.button
          type="submit"
          layout
          disabled={!valid || state !== "idle"}
          className="flex h-12 items-center justify-center overflow-hidden rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-[0.2em] text-paper disabled:cursor-not-allowed"
          animate={{ width: state === "idle" ? "auto" : 48, opacity: valid || state !== "idle" ? 1 : 0.4 }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state === "idle" && (
              <motion.span key="i" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                Entrar
              </motion.span>
            )}
            {state === "sending" && (
              <motion.span
                key="s"
                className="block h-4 w-4 rounded-full border-2 border-paper border-t-transparent"
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
            Pronto. Você fica sabendo do próximo lote antes de todo mundo.
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
        { yPercent: 0, ease: "none", stagger: 0.06, scrollTrigger: { trigger: ".mark", start: "top bottom", end: "bottom bottom", scrub: 0.8 } },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative z-10 overflow-hidden bg-ink text-paper">
      <div className="relative mx-3 overflow-hidden rounded-[2.5rem] bg-paper px-6 py-20 text-ink md:mx-6 md:rounded-[4rem] md:px-14 md:py-28">
        <div className="tex-grid pointer-events-none absolute inset-0 text-ink opacity-[0.05]" aria-hidden />
        <div className="relative grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="eyebrow">
              <span className="text-ash">(08)</span> Lista Jaguar
            </p>
            <h2 className="display mt-6 text-[13vw] md:text-[7.5vw]">
              Próximo lote,
              <br />
              <span className="font-serif font-normal normal-case italic tracking-normal">primeiro</span> você.
            </h2>
            <Newsletter />
          </div>
          <div className="flex flex-col justify-end md:col-span-3 md:col-start-10">
            <p className="font-serif text-2xl italic leading-tight">Lotes limitados, cores de temporada e nenhum spam. Só frio e roupa boa.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-10 px-5 pb-6 pt-20 text-sm md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <p className="font-serif text-3xl italic leading-tight text-paper/90">Desenhado no Sul, feito para qualquer frio.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8 lg:grid-cols-5">
        {COLUMNS.map((c) => (
          <div key={c.t}>
            <p className="eyebrow mb-4 text-ash">{c.t}</p>
            <ul className="space-y-2">
              {c.l.map((x) => (
                <li key={x.label}>
                  {x.to ? (
                    <NextLink href={x.to} className="u-link text-paper/80 hover:text-paper">
                      {x.label}
                    </NextLink>
                  ) : x.href ? (
                    <a
                      href={x.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-paper/80 hover:text-paper ${x.icon ? "inline-flex items-center gap-2" : "u-link"}`}
                    >
                      {x.icon}
                      <span className={x.icon ? "u-link" : undefined}>{x.label}</span>
                    </a>
                  ) : (
                    <button onClick={x.onClick} className="u-link text-left text-paper/80 hover:text-paper">
                      {x.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-5 pb-10 md:px-10">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="group inline-flex items-center gap-4 rounded-full border border-paper/20 py-2 pl-2 pr-6 transition-colors hover:bg-paper hover:text-ink"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-ink">
            <WhatsIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="eyebrow block text-ash group-hover:text-ink/60">WhatsApp</span>
            <span className="text-lg font-semibold">{WHATSAPP_DISPLAY}</span>
          </span>
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="group inline-flex items-center gap-4 rounded-full border border-paper/20 py-2 pl-2 pr-6 transition-colors hover:bg-paper hover:text-ink"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span>
            <span className="eyebrow block text-ash group-hover:text-ink/60">Instagram</span>
            <span className="text-lg font-semibold">{INSTAGRAM_HANDLE}</span>
          </span>
        </a>
      </div>

      <div className="mark relative select-none px-3 md:px-6" aria-hidden>
        {["JAGUAR", "NICHE"].map((word, w) => (
          <div key={word} className={`display flex justify-between overflow-hidden leading-[0.9] ${w ? "text-outline pb-[1vw] text-[16vw]" : "pt-[1vw] text-[17vw] md:text-[18.5vw]"}`}>
            {word.split("").map((c, i) => (
              <span key={i} className="mark-letter inline-block">
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="eyebrow flex flex-col items-center justify-between gap-3 border-t border-paper/10 px-5 pb-24 pt-6 !tracking-[0.2em] text-ash md:flex-row md:px-10 md:pb-6 md:pr-28">
        <span>© 2026 Jaguar Niche</span>
        <span>Quarter zips · Inverno 26</span>
        <button onClick={() => scrollToTarget(0)} className="u-link text-paper" data-cursor="hover">
          Voltar ao topo ↑
        </button>
      </div>
    </footer>
  );
}
