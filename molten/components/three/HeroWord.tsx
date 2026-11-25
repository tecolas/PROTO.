"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const DEPTH = -1.8;
const tmp = new THREE.Vector3(0, 0, DEPTH);

/**
 * The oversized hero wordmark lives in 3D (behind the jar) so the glass
 * genuinely refracts it. Its Y position is synced to native scroll so it
 * moves exactly like DOM content.
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
    const target = vp.width * (landscape ? 0.92 : 0.92);
    const scroll = window.scrollY / window.innerHeight;
    g.scale.setScalar(target / w);
    const baseY = landscape ? 0.09 * vp.height : 0.17 * vp.height;
    g.position.set(0, baseY + scroll * vp.height, DEPTH);
    g.visible = scroll < 1.3;
  });

  return (
    <group ref={group}>
      <Text
        font={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fonts/anton.woff`}
        fontSize={1}
        letterSpacing={-0.01}
        anchorX="center"
        anchorY="middle"
        onSync={(t: THREE.Mesh) => {
          t.geometry.computeBoundingBox();
          const bb = t.geometry.boundingBox;
          if (bb) setW(Math.max(0.1, bb.max.x - bb.min.x));
        }}
      >
        MOLTEN
        <meshBasicMaterial color="#ff5b0b" toneMapped={false} />
      </Text>
    </group>
  );
}
