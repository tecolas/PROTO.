"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const DEPTH = -1.6;
const tmp = new THREE.Vector3(0, 0, DEPTH);
const FONT = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fonts/archivo-black.woff`;

/**
 * Oversized outlined wordmark living in 3D behind the garment, synced to
 * native scroll so it moves exactly like the DOM.
 */
export default function HeroWord() {
  const group = useRef<THREE.Group>(null);
  const [w, setW] = useState(1);
  const { camera, size } = useThree();

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const vp = state.viewport.getCurrentViewport(camera, tmp);
    const landscape = size.width > size.height;
    const scroll = window.scrollY / window.innerHeight;
    g.scale.setScalar((vp.width * (landscape ? 0.94 : 0.92)) / w);
    g.position.set(0, (landscape ? 0.06 : 0.12) * vp.height + scroll * vp.height, DEPTH);
    g.visible = scroll < 1.3;
  });

  return (
    <group ref={group}>
      <Text
        font={FONT}
        fontSize={1}
        letterSpacing={-0.03}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
        strokeWidth={0.008}
        strokeColor="#0b0b0b"
        strokeOpacity={1}
        onSync={(t: THREE.Mesh) => {
          t.geometry.computeBoundingBox();
          const bb = t.geometry.boundingBox;
          if (bb) setW(Math.max(0.1, bb.max.x - bb.min.x));
        }}
      >
        NORTE
        <meshBasicMaterial transparent toneMapped={false} />
      </Text>
    </group>
  );
}
