"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useUI } from "@/lib/store";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/** Fixed full-viewport WebGL layer that sits behind the page content. */
export default function SceneMount() {
  const intro = useUI((s) => s.introDone);
  const active = useUI((s) => s.sceneActive);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: intro ? 1 : 0, scale: intro ? 1 : 1.08 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ visibility: active ? "visible" : "hidden" }}
    >
      <Scene />
    </motion.div>
  );
}
