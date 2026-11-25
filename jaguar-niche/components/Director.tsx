"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { garment, ui } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PAPER = "#ecebe6";
const INK = "#0b0b0b";

/**
 * Moves the fixed garment between layout slots and flips the stage between
 * paper and ink as sections pass. Mounts AFTER the pinned sections.
 */
export default function Director() {
  useGSAP(() => {
    const scrub = 1;
    const bd = "#backdrop";

    // hero → anatomy: lights out, garment flips to white, slides left
    const a = gsap.timeline({ scrollTrigger: { trigger: "#historia", start: "top bottom", end: "top top", scrub } });
    a.fromTo(garment, { side: 0, scale: 1, dark: 0, invert: 0 }, { side: -1, scale: 0.9, dark: 1, invert: 1, ease: "power1.inOut", immediateRender: false }, 0);
    a.fromTo(bd, { backgroundColor: PAPER, color: INK }, { backgroundColor: INK, color: PAPER, ease: "power1.inOut", immediateRender: false }, 0);

    // anatomy → models: lights on, back to the chosen colour, swing right
    const b = gsap.timeline({ scrollTrigger: { trigger: "#modelos", start: "top bottom", end: "top top", scrub } });
    b.fromTo(
      garment,
      { side: -0.5, scale: 0.9, zoom: 1, zip: 0.75, dark: 1, invert: 1 },
      { side: 1, scale: 0.8, zoom: 0, zip: 0, dark: 0, invert: 0, ease: "power2.inOut", immediateRender: false },
      0,
    );
    b.fromTo(bd, { backgroundColor: INK, color: PAPER }, { backgroundColor: PAPER, color: INK, ease: "power1.inOut", immediateRender: false }, 0);

    // models → colours: centre stage, a touch bigger
    gsap.fromTo(
      garment,
      { side: 1, scale: 0.8 },
      { side: 0, scale: 0.86, ease: "power2.inOut", immediateRender: false, scrollTrigger: { trigger: "#cores", start: "top bottom", end: "top top", scrub } },
    );

    // colours → materials: ride up and out with the page
    gsap.fromTo(
      garment,
      { lift: 0, visible: 1 },
      { lift: 1.1, visible: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: "#materiais", start: "top bottom", end: "top top", scrub: 0.3 } },
    );

    ScrollTrigger.create({
      trigger: "#materiais",
      start: "top top",
      onEnter: () => ui.set({ sceneActive: false }),
      onLeaveBack: () => ui.set({ sceneActive: true }),
    });

    ScrollTrigger.refresh();
  });

  return null;
}
