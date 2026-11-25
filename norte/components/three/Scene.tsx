"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { garment, ui, useUI } from "@/lib/store";
import Garment from "./Garment";
import Mist from "./Mist";
import Particles from "./Particles";
import HeroWord from "./HeroWord";

const ORIGIN = new THREE.Vector3();

/** Shared layout maths: where the garment sits for the current scroll state. */
function layout(vp: { width: number; height: number }, landscape: boolean) {
  const off = Math.min(1, Math.abs(garment.side));
  let x: number, y: number, s: number;
  if (landscape) {
    x = garment.side * vp.width * 0.24;
    y = -0.08;
    s = (vp.height / 3.55) * garment.scale;
  } else {
    x = 0;
    y = vp.height * (0.075 + off * 0.09);
    s = Math.min(1, vp.width / 2.75) * garment.scale * (1 - off * 0.12);
  }
  // close-up on the collar: scale up and bring the neckline to frame centre
  const z = garment.zoom;
  const zs = 1 + z * (landscape ? 1.7 : 1.3);
  s *= zs;
  y -= z * 1.08 * s;
  y += garment.lift * vp.height;
  return { x, y, s };
}

function Rig({ children }: { children: React.ReactNode }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const prevX = useRef(0);

  useFrame((state, dt) => {
    const o = outer.current,
      i = inner.current;
    if (!o || !i) return;
    const d = Math.min(dt, 1 / 30);
    const vp = state.viewport.getCurrentViewport(camera, ORIGIN);
    const landscape = size.width >= 768 && size.width > size.height * 1.05;
    const L = layout(vp, landscape);
    o.position.x = THREE.MathUtils.damp(o.position.x, L.x, 3, d);
    o.position.y = THREE.MathUtils.damp(o.position.y, L.y, 3, d);
    o.scale.setScalar(THREE.MathUtils.damp(o.scale.x, L.s, 3, d));

    const vx = (o.position.x - prevX.current) / Math.max(d, 1e-4);
    prevX.current = o.position.x;

    const t = state.clock.elapsedTime;
    const p = state.pointer;
    const calm = 1 - garment.zoom * 0.75;
    const ry = (Math.sin(t * 0.28) * 0.55 + p.x * 0.4) * calm + garment.spin;
    i.rotation.y = THREE.MathUtils.damp(i.rotation.y, ry, 3.5, d);
    i.rotation.x = THREE.MathUtils.damp(i.rotation.x, (0.04 - p.y * 0.08) * calm, 3, d);
    i.rotation.z = THREE.MathUtils.damp(i.rotation.z, -vx * 0.04 + Math.sin(t * 0.4) * 0.015, 3, d);
    i.position.y = Math.sin(t * 0.8) * 0.035 * calm;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

/** Follows the garment's position (not its rotation) — for shadow, mist & particles */
function Follower({ children, withZoom = true }: { children: React.ReactNode; withZoom?: boolean }) {
  const g = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  useFrame((state, dt) => {
    if (!g.current) return;
    const d = Math.min(dt, 1 / 30);
    const vp = state.viewport.getCurrentViewport(camera, ORIGIN);
    const landscape = size.width >= 768 && size.width > size.height * 1.05;
    const L = layout(vp, landscape);
    const z = withZoom ? 1 : 0;
    g.current.position.x = THREE.MathUtils.damp(g.current.position.x, L.x, 2.4, d);
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, z ? L.y : L.y, 2.4, d);
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, L.s, 2.4, d));
  });
  return <group ref={g}>{children}</group>;
}

function BlobShadow() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uAmount: { value: 0.4 } }), []);
  useFrame(() => {
    if (mat.current) mat.current.uniforms.uAmount.value = 0.38 * (1 - garment.dark) * garment.visible * (1 - garment.zoom);
  });
  return (
    <mesh position={[0, -1.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.4, 1.6]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
        fragmentShader={`uniform float uAmount; varying vec2 vUv;
          void main(){ vec2 p=(vUv-.5)*vec2(1.,1.); float d=length(p*vec2(1.15,1.6));
          float a=smoothstep(.5,.0,d); gl_FragColor=vec4(0.,0.,0.,pow(a,1.6)*uAmount); }`}
      />
    </mesh>
  );
}

function Lights() {
  const key = useRef<THREE.SpotLight>(null);
  const rimA = useRef<THREE.PointLight>(null);
  const rimB = useRef<THREE.PointLight>(null);
  const cursor = useRef<THREE.PointLight>(null);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = state.pointer;
    if (key.current) {
      key.current.position.x = 3.6 * Math.cos(t * 0.18);
      key.current.position.z = 4.5 + Math.sin(t * 0.18) * 1.2;
    }
    // rims swell on dark scenes so the silhouette always reads
    const boost = 1 + garment.dark * 0.8;
    if (rimA.current) rimA.current.intensity = 38 * boost * (0.92 + 0.08 * Math.sin(t * 0.9));
    if (rimB.current) rimB.current.intensity = 30 * boost * (0.92 + 0.08 * Math.cos(t * 0.7));
    if (cursor.current) {
      cursor.current.position.x = THREE.MathUtils.damp(cursor.current.position.x, p.x * 3.4, 3, dt);
      cursor.current.position.y = THREE.MathUtils.damp(cursor.current.position.y, p.y * 2.4 + 0.3, 3, dt);
    }
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#ffffff", "#2a2a2a", 0.35]} />
      <spotLight ref={key} position={[3.6, 5, 4.5]} angle={0.5} penumbra={1} intensity={110} />
      <pointLight ref={rimA} position={[-2.8, 1.8, -2.2]} intensity={38} />
      <pointLight ref={rimB} position={[2.9, -0.6, -2.4]} intensity={30} />
      <pointLight ref={cursor} position={[0, 0.3, 3]} intensity={10} color="#fbfbf8" />
    </>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#0a0a0a"]} />
      <Lightformer form="rect" intensity={3.5} position={[-3.5, 1, 3]} scale={[1.2, 7, 1]} rotation-y={Math.PI / 5} />
      <Lightformer form="rect" intensity={2.5} position={[3.6, 1, 2.6]} scale={[0.6, 7, 1]} rotation-y={-Math.PI / 4.5} />
      <Lightformer form="rect" intensity={2} position={[0, 5, 1]} scale={[8, 1, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="ring" intensity={2} position={[0, 1, -5]} scale={3} />
      <Lightformer form="rect" intensity={0.8} position={[0, -4, 2]} scale={[8, 1, 1]} rotation-x={-Math.PI / 2} />
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
      dpr={quality > 0.75 ? [1, 1.75] : [1, 1.3]}
      camera={{ position: [0, 0.3, 6.4], fov: 35, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        camera.lookAt(0, 0.05, 0);
      }}
    >
      <Lights />
      <Suspense fallback={null}>
        <Studio />
        <HeroWord />
        <Rig>
          <Garment />
        </Rig>
        <Ready />
      </Suspense>
      <Follower>
        <BlobShadow />
        <Mist />
        <Particles density={quality > 0.75 ? 1 : 0.6} />
      </Follower>
    </Canvas>
  );
}
