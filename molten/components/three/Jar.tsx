"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { FLAVORS } from "@/lib/flavors";
import { jar, ui } from "@/lib/store";
import { drawLabel, drawLidTop } from "./textures";
import Steam from "./Steam";

/* ---------------------------------------------------------------- */
/* Geometry helpers                                                  */
/* ---------------------------------------------------------------- */

const R = 0.725; // outer radius of the glass body
const FILL = 0.42; // sauce fill height (y)

function smoothProfile(pts: [number, number][], divisions = 160) {
  const curve = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  return curve.getSpacedPoints(divisions);
}

function makeGlassGeometry() {
  // Outer wall up and over the lip, then back down the inside for real rim thickness
  const outer: [number, number][] = [
    [0.0, -1.0],
    [0.42, -1.0],
    [0.6, -0.988],
    [0.69, -0.955],
    [0.718, -0.9],
    [R, -0.8],
    [R, 0.0],
    [R, 0.46],
    [0.712, 0.57],
    [0.67, 0.67],
    [0.61, 0.745],
    [0.567, 0.79],
    [0.556, 0.83],
  ];
  const pts = smoothProfile(outer, 140);
  // Screw threads on the neck (kept sharp, not splined)
  const neck: [number, number][] = [
    [0.556, 0.85],
    [0.574, 0.865],
    [0.556, 0.88],
    [0.574, 0.895],
    [0.556, 0.91],
    [0.574, 0.925],
    [0.556, 0.94],
    [0.556, 0.965],
    [0.548, 0.982],
    [0.532, 0.986],
    [0.516, 0.978],
    [0.512, 0.95],
    [0.512, 0.82],
    [0.53, 0.76],
  ];
  neck.forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  const g = new THREE.LatheGeometry(pts, 128);
  g.computeVertexNormals();
  return g;
}

function makeSauceGeometry() {
  const pts = smoothProfile(
    [
      [0.0, -0.955],
      [0.5, -0.955],
      [0.64, -0.935],
      [0.69, -0.88],
      [0.7, -0.78],
      [0.7, 0.0],
      [0.7, FILL - 0.02],
      [0.692, FILL + 0.012],
      [0.62, FILL + 0.004],
      [0.3, FILL],
      [0.0, FILL],
    ],
    120,
  );
  return new THREE.LatheGeometry(pts, 96);
}

function makeKnurledLid() {
  const g = new THREE.CylinderGeometry(0.6, 0.6, 0.28, 220, 6, true);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const a = Math.atan2(v.z, v.x);
    const ridge = Math.pow(Math.abs(Math.sin(a * 55)), 0.6) * 0.009;
    // slight rounding toward the top/bottom edges
    const edge = 1 - Math.pow(Math.abs(v.y) / 0.14, 8) * 0.03;
    const r = (0.6 + ridge) * edge;
    const len = Math.hypot(v.x, v.z) || 1;
    p.setXYZ(i, (v.x / len) * r, v.y, (v.z / len) * r);
  }
  g.computeVertexNormals();
  return g;
}

/* ---------------------------------------------------------------- */

export default function Jar({ quality = 1 }: { quality?: number }) {
  const lidRef = useRef<THREE.Group>(null);
  const sauceMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const flakeMat = useRef<THREE.MeshStandardMaterial>(null);
  const labelGroup = useRef<THREE.Group>(null);

  const glassGeo = useMemo(makeGlassGeometry, []);
  const sauceGeo = useMemo(makeSauceGeometry, []);
  const lidGeo = useMemo(makeKnurledLid, []);
  const labelGeo = useMemo(
    () => new THREE.CylinderGeometry(R + 0.004, R + 0.004, 0.86, 160, 1, true, -Math.PI * 0.75, Math.PI * 1.5),
    [],
  );

  // Canvas textures (label + lid). Redrawn when the flavour changes.
  const { labelTex, labelCanvas, lidTex, lidCanvas } = useMemo(() => {
    // size canvases BEFORE creating textures so GPU storage matches
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 2048;
    labelCanvas.height = 600;
    const lidCanvas = document.createElement("canvas");
    lidCanvas.width = lidCanvas.height = 512;
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const lidTex = new THREE.CanvasTexture(lidCanvas);
    [labelTex, lidTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
    return { labelTex, labelCanvas, lidTex, lidCanvas };
  }, []);

  const targetSauce = useRef(new THREE.Color(FLAVORS[0].sauce));
  const swapSpin = useRef(0);

  useEffect(() => {
    let current = -1;
    const paint = (i: number) => {
      const f = FLAVORS[i];
      drawLabel(labelCanvas, f, i);
      drawLidTop(lidCanvas, f.accent);
      labelTex.needsUpdate = true;
      lidTex.needsUpdate = true;
    };
    const apply = () => {
      const i = ui.get().flavor;
      if (i === current) return;
      const first = current === -1;
      current = i;
      targetSauce.current.set(FLAVORS[i].sauce);
      if (first) {
        paint(i);
      } else {
        // whip the jar around and swap the label while it faces away
        swapSpin.current += Math.PI * 2;
        window.setTimeout(() => paint(i), 260);
      }
    };
    // Wait for fonts so the canvas typography is correct
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([
      fontsReady,
      document.fonts?.load('200px "Anton"'),
      document.fonts?.load('italic 64px "Instrument Serif"'),
      document.fonts?.load('600 22px "Inter Tight Variable"'),
    ])
      .catch(() => undefined)
      .then(() => {
        current = -1;
        apply();
      });
    paint(ui.get().flavor);
    current = ui.get().flavor;
    return ui.subscribe(apply);
  }, [labelCanvas, lidCanvas, labelTex, lidTex]);

  // Chilli flakes & seeds suspended in the sauce, pressed to the glass
  const flakes = useMemo(() => {
    const count = 140;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const pos = new THREE.Vector3();
    const e = new THREE.Euler();
    const mats: THREE.Matrix4[] = [];
    let seed = 42;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const y = -0.86 + r() * (FILL - 0.06 + 0.86);
      const rad = 0.704;
      pos.set(Math.sin(a) * rad, y, Math.cos(a) * rad);
      e.set(r() * 3, a + Math.PI / 2, r() * 3);
      q.setFromEuler(e);
      const big = r();
      s.set(0.018 + big * 0.022, 0.004, 0.012 + r() * 0.016);
      m.compose(pos, q, s);
      mats.push(m.clone());
    }
    return mats;
  }, []);
  const flakesRef = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    flakes.forEach((m, i) => flakesRef.current?.setMatrixAt(i, m));
    if (flakesRef.current) flakesRef.current.instanceMatrix.needsUpdate = true;
  }, [flakes]);

  const labelSpin = useRef(0);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    // Sauce colour easing
    if (sauceMat.current) {
      sauceMat.current.color.lerp(targetSauce.current, 1 - Math.pow(0.02, d));
      sauceMat.current.emissive.copy(sauceMat.current.color).multiplyScalar(0.12);
      sauceMat.current.sheenColor.copy(sauceMat.current.color).offsetHSL(0.02, 0, 0.06);
    }
    if (flakeMat.current) {
      flakeMat.current.color.copy(targetSauce.current).offsetHSL(0, 0.1, -0.12);
    }

    // Flavour-change whip spin (applied to the whole jar body)
    if (labelGroup.current) {
      const target = swapSpin.current;
      labelSpin.current += (target - labelSpin.current) * (1 - Math.pow(0.0025, d));
      labelGroup.current.rotation.y = labelSpin.current;
    }

    // Lid: floating open ↔ screwed shut
    if (lidRef.current) {
      const t = state.clock.elapsedTime;
      const open = jar.lid;
      lidRef.current.position.set(
        0.1 * open,
        0.955 + open * (0.42 + Math.sin(t * 1.1) * 0.03),
        -0.05 * open,
      );
      lidRef.current.rotation.set(-0.22 * open, open * t * 0.15 + (1 - open) * 6.0, 0.2 * open);
    }
  });

  const samples = quality > 0.75 ? 8 : 4;
  const resolution = quality > 0.75 ? 1024 : 512;

  return (
    <group>
      <group ref={labelGroup}>
        {/* Glass */}
        <mesh geometry={glassGeo} renderOrder={2}>
          <MeshTransmissionMaterial
            backside={quality > 0.75}
            backsideThickness={0.4}
            samples={samples}
            resolution={resolution}
            transmission={1}
            thickness={0.32}
            roughness={0.035}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropicBlur={0.1}
            distortion={0.08}
            distortionScale={0.25}
            temporalDistortion={0.04}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationDistance={3}
            attenuationColor="#fff4ea"
            color="#ffffff"
            background={new THREE.Color("#0a0908")}
          />
        </mesh>

        {/* Sauce */}
        <mesh geometry={sauceGeo}>
          <meshPhysicalMaterial
            ref={sauceMat}
            color={FLAVORS[0].sauce}
            roughness={0.22}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.12}
            sheen={0.3}
            sheenRoughness={0.4}
            specularIntensity={0.8}
          />
        </mesh>

        {/* Flakes & seeds */}
        <instancedMesh ref={flakesRef} args={[undefined, undefined, flakes.length]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial ref={flakeMat} color="#5a0d04" roughness={0.55} />
        </instancedMesh>

        {/* Label */}
        <mesh geometry={labelGeo} position={[0, -0.16, 0]}>
          <meshPhysicalMaterial
            map={labelTex}
            roughness={0.48}
            clearcoat={0.35}
            clearcoatRoughness={0.4}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>

      {/* Lid */}
      <group ref={lidRef}>
        <mesh geometry={lidGeo}>
          <meshStandardMaterial color="#121010" metalness={0.85} roughness={0.3} envMapIntensity={1.3} side={THREE.DoubleSide} />
        </mesh>
        {/* underside of the cap so it never reads as hollow */}
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.59, 64]} />
          <meshStandardMaterial color="#0a0808" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.592, 0.016, 16, 160]} />
          <meshStandardMaterial color="#1b1715" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.142, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.592, 96]} />
          <meshPhysicalMaterial map={lidTex} metalness={0.55} roughness={0.38} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.52, 0.6, 96]} />
          <meshStandardMaterial color="#0d0b0a" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <Steam />
    </group>
  );
}
