"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { jar } from "@/lib/store";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uAmount;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.32 + uSeed * 10.0;

    // Domain-warped curl so wisps twist as they climb
    float warp = fbm(vec2(uv.y * 2.2 - t, uSeed)) - 0.5;
    float x = uv.x - 0.5 + warp * (0.18 + uv.y * 0.35);

    float width = mix(0.07, 0.36, smoothstep(0.0, 1.0, uv.y));
    float column = smoothstep(width, 0.0, abs(x));

    float n = fbm(vec2(x * 4.0 + uSeed * 3.0, uv.y * 3.0 - t * 1.6));
    n = smoothstep(0.38, 0.92, n);

    float fadeIn = smoothstep(0.0, 0.14, uv.y);
    float fadeOut = 1.0 - smoothstep(0.35, 1.0, uv.y);

    float a = column * n * fadeIn * fadeOut * uAmount * 0.55;
    vec3 col = mix(vec3(1.0, 0.86, 0.74), vec3(1.0), uv.y);
    gl_FragColor = vec4(col, a);
  }
`;

function Wisp({ seed, x, scale }: { seed: number; x: number; scale: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmount: { value: 1 }, uSeed: { value: seed } }),
    [seed],
  );
  useFrame((s, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = s.clock.elapsedTime;
    const target = jar.steam * jar.visible;
    u.uAmount.value = THREE.MathUtils.damp(u.uAmount.value, target, 4, Math.min(dt, 0.1));
  });
  return (
    <mesh position={[x, 0.95 * scale, 0]} scale={scale}>
      <planeGeometry args={[1.3, 1.9]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Steam() {
  return (
    <Billboard position={[0, 1.0, 0]} lockX lockZ>
      <Wisp seed={0.13} x={-0.04} scale={1} />
      <Wisp seed={0.71} x={0.09} scale={0.82} />
      <Wisp seed={0.42} x={-0.12} scale={1.15} />
    </Billboard>
  );
}
