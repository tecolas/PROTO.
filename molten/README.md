# MOLTEN — Gourmet Sauce Landing Page

Landing page for a fictional small-batch hot sauce brand, in orange and black. A procedurally modelled 3D glass jar is the hero, and scroll moves it through the page.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · React Three Fiber + drei · GSAP ScrollTrigger · Framer Motion · Lenis smooth scroll

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What's in it

- **3D jar** (`components/three/`): built entirely in code, with no model files.
  - Lathe-turned glass with screw threads, using `MeshTransmissionMaterial` for refraction, chromatic aberration and the backside pass.
  - Sauce whose colour eases to the active flavour, with chilli flakes and seeds pressed against the glass.
  - A knurled metal lid that floats open while steam escapes, then screws shut as you scroll.
  - Wrap-around labels drawn on a canvas, redrawn whenever the flavour changes (the jar spins and swaps the label).
  - Steam from domain-warped fbm shader wisps.
  - About 120 instanced spice particles (chilli flakes, peppercorns, seeds, salt).
  - Firelight rim lights that flicker, plus a light that follows the cursor.
  - A studio environment made from Lightformers, so nothing is fetched at runtime.
  - The giant **MOLTEN** hero word is drawn in 3D behind the jar, so the glass refracts it. Its position is synced to native scroll.
- **Scroll choreography:**
  - `JarDirector` moves the fixed jar between layout slots: centre, then left, then right, then up and out.
  - The **Story** section is pinned with a scrubbed GSAP timeline (spin, lid closing, chapter transitions).
  - The **Flavors** section is pinned too; scroll progress selects the flavour.
- **Sections:** preloader, hero, a marquee that reacts to scroll velocity, story, flavors, ingredients (with counters and parallax), shop (tilt cards, a bundle, add to cart), reviews and a footer with a newsletter signup.
- **Micro-interactions:**
  - A custom cursor with labels, and magnetic buttons with a liquid fill and rolling label.
  - A cart drawer with a free-shipping progress bar.
  - Character-by-character flavour title transitions.
- **Performance:**
  - WebGL rendering stops entirely once the jar scrolls off.
  - Small or low-core devices get lower DPR and fewer transmission samples and particles.
  - `prefers-reduced-motion` disables smooth scrolling and CSS animations.

## Structure

```
app/                 layout, global styles (Tailwind v4 @theme tokens, grain/texture utilities)
components/three/    Scene, Jar, Steam, Spices, HeroWord, canvas label textures
components/sections/ Hero, Marquee, Story, Flavors, Ingredients, Shop, Reviews, Footer
components/ui/       FireButton, Magnetic, Cursor, Reveal, Heat, JarArt (SVG jar)
lib/                 flavour data, tiny external store (jar choreography, UI, cart), Lenis helpers
```
