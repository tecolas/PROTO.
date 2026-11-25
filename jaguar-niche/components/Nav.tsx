"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { toggleCart, useCart, useUI } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";

const LINKS = [
  { label: "História", href: "#historia" },
  { label: "Modelos", href: "#modelos" },
  { label: "Cores", href: "#cores" },
  { label: "Materiais", href: "#materiais" },
  { label: "Loja", href: "#loja" },
];

/** Uses mix-blend-difference so it stays legible over black AND white sections. */
export default function Nav() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const bump = useCart((s) => s.bump);
  const intro = useUI((s) => s.introDone);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300 && !menu);
  });

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const go = (href: string) => {
    setMenu(false);
    scrollToTarget(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: intro ? (hidden ? -100 : 0) : -100 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 text-white mix-blend-difference md:px-8"
      >
        <nav className="mx-auto flex h-16 items-center justify-between pl-2">
          <button onClick={() => go("#topo")} className="flex items-center gap-2.5" data-cursor="hover" aria-label="Norte — voltar ao topo">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M12 1.5 21 22.5 12 17.6 3 22.5Z" />
            </svg>
            <span className="display text-xl tracking-tight">Norte</span>
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button onClick={() => go(l.href)} className="u-link text-[12px] font-medium uppercase tracking-[0.22em]">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCart(true)}
              data-cursor="hover"
              className="flex h-12 items-center gap-3 rounded-full border border-white/40 pl-5 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
              aria-label={`Abrir sacola, ${count} itens`}
            >
              Sacola
              <motion.span
                key={bump}
                initial={{ scale: bump ? 1.6 : 1, rotate: bump ? -20 : 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                className="flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-2 text-xs text-black"
              >
                {count}
              </motion.span>
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-white/40 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={menu}
            >
              <motion.span animate={menu ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-white" />
              <motion.span animate={menu ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-white" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink p-6 pb-12 text-paper lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => go(l.href)}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="display border-b border-paper/15 py-3 text-left text-5xl"
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
