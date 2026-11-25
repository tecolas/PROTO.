"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { garment } from "@/lib/store";

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
  uniform float uMode;   // 0 = rising wisp, 1 = drifting ground fog
  uniform vec3 uColor;
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
    float t = uTime * 0.25 + uSeed * 10.0;
    float a;
    if (uMode < 0.5) {
      float warp = fbm(vec2(uv.y * 2.0 - t, uSeed)) - 0.5;
      float x = uv.x - 0.5 + warp * (0.2 + uv.y * 0.35);
      float width = mix(0.08, 0.38, uv.y);
      float column = smoothstep(width, 0.0, abs(x));
      float n = smoothstep(0.4, 0.9, fbm(vec2(x * 4.0 + uSeed * 3.0, uv.y * 3.0 - t * 1.5)));
      a = column * n * smoothstep(0.0, 0.18, uv.y) * (1.0 - smoothstep(0.35, 1.0, uv.y));
    } else {
      float n = fbm(vec2(uv.x * 3.0 - t * 0.6 + uSeed * 4.0, uv.y * 2.0 + t * 0.15));
      n = smoothstep(0.35, 0.85, n);
      float band = smoothstep(0.0, 0.35, uv.y) * (1.0 - smoothstep(0.45, 1.0, uv.y));
      float edges = smoothstep(0.0, 0.25, uv.x) * (1.0 - smoothstep(0.75, 1.0, uv.x));
      a = n * band * edges;
    }
    gl_FragColor = vec4(uColor, a * uAmount);
  }
`;

const LIGHT = new THREE.Color("#7d7d7a");
const DARK = new THREE.Color("#ffffff");

function Layer({
  seed,
  mode,
  amount,
  ...props
}: { seed: number; mode: 0 | 1; amount: number } & ThreeElements["mesh"]) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmount: { value: 0 },
      uSeed: { value: seed },
      uMode: { value: mode },
      uColor: { value: new THREE.Color() },
    }),
    [seed, mode],
  );
  useFrame((s, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = s.clock.elapsedTime;
    u.uColor.value.copy(LIGHT).lerp(DARK, garment.dark);
    // mist reads stronger on a dark stage
    const target = amount * garment.visible * (0.55 + 0.45 * garment.dark) * (1 - garment.zoom * 0.7);
    u.uAmount.value = THREE.MathUtils.damp(u.uAmount.value, target, 3, Math.min(dt, 0.1));
  });
  return (
    <mesh {...props}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}

/** Warm breath rising from the collar + a cold fog bank drifting below. */
export default function Mist() {
  return (
    <>
      <Billboard position={[0, 1.2, 0]} lockX lockZ>
        <Layer seed={0.21} mode={0} amount={0.38} position={[0, 0.8, 0]} scale={[1.1, 1.7, 1]} />
        <Layer seed={0.67} mode={0} amount={0.3} position={[0.08, 0.7, 0.01]} scale={[0.9, 1.5, 1]} />
      </Billboard>
      <Layer seed={0.37} mode={1} amount={0.55} position={[0, -1.35, 0.6]} scale={[5.5, 1.3, 1]} />
      <Layer seed={0.83} mode={1} amount={0.4} position={[0.3, -1.1, -0.8]} scale={[6, 1.6, 1]} />
    </>
  );
}
