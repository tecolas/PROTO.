"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { toggleCart, useCart, useUI } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";

const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Flavors", href: "#flavors" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "Shop", href: "#shop" },
];

export default function Nav() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const bump = useCart((s) => s.bump);
  const intro = useUI((s) => s.introDone);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300 && !menu);
    setSolid(y > 60);
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
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      >
        <nav
          className={`mx-auto flex h-16 items-center justify-between rounded-full pl-6 pr-2 transition-[background,backdrop-filter,border-color] duration-500 ${
            solid ? "border border-cream/10 bg-ink/60 backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <button
            onClick={() => go("#top")}
            className="display flex items-center gap-2 text-2xl tracking-wide text-cream"
            data-cursor="hover"
            aria-label="Molten — back to top"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ember">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink" fill="currentColor" aria-hidden>
                <path d="M12 2c1 3.5 4.5 5.2 4.5 9.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.5c0-1.7.8-3 1.8-4 .1 1.5.8 2.5 1.7 3C11.6 8 11 5 12 2Zm-6 12.5c0 3.6 2.7 7.5 6 7.5s6-3.9 6-7.5c0-.5 0-1-.1-1.4-.6 2.9-3 5-5.9 5s-5.3-2.1-5.9-5c0 .4-.1.9-.1 1.4Z" />
              </svg>
            </span>
            Molten
          </button>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  className="u-link text-[13px] font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-cream"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCart(true)}
              data-cursor="hover"
              className="group relative flex h-12 items-center gap-3 rounded-full bg-cream pl-5 pr-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ember"
              aria-label={`Open cart, ${count} items`}
            >
              Cart
              <motion.span
                key={bump}
                initial={{ scale: bump ? 1.6 : 1, rotate: bump ? -20 : 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                className="flex h-8 min-w-8 items-center justify-center rounded-full bg-ink px-2 text-xs text-cream"
              >
                {count}
              </motion.span>
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-cream/20 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menu}
            >
              <motion.span animate={menu ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-cream" />
              <motion.span animate={menu ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-cream" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ember p-6 pb-12 text-ink md:hidden"
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
                className="display border-b border-ink/20 py-3 text-left text-7xl"
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
