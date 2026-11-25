"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { garment } from "@/lib/store";

type P = { r: number; a: number; y: number; speed: number; fall: number; phase: number; s: number; rx: number; ry: number };

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

const ON_LIGHT = new THREE.Color("#9b9b97");
const ON_DARK = new THREE.Color("#f4f4f0");

/** Drifting snow flecks + loose fibres orbiting the garment. */
function Field({
  count,
  geometry,
  scale,
  seed,
  size,
}: {
  count: number;
  geometry: THREE.BufferGeometry;
  scale: [number, number, number];
  seed: number;
  size: [number, number];
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.6 }), []);
  const parts = useMemo<P[]>(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({
      r: 1.3 + r() * 1.9,
      a: r() * Math.PI * 2,
      y: -1.6 + r() * 3.4,
      speed: (0.03 + r() * 0.09) * (r() > 0.5 ? 1 : -1),
      fall: 0.04 + r() * 0.08,
      phase: r() * Math.PI * 2,
      s: size[0] + r() * (size[1] - size[0]),
      rx: (r() - 0.5) * 2,
      ry: (r() - 0.5) * 2,
    }));
  }, [count, seed, size]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 1 / 30);
    material.color.copy(ON_LIGHT).lerp(ON_DARK, garment.dark);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.a += p.speed * d;
      p.y -= p.fall * d;
      if (p.y < -1.8) p.y = 1.8;
      const rr = p.r * garment.spread;
      dummy.position.set(Math.cos(p.a) * rr, p.y + Math.sin(t * 0.7 + p.phase) * 0.06, Math.sin(p.a) * rr * 0.8);
      dummy.rotation.set(t * p.rx + p.phase, t * p.ry, p.phase);
      const s = p.s * garment.visible * (1 - garment.zoom * 0.5);
      dummy.scale.set(scale[0] * s, scale[1] * s, scale[2] * s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />;
}

export default function Particles({ density = 1 }: { density?: number }) {
  const n = (c: number) => Math.max(8, Math.round(c * density));
  const flake = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const fibre = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 5, 1), []);
  return (
    <group>
      <Field count={n(110)} geometry={flake} scale={[1, 1, 1]} seed={7} size={[0.006, 0.016]} />
      <Field count={n(26)} geometry={fibre} scale={[0.06, 1, 0.06]} seed={29} size={[0.03, 0.07]} />
    </group>
  );
}
