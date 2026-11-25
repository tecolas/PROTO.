"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brl } from "@/lib/catalog";
import { setQty, toggleCart, useCart } from "@/lib/store";
import { getLenis } from "@/lib/scroll";
import ZipArt from "./ui/ZipArt";
import { openWhatsApp } from "@/lib/contact";
import { WhatsIcon } from "./SizeGuide";

const FREE_SHIP = 600;

export default function CartDrawer() {
  const open = useCart((s) => s.open);
  const items = useCart((s) => s.items);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const pct = Math.min(1, subtotal / FREE_SHIP);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && toggleCart(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Sacola de compras"
            className="fixed bottom-0 right-0 top-0 z-[61] flex w-full max-w-md flex-col bg-bone text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-ink/10 p-6">
              <h2 className="display text-3xl">Sacola</h2>
              <button
                onClick={() => toggleCart(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-transform duration-500 hover:rotate-90 hover:bg-ink hover:text-paper"
                aria-label="Fechar sacola"
              >
                ✕
              </button>
            </div>

            <div className="border-b border-ink/10 px-6 py-4">
              <p className="eyebrow mb-2 !tracking-[0.18em] text-ash">
                {pct >= 1 ? "Frete grátis liberado" : `Faltam ${brl(FREE_SHIP - subtotal)} para o frete grátis`}
              </p>
              <div className="h-1 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-ink"
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="display text-6xl text-ink/10">Vazia</p>
                  <p className="mt-3 font-serif text-xl italic text-ash">Sua sacola está mais fria que lá fora.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                        className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-paper p-3"
                      >
                        <div className="flex h-20 w-16 items-center justify-center rounded-xl bg-fog/50">
                          <ZipArt hex={it.hex} className="h-16" title={it.name} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold leading-tight">{it.name}</p>
                          <p className="text-xs text-ash">{it.detail}</p>
                          <p className="mt-1 text-sm">{brl(it.price)}</p>
                        </div>
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button className="h-9 w-9 text-lg" onClick={() => setQty(it.key, it.qty - 1)} aria-label="Diminuir">
                            −
                          </button>
                          <motion.span key={it.qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-5 text-center tabular-nums">
                            {it.qty}
                          </motion.span>
                          <button className="h-9 w-9 text-lg" onClick={() => setQty(it.key, it.qty + 1)} aria-label="Aumentar">
                            +
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-ink/10 p-6">
              <div className="mb-4 flex items-end justify-between">
                <span className="eyebrow text-ash">Subtotal</span>
                <span className="display text-3xl tabular-nums">{brl(subtotal)}</span>
              </div>
              <button
                disabled={!items.length}
                onClick={() => {
                  const lines = items.map((i) => `• ${i.qty}× ${i.name} — ${i.detail} — ${brl(i.price * i.qty)}`);
                  openWhatsApp(
                    [
                      "Olá! Quero finalizar este pedido na Jaguar Niche:",
                      "",
                      ...lines,
                      "",
                      `Subtotal: ${brl(subtotal)}${pct >= 1 ? " (frete grátis)" : ""}`,
                    ].join("\n"),
                  );
                }}
                className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink text-sm font-semibold uppercase tracking-[0.16em] text-paper transition-opacity disabled:opacity-30"
              >
                <span className="absolute inset-0 -translate-x-full bg-[#25D366] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-enabled:group-hover:translate-x-0" />
                <WhatsIcon className="relative h-5 w-5" />
                <span className="relative">Finalizar pelo WhatsApp</span>
              </button>
              <p className="mt-3 text-center text-xs text-ash">Seu pedido vai pronto na conversa. A gente confirma estoque, frete e pagamento por lá.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
