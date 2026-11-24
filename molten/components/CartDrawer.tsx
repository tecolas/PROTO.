"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FLAVORS } from "@/lib/flavors";
import { setQty, toggleCart, useCart } from "@/lib/store";
import { getLenis } from "@/lib/scroll";
import JarArt from "./ui/JarArt";

const FREE_SHIP = 45;

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
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            className="fixed bottom-0 right-0 top-0 z-[61] flex w-full max-w-md flex-col bg-coal tex-lines"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-cream/10 p-6">
              <h2 className="display text-4xl">Your Haul</h2>
              <button
                onClick={() => toggleCart(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition-transform duration-500 hover:rotate-90 hover:border-ember hover:text-ember"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            <div className="border-b border-cream/10 px-6 py-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-ash">
                {pct >= 1 ? "🔥 Free shipping unlocked" : `$${(FREE_SHIP - subtotal).toFixed(0)} away from free shipping`}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blood via-ember to-gold"
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="display text-6xl text-cream/15">Empty</p>
                  <p className="mt-3 font-serif text-xl italic text-ash">Your cart is colder than it should be.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((it) => {
                      const f = FLAVORS.find((x) => x.id === it.id);
                      return (
                        <motion.li
                          key={it.id}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                          className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-ink/50 p-3"
                        >
                          <div className="flex h-20 w-16 items-center justify-center rounded-xl bg-char">
                            {f ? (
                              <JarArt sauce={f.sauce} accent={f.accent} name={f.name} className="h-16" />
                            ) : (
                              <span className="display text-2xl text-ember">×4</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{it.name}</p>
                            <p className="text-sm text-ash">${it.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center rounded-full border border-cream/15">
                            <button className="h-9 w-9 text-lg hover:text-ember" onClick={() => setQty(it.id, it.qty - 1)} aria-label="Decrease">
                              −
                            </button>
                            <motion.span key={it.qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-6 text-center tabular-nums">
                              {it.qty}
                            </motion.span>
                            <button className="h-9 w-9 text-lg hover:text-ember" onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase">
                              +
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-cream/10 p-6">
              <div className="mb-4 flex items-end justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-ash">Subtotal</span>
                <span className="display text-4xl tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <button
                disabled={!items.length}
                className="group relative h-14 w-full overflow-hidden rounded-full bg-ember text-sm font-semibold uppercase tracking-[0.2em] text-ink transition-opacity disabled:opacity-40"
              >
                <span className="absolute inset-0 -translate-x-full bg-cream transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-enabled:group-hover:translate-x-0" />
                <span className="relative">Checkout — ${subtotal.toFixed(2)}</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
