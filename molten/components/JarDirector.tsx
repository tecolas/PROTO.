"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { jar, ui } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Moves the fixed 3D jar between "slots" as sections scroll past.
 * Must mount AFTER the pinned sections so their pin-spacing is measured first.
 */
export default function JarDirector() {
  useGSAP(() => {
    const scrub = 1;

    // hero → story : slide to the left slot, tuck in a bit
    gsap.fromTo(
      jar,
      { side: 0, scale: 1 },
      {
        side: -1,
        scale: 0.86,
        ease: "power1.inOut",
        immediateRender: false,
        scrollTrigger: { trigger: "#story", start: "top bottom", end: "top top", scrub },
      },
    );

    // story → flavors : swing across to the right slot, sealed
    gsap.fromTo(
      jar,
      { side: -1, scale: 0.86, lid: 0, steam: 0 },
      {
        side: 1,
        scale: 0.95,
        lid: 0,
        steam: 0,
        ease: "power2.inOut",
        immediateRender: false,
        scrollTrigger: { trigger: "#flavors", start: "top bottom", end: "top top", scrub },
      },
    );

    // flavors → ingredients : ride up and out with the page
    gsap.fromTo(
      jar,
      { lift: 0, visible: 1 },
      {
        lift: 1.1,
        visible: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: "#ingredients", start: "top bottom", end: "top top", scrub: 0.3 },
      },
    );

    // stop rendering WebGL entirely once it's off-screen
    ScrollTrigger.create({
      trigger: "#ingredients",
      start: "top top",
      onEnter: () => ui.set({ sceneActive: false }),
      onLeaveBack: () => ui.set({ sceneActive: true }),
    });

    ScrollTrigger.refresh();
  });

  return null;
}
