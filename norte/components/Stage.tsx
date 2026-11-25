"use client";

import { COLORS, isLight } from "@/lib/catalog";
import { useUI } from "@/lib/store";

/**
 * Fixed layers that sit BEHIND the WebGL canvas:
 *  - #backdrop: paper ↔ ink, tweened by the Director as sections change
 *  - colour stage: takes over while the Colours section is active and flips
 *    to whichever tone contrasts the selected garment colour.
 */
export default function Stage() {
  const active = useUI((s) => s.colorsActive);
  const color = useUI((s) => s.color);
  const bg = isLight(COLORS[color].hex) ? "#0b0b0b" : "#ecebe6";
  const fg = isLight(COLORS[color].hex) ? "#ecebe6" : "#0b0b0b";

  return (
    <>
      <div id="backdrop" aria-hidden className="fixed inset-0 -z-20 bg-paper text-ink">
        <div className="tex-grid absolute inset-0 opacity-[0.045]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.12)_100%)]" />
      </div>
      <div
        aria-hidden
        className="fixed inset-0 -z-10 transition-[opacity,background-color,color] duration-700 ease-out"
        style={{ backgroundColor: bg, color: fg, opacity: active ? 1 : 0 }}
      >
        <div className="tex-grid absolute inset-0 opacity-[0.05]" />
      </div>
    </>
  );
}
