"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { FLAVORS } from "@/lib/flavors";
import { jar, ui, useUI } from "@/lib/store";
import Jar from "./Jar";
import Spices from "./Spices";
import HeroWord from "./HeroWord";

const ORIGIN = new THREE.Vector3();

/* Soft radial back-glow tinted by the active flavour */
function Glow() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const target = useRef(new THREE.Color(FLAVORS[0].accent));
  useEffect(() => ui.subscribe(() => target.current.set(FLAVORS[ui.get().flavor].accent)), []);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(FLAVORS[0].accent) }, uTime: { value: 0 }, uAmount: { value: 1 } }),
    [],
  );
  useFrame((s, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uColor.value.lerp(target.current, 1 - Math.pow(0.05, dt));
    u.uTime.value = s.clock.elapsedTime;
    u.uAmount.value = jar.visible;
  });
  return (
    <mesh position={[0, 0.1, -1.2]} renderOrder={-1}>
      <planeGeometry args={[7, 7]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
        fragmentShader={`
          uniform vec3 uColor; uniform float uTime; uniform float uAmount; varying vec2 vUv;
          void main(){
            vec2 p = vUv - 0.5;
            float d = length(p * vec2(1.0, 0.85));
            float pulse = 0.9 + 0.1 * sin(uTime * 1.7) * sin(uTime * 0.7 + 1.3);
            float g = smoothstep(0.5, 0.0, d);
            g = pow(g, 2.4) * 0.55 * pulse * uAmount;
            gl_FragColor = vec4(uColor * g, g);
          }`}
      />
    </mesh>
  );
}

/* Positions / rotates the jar according to the scroll choreography */
function Rig({ children }: { children: React.ReactNode }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const prevX = useRef(0);

  useFrame((state, dt) => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const d = Math.min(dt, 1 / 30);
    const vp = state.viewport.getCurrentViewport(camera, ORIGIN);
    const landscape = size.width >= 768 && size.width > size.height * 1.05;

    let tx: number, ty: number, ts: number;
    if (landscape) {
      tx = jar.side * vp.width * 0.24;
      ty = -0.22;
      ts = (vp.height / 4.7) * jar.scale;
    } else {
      const off = Math.min(1, Math.abs(jar.side));
      tx = 0;
      ty = vp.height * (0.09 + off * 0.07);
      ts = Math.min(1, vp.width / 2.6) * jar.scale * (1 - off * 0.12);
    }
    ty += jar.lift * vp.height;

    o.position.x = THREE.MathUtils.damp(o.position.x, tx, 3.2, d);
    o.position.y = THREE.MathUtils.damp(o.position.y, ty, 3.2, d);
    const s = THREE.MathUtils.damp(o.scale.x, ts, 3.2, d);
    o.scale.setScalar(s);

    // lean into horizontal movement
    const vx = (o.position.x - prevX.current) / Math.max(d, 1e-4);
    prevX.current = o.position.x;

    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const ry = Math.sin(t * 0.25) * 0.85 + jar.spin + px * 0.45;
    i.rotation.y = THREE.MathUtils.damp(i.rotation.y, ry, 4, d);
    i.rotation.x = THREE.MathUtils.damp(i.rotation.x, 0.08 - py * 0.12 + Math.sin(t * 0.6) * 0.02, 3, d);
    i.rotation.z = THREE.MathUtils.damp(i.rotation.z, -vx * 0.05 + Math.sin(t * 0.45) * 0.025, 3, d);
    i.position.y = Math.sin(t * 0.9) * 0.04;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

/* Spices orbit with the jar's position but not its spin */
function SpiceRig({ density }: { density: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    const d = Math.min(dt, 1 / 30);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, state.pointer.y * 0.25, 2, d);
    g.current.rotation.z = THREE.MathUtils.damp(g.current.rotation.z, -state.pointer.x * 0.15, 2, d);
  });
  return (
    <group ref={g}>
      <Spices density={density} />
    </group>
  );
}

/* Fire-like dynamic lighting that also tracks the pointer */
function Lights() {
  const rimA = useRef<THREE.PointLight>(null);
  const rimB = useRef<THREE.PointLight>(null);
  const cursor = useRef<THREE.PointLight>(null);
  const key = useRef<THREE.SpotLight>(null);
  const tint = useRef(new THREE.Color(FLAVORS[0].accent));
  useEffect(() => ui.subscribe(() => tint.current.set(FLAVORS[ui.get().flavor].accent)), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.82 + 0.1 * Math.sin(t * 7.3) + 0.06 * Math.sin(t * 13.7 + 1.2) + 0.05 * Math.sin(t * 2.1 + 0.4);
    if (rimA.current) {
      rimA.current.intensity = 55 * flicker;
      rimA.current.color.lerp(tint.current, 1 - Math.pow(0.05, dt));
    }
    if (rimB.current) rimB.current.intensity = 32 * (1.65 - flicker);
    if (cursor.current) {
      const p = state.pointer;
      cursor.current.position.x = THREE.MathUtils.damp(cursor.current.position.x, p.x * 3.2, 3, dt);
      cursor.current.position.y = THREE.MathUtils.damp(cursor.current.position.y, p.y * 2.2 + 0.4, 3, dt);
    }
    if (key.current) key.current.position.x = 3.5 + Math.sin(t * 0.3) * 0.8;
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#ffe2cc" />
      <spotLight ref={key} position={[3.5, 5, 5]} angle={0.45} penumbra={1} intensity={90} color="#fff1e2" />
      <pointLight ref={rimA} position={[-2.6, 1.4, -2]} color="#ff5b0b" intensity={55} />
      <pointLight ref={rimB} position={[2.8, -1.3, -1.6]} color="#ff8a2a" intensity={30} />
      <pointLight ref={cursor} position={[0, 0.4, 3]} color="#ffcf9e" intensity={9} />
    </>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#060505"]} />
      {/* tall softboxes — the classic vertical glass highlights */}
      <Lightformer form="rect" intensity={3.2} color="#fff6ee" position={[-3.2, 0.5, 3]} scale={[0.9, 6, 1]} rotation-y={Math.PI / 5} />
      <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[3.4, 0.5, 2.6]} scale={[0.5, 6, 1]} rotation-y={-Math.PI / 4.5} />
      {/* warm fire bounce */}
      <Lightformer form="rect" intensity={4} color="#ff5b0b" position={[0, -3, -2]} scale={[8, 1.5, 1]} rotation-x={-Math.PI / 3} />
      <Lightformer form="ring" intensity={2.4} color="#ff8a2a" position={[-4, 3, -4]} scale={2.2} onUpdate={(s) => s.lookAt(0, 0, 0)} />
      {/* top strip */}
      <Lightformer form="rect" intensity={1.6} color="#ffe8d6" position={[0, 5, 0]} scale={[6, 0.6, 1]} rotation-x={Math.PI / 2} />
    </Environment>
  );
}

function Ready() {
  useEffect(() => {
    ui.set({ loaded: true });
  }, []);
  return null;
}

export default function Scene() {
  const active = useUI((s) => s.sceneActive);
  const [quality, setQuality] = useState(1);
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setEventSource(document.body);
    const small = window.innerWidth < 768;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    setQuality(small || weak ? 0.5 : 1);
  }, []);

  if (!eventSource) return null;

  return (
    <Canvas
      eventSource={eventSource}
      eventPrefix="client"
      frameloop={active ? "always" : "never"}
      dpr={quality > 0.75 ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0.35, 6.2], fov: 35, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        camera.lookAt(0, 0.1, 0);
      }}
    >
      <Lights />
      <Suspense fallback={null}>
        <Studio />
        <HeroWord />
        <Rig>
          <Jar quality={quality} />
        </Rig>
        <Ready />
      </Suspense>
      <RigFollower>
        <Glow />
        <SpiceRig density={quality > 0.75 ? 1 : 0.6} />
      </RigFollower>
    </Canvas>
  );
}

/* Glow + spices follow the jar's position (read from the same state) */
function RigFollower({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  useFrame((state, dt) => {
    if (!g.current) return;
    const d = Math.min(dt, 1 / 30);
    const vp = state.viewport.getCurrentViewport(camera, ORIGIN);
    const landscape = size.width >= 768 && size.width > size.height * 1.05;
    const off = Math.min(1, Math.abs(jar.side));
    const tx = landscape ? jar.side * vp.width * 0.24 : 0;
    const ty = (landscape ? -0.22 : vp.height * (0.09 + off * 0.07)) + jar.lift * vp.height;
    const ts = landscape ? (vp.height / 4.7) * jar.scale : Math.min(1, vp.width / 2.6) * jar.scale;
    g.current.position.x = THREE.MathUtils.damp(g.current.position.x, tx, 2.4, d);
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, ty, 2.4, d);
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, ts, 2.4, d));
  });
  return <group ref={g}>{children}</group>;
}
