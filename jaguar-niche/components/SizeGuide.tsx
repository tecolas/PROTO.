"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { openSizes, useUI } from "@/lib/store";
import { getLenis } from "@/lib/scroll";
import { openWhatsApp, WHATSAPP_DISPLAY } from "@/lib/contact";

type Row = { size: string; body: [number, number]; chest: number; length: number; sleeve: number; shoulder: number };

/** Garment measured flat, in cm. `body` = recommended body chest circumference. */
const ROWS: Row[] = [
  { size: "PP", body: [84, 90], chest: 52, length: 66, sleeve: 61, shoulder: 46 },
  { size: "P", body: [90, 96], chest: 55, length: 68, sleeve: 62, shoulder: 48 },
  { size: "M", body: [96, 102], chest: 58, length: 70, sleeve: 63, shoulder: 50 },
  { size: "G", body: [102, 108], chest: 61, length: 72, sleeve: 64, shoulder: 52 },
  { size: "GG", body: [108, 116], chest: 64, length: 74, sleeve: 65, shoulder: 54 },
];

const COLS = [
  { key: "chest", label: "Peito", hint: "A", desc: "De axila a axila, com a peça esticada" },
  { key: "length", label: "Comprimento", hint: "B", desc: "Do ombro (junto à gola) até a barra" },
  { key: "sleeve", label: "Manga", hint: "C", desc: "Da costura do ombro até o punho" },
  { key: "shoulder", label: "Ombro", hint: "D", desc: "De uma costura de ombro à outra" },
] as const;

type ColKey = (typeof COLS)[number]["key"];

function Diagram({ active }: { active: ColKey | null }) {
  const on = (k: ColKey) => (active === null || active === k ? 1 : 0.15);
  const line = "stroke-current";
  return (
    <svg viewBox="0 0 240 230" className="h-full w-full" aria-hidden>
      <path
        d="M84 40 L102 30 Q120 26 138 30 L156 40 L190 52 Q202 58 205 72 L222 186 Q223 193 216 194 L200 196 Q194 197 193 191 L178 100 L178 206 Q178 212 172 212 L68 212 Q62 212 62 206 L62 100 L47 191 Q46 197 40 196 L24 194 Q17 193 18 186 L35 72 Q38 58 50 52Z"
        className="fill-ink/[0.06] stroke-ink/30"
        strokeWidth="1.2"
      />
      <path d="M102 30 L102 14 Q120 10 138 14 L138 30" className="fill-ink/[0.06] stroke-ink/30" strokeWidth="1.2" />
      <line x1="120" y1="12" x2="120" y2="84" className="stroke-ink/40" strokeWidth="1.6" />
      {/* A peito */}
      <g style={{ opacity: on("chest") }} className="transition-opacity duration-300">
        <line x1="64" y1="104" x2="176" y2="104" className={line} strokeWidth="2" strokeDasharray="4 3" />
        <text x="120" y="98" textAnchor="middle" className="fill-current text-[11px] font-bold">A</text>
      </g>
      {/* B comprimento */}
      <g style={{ opacity: on("length") }} className="transition-opacity duration-300">
        <line x1="150" y1="36" x2="150" y2="210" className={line} strokeWidth="2" strokeDasharray="4 3" />
        <text x="158" y="150" className="fill-current text-[11px] font-bold">B</text>
      </g>
      {/* C manga */}
      <g style={{ opacity: on("sleeve") }} className="transition-opacity duration-300">
        <line x1="190" y1="54" x2="214" y2="192" className={line} strokeWidth="2" strokeDasharray="4 3" />
        <text x="214" y="120" className="fill-current text-[11px] font-bold">C</text>
      </g>
      {/* D ombro */}
      <g style={{ opacity: on("shoulder") }} className="transition-opacity duration-300">
        <line x1="50" y1="50" x2="190" y2="50" className={line} strokeWidth="2" strokeDasharray="4 3" />
        <text x="62" y="44" className="fill-current text-[11px] font-bold">D</text>
      </g>
    </svg>
  );
}

function recommend(chest: number, loose: boolean): string | null {
  if (!chest || chest < 70 || chest > 140) return null;
  let i = ROWS.findIndex((r) => chest < r.body[1]);
  if (i === -1) i = ROWS.length - 1;
  if (loose) i = Math.min(ROWS.length - 1, i + 1);
  return ROWS[i].size;
}

export default function SizeGuide() {
  const open = useUI((s) => s.sizesOpen);
  const [hoverCol, setHoverCol] = useState<ColKey | null>(null);
  const [chest, setChest] = useState("");
  const [loose, setLoose] = useState(false);
  const rec = useMemo(() => recommend(parseFloat(chest.replace(",", ".")), loose), [chest, loose]);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && openSizes(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => openSizes(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Tabela de medidas"
            data-lenis-prevent
            className="fixed inset-x-0 bottom-0 z-[71] max-h-[92svh] overflow-y-auto rounded-t-[2rem] bg-bone text-ink md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:w-[min(960px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2rem]"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-bone/95 px-6 py-5 backdrop-blur md:px-8">
              <div>
                <p className="eyebrow text-ash">Guia</p>
                <h2 className="display text-3xl md:text-4xl">Tabela de medidas</h2>
              </div>
              <button
                onClick={() => openSizes(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-transform duration-500 hover:rotate-90 hover:bg-ink hover:text-paper"
                aria-label="Fechar tabela de medidas"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1fr_240px] md:p-8">
              <div>
                <div className="overflow-x-auto rounded-2xl border border-ink/10">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <caption className="sr-only">Medidas da peça em centímetros, por tamanho</caption>
                    <thead>
                      <tr className="border-b border-ink/10 bg-paper">
                        <th scope="col" className="px-4 py-3 font-semibold">Tamanho</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Seu tórax</th>
                        {COLS.map((c) => (
                          <th
                            key={c.key}
                            scope="col"
                            onPointerEnter={() => setHoverCol(c.key)}
                            onPointerLeave={() => setHoverCol(null)}
                            className={`cursor-help px-4 py-3 font-semibold transition-colors ${hoverCol === c.key ? "bg-ink text-paper" : ""}`}
                            title={c.desc}
                          >
                            {c.label} <span className="opacity-50">({c.hint})</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map((r) => {
                        const isRec = rec === r.size;
                        return (
                          <tr key={r.size} className={`border-b border-ink/10 transition-colors last:border-0 ${isRec ? "bg-ink text-paper" : "hover:bg-paper"}`}>
                            <th scope="row" className="px-4 py-3">
                              <span className="display text-lg">{r.size}</span>
                            </th>
                            <td className="px-4 py-3 tabular-nums opacity-70">
                              {r.body[0]}–{r.body[1]}
                            </td>
                            {COLS.map((c) => (
                              <td
                                key={c.key}
                                className={`px-4 py-3 tabular-nums transition-colors ${hoverCol === c.key && !isRec ? "bg-ink/[0.06]" : ""}`}
                              >
                                {r[c.key]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ash">
                  Medidas da peça em centímetros, tirada na horizontal. Variação de até 1,5 cm. O Tech Shell tem 2 cm a mais no peito para usar por cima de
                  outras camadas.
                </p>

                {/* recommender */}
                <div className="mt-6 rounded-2xl bg-ink p-5 text-paper md:p-6">
                  <p className="eyebrow text-ash">Descubra seu tamanho</p>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
                    <label className="flex-1">
                      <span className="text-sm text-paper/70">Circunferência do seu tórax (cm)</span>
                      <input
                        inputMode="decimal"
                        value={chest}
                        onChange={(e) => setChest(e.target.value.replace(/[^\d,.]/g, ""))}
                        placeholder="ex.: 98"
                        className="mt-2 h-12 w-full rounded-full border border-paper/25 bg-transparent px-5 text-lg outline-none placeholder:text-paper/30 focus:border-paper"
                      />
                    </label>
                    <div role="radiogroup" aria-label="Caimento" className="flex h-12 rounded-full border border-paper/25 p-1">
                      {[
                        { v: false, l: "Regular" },
                        { v: true, l: "Mais solto" },
                      ].map((o) => (
                        <button
                          key={o.l}
                          role="radio"
                          aria-checked={loose === o.v}
                          onClick={() => setLoose(o.v)}
                          className="relative rounded-full px-4 text-xs font-semibold uppercase tracking-[0.15em]"
                        >
                          {loose === o.v && (
                            <motion.span layoutId="fit-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                          )}
                          <span className={`relative ${loose === o.v ? "text-ink" : ""}`}>{o.l}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 min-h-[3.5rem]" aria-live="polite">
                    <AnimatePresence mode="wait">
                      {rec ? (
                        <motion.p key={rec + loose} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-baseline gap-3">
                          <span className="text-paper/70">Recomendamos o tamanho</span>
                          <span className="display text-5xl">{rec}</span>
                        </motion.p>
                      ) : (
                        <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-paper/50">
                          Meça a parte mais larga do peito, logo abaixo das axilas, com a fita bem reta.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <aside className="flex flex-col gap-5">
                <div className="aspect-square rounded-2xl bg-paper p-3 text-ink">
                  <Diagram active={hoverCol} />
                </div>
                <ul className="space-y-2 text-sm">
                  {COLS.map((c) => (
                    <li
                      key={c.key}
                      onPointerEnter={() => setHoverCol(c.key)}
                      onPointerLeave={() => setHoverCol(null)}
                      className={`flex gap-3 rounded-xl px-3 py-2 transition-colors ${hoverCol === c.key ? "bg-ink text-paper" : ""}`}
                    >
                      <span className="font-bold">{c.hint}</span>
                      <span className="opacity-80">{c.desc}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openWhatsApp(`Olá! Preciso de ajuda para escolher meu tamanho na Jaguar Niche.${rec ? ` A tabela sugeriu ${rec}.` : ""}`)}
                  className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
                >
                  <WhatsIcon className="h-5 w-5" />
                  Tirar dúvida no WhatsApp
                </button>
                <p className="-mt-3 text-center text-xs text-ash">{WHATSAPP_DISPLAY}</p>
              </aside>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function WhatsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.2-.7.2-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z" />
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    </svg>
  );
}
