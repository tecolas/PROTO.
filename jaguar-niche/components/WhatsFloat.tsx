"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, useUI } from "@/lib/store";
import { whatsappLink } from "@/lib/contact";
import { WhatsIcon } from "./SizeGuide";

/** Always-available WhatsApp contact button. */
export default function WhatsFloat() {
  const intro = useUI((s) => s.introDone);
  const cartOpen = useCart((s) => s.open);
  const sizesOpen = useUI((s) => s.sizesOpen);
  const hidden = cartOpen || sizesOpen;
  const [hover, setHover] = useState(false);

  return (
    <AnimatePresence>
      {intro && !hidden && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale com a Jaguar Niche no WhatsApp"
          data-cursor="hover"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.8 }}
          className="fixed bottom-4 right-4 z-50 flex h-14 items-center gap-2 overflow-hidden rounded-full bg-[#25D366] pl-4 pr-4 text-ink shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] md:bottom-6 md:right-6"
        >
          <WhatsIcon className="h-6 w-6 shrink-0" />
          <motion.span
            initial={false}
            animate={{ width: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            className="overflow-hidden whitespace-nowrap text-sm font-semibold"
          >
            Fale com a gente
          </motion.span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
