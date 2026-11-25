"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { jar } from "@/lib/store";

type Kind = {
  count: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  scale: [number, number, number];
  size: [number, number];
};

type Particle = {
  r: number;
  a: number;
  y: number;
  speed: number;
  bob: number;
  phase: number;
  rx: number;
  ry: number;
  s: number;
};

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function bumpy(radius: number, detail: number, amount: number, seed: number) {
  const g = new THREE.IcosahedronGeometry(radius, detail);
  const p = g.attributes.position as THREE.BufferAttribute;
  const r = seeded(seed);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    v.multiplyScalar(1 + (r() - 0.5) * amount);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function SpiceField({ kind, seed }: { kind: Kind; seed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo<Particle[]>(() => {
    const r = seeded(seed);
    return Array.from({ length: kind.count }, () => ({
      r: 1.2 + r() * 1.6,
      a: r() * Math.PI * 2,
      y: -1.15 + r() * 2.9,
      speed: (0.05 + r() * 0.12) * (r() > 0.5 ? 1 : -1),
      bob: 0.05 + r() * 0.12,
      phase: r() * Math.PI * 2,
      rx: (r() - 0.5) * 1.6,
      ry: (r() - 0.5) * 1.6,
      s: kind.size[0] + r() * (kind.size[1] - kind.size[0]),
    }));
  }, [kind, seed]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (ref.current) ref.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 1 / 30);
    const spread = jar.spread;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.a += p.speed * d;
      const rr = p.r * spread;
      dummy.position.set(Math.cos(p.a) * rr, p.y * (0.8 + spread * 0.2) + Math.sin(t * 0.8 + p.phase) * p.bob, Math.sin(p.a) * rr);
      dummy.rotation.set(t * p.rx + p.phase, t * p.ry, p.phase);
      const s = p.s * jar.visible;
      dummy.scale.set(kind.scale[0] * s, kind.scale[1] * s, kind.scale[2] * s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[kind.geometry, kind.material, kind.count]} frustumCulled={false} />;
}

export default function Spices({ density = 1 }: { density?: number }) {
  const kinds = useMemo<Kind[]>(() => {
    const n = (c: number) => Math.max(6, Math.round(c * density));
    return [
      {
        // chilli flakes – thin curled shards
        count: n(46),
        geometry: bumpy(1, 0, 0.6, 3),
        material: new THREE.MeshStandardMaterial({ color: "#c2260c", roughness: 0.5, emissive: "#3a0700", side: THREE.DoubleSide }),
        scale: [1, 0.22, 0.7],
        size: [0.035, 0.07],
      },
      {
        // black peppercorns – wrinkled spheres
        count: n(26),
        geometry: bumpy(1, 2, 0.28, 9),
        material: new THREE.MeshStandardMaterial({ color: "#1a1210", roughness: 0.75, metalness: 0.1 }),
        scale: [1, 1, 1],
        size: [0.022, 0.034],
      },
      {
        // chilli seeds – pale flattened discs
        count: n(34),
        geometry: new THREE.SphereGeometry(1, 10, 8),
        material: new THREE.MeshStandardMaterial({ color: "#f0c27a", roughness: 0.45, emissive: "#2a1500" }),
        scale: [1, 0.28, 0.82],
        size: [0.018, 0.028],
      },
      {
        // smoked salt crystals
        count: n(16),
        geometry: bumpy(1, 0, 0.3, 21),
        material: new THREE.MeshPhysicalMaterial({ color: "#fff1e4", roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.85 }),
        scale: [1, 0.9, 1],
        size: [0.018, 0.03],
      },
    ];
  }, [density]);

  return (
    <group>
      {kinds.map((k, i) => (
        <SpiceField key={i} kind={k} seed={17 + i * 31} />
      ))}
    </group>
  );
}
