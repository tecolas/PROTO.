"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { COLORS, TYPES, type FabricKind } from "@/lib/catalog";
import { garment, ui } from "@/lib/store";
import { fabricNormalMap, labelTexture } from "./fabric";

/* ================================================================== */
/* Shape functions                                                     */
/* ================================================================== */

const HEM = -1.2;
const NECK = 0.97;
const lerp = THREE.MathUtils.lerp;
const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const se = (c: number, n: number) => Math.sign(c) * Math.pow(Math.abs(c), 2 / n);

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x),
    yi = Math.floor(y);
  const xf = x - xi,
    yf = y - yi;
  const u = xf * xf * (3 - 2 * xf),
    v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi),
    b = hash(xi + 1, yi),
    c = hash(xi, yi + 1),
    d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function torsoW(y: number) {
  const chest = smooth(-0.35, 0.45, y);
  let w = 0.7 + 0.045 * chest;
  const slope = lerp(0.745, 0.272, THREE.MathUtils.clamp((y - 0.7) / (NECK - 0.7), 0, 1));
  w = lerp(w, slope, smooth(0.6, 0.76, y));
  // ribbed hem pulls in
  w *= 0.955 + 0.045 * smooth(HEM + 0.1, HEM + 0.16, y);
  return w;
}
function torsoD(y: number) {
  const chest = smooth(-0.35, 0.45, y);
  const d = 0.3 + 0.035 * chest;
  const top = lerp(0.335, 0.214, THREE.MathUtils.clamp((y - 0.66) / (NECK - 0.66), 0, 1));
  return lerp(d, top, smooth(0.58, 0.8, y)) * (0.965 + 0.035 * smooth(HEM + 0.1, HEM + 0.16, y));
}
const torsoExp = (y: number) => lerp(2.7, 2.15, smooth(0.6, NECK, y));

function torsoDisp(theta: number, y: number) {
  const c = Math.cos(theta),
    s = Math.sin(theta);
  let d = 0;
  // long vertical drape folds on the lower body
  d += 0.011 * Math.sin(theta * 5 + y * 1.3 + 0.6) * (1 - smooth(0.2, 0.7, y));
  // fabric bunching just above the ribbed hem
  d += 0.013 * Math.sin(y * 34 + 2.2 * Math.sin(theta * 3)) * smooth(HEM + 0.15, HEM + 0.24, y) * (1 - smooth(-0.82, -0.6, y));
  // soft irregularity
  d += 0.012 * (vnoise(theta * 2.2, y * 2.6) - 0.5);
  // hem rib wales
  if (y < HEM + 0.14) d += 0.0045 * Math.sin(theta * 160);
  // keep the zipper placket flat
  if (s > 0) d *= lerp(1, smooth(0.03, 0.18, Math.abs(c)), smooth(-0.05, 0.2, y));
  // pull at the shoulders
  d *= 1 - 0.6 * smooth(0.65, NECK, y);
  return d;
}

function torsoPoint(theta: number, y: number, out = new THREE.Vector3()) {
  const W = torsoW(y),
    D = torsoD(y),
    n = torsoExp(y);
  const c = Math.cos(theta),
    s = Math.sin(theta);
  const x = W * se(c, n),
    z = D * se(s, n);
  const nx = x / (W * W),
    nz = z / (D * D);
  const nl = Math.hypot(nx, nz) || 1;
  const d = torsoDisp(theta, y);
  return out.set(x + (nx / nl) * d, y, z + (nz / nl) * d);
}

/* ---------------- collar (mock neck) ---------------- */
const COLLAR_W = 0.262;
const COLLAR_D = 0.208;
const COLLAR_PROFILE: [number, number][] = [
  [0.022, 0.9],
  [0.022, 0.99],
  [0.026, 1.08],
  [0.034, 1.18],
  [0.03, 1.232],
  [0.014, 1.252],
  [-0.006, 1.25],
  [-0.016, 1.232],
  [-0.02, 1.16],
  [-0.02, 1.02],
];
function collarOuter(y: number) {
  for (let i = 0; i < 5; i++) {
    const [o0, y0] = COLLAR_PROFILE[i];
    const [o1, y1] = COLLAR_PROFILE[i + 1];
    if (y >= y0 && y <= y1) return lerp(o0, o1, (y - y0) / (y1 - y0));
  }
  return 0.022;
}
const ZIP_TOP = 1.232;
const ZIP_BOTTOM = 0.26;
function frontZ(y: number) {
  const collar = COLLAR_D + collarOuter(Math.min(y, ZIP_TOP));
  const torso = torsoD(y);
  return lerp(torso, collar, smooth(0.9, 1.0, y));
}

/* ================================================================== */
/* Geometry builders                                                   */
/* ================================================================== */

function buildGrid(
  cols: number,
  rows: number,
  vert: (i: number, j: number, p: THREE.Vector3) => [number, number],
  closeSeam: boolean,
) {
  const pos = new Float32Array((rows + 1) * (cols + 1) * 3);
  const uv = new Float32Array((rows + 1) * (cols + 1) * 2);
  const p = new THREE.Vector3();
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const k = j * (cols + 1) + i;
      const [u, v] = vert(i, j, p);
      pos.set([p.x, p.y, p.z], k * 3);
      uv.set([u, v], k * 2);
    }
  }
  const idx: number[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i,
        b = a + 1,
        c = a + cols + 1,
        d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  if (closeSeam) {
    const n = g.attributes.normal as THREE.BufferAttribute;
    const t = new THREE.Vector3(),
      t2 = new THREE.Vector3();
    for (let j = 0; j <= rows; j++) {
      const a = j * (cols + 1),
        b = a + cols;
      t.fromBufferAttribute(n, a).add(t2.fromBufferAttribute(n, b)).normalize();
      n.setXYZ(a, t.x, t.y, t.z);
      n.setXYZ(b, t.x, t.y, t.z);
    }
  }
  return g;
}

function makeTorso() {
  const U = 140,
    V = 150;
  return buildGrid(
    U,
    V,
    (i, j, p) => {
      const theta = (i / U) * Math.PI * 2;
      const y = lerp(HEM, NECK, j / V);
      torsoPoint(theta, y, p);
      return [(i / U) * 3.6, y - HEM];
    },
    true,
  );
}

function makeCollar() {
  const U = 110;
  const rows = COLLAR_PROFILE.length - 1;
  const sub = 6;
  const R = rows * sub;
  return buildGrid(
    U,
    R,
    (i, j, p) => {
      const seg = Math.min(rows - 1, Math.floor(j / sub));
      const f = j / sub - seg;
      const [o0, y0] = COLLAR_PROFILE[seg];
      const [o1, y1] = COLLAR_PROFILE[seg + 1];
      const o = lerp(o0, o1, f),
        y = lerp(y0, y1, f);
      const theta = (i / U) * Math.PI * 2 + Math.PI / 2; // seam at the zipper
      const n = 2.25;
      p.set((COLLAR_W + o) * se(Math.cos(theta), n), y, (COLLAR_D + o) * se(Math.sin(theta), n));
      return [(i / U) * 1.7, y - HEM + j * 0.004];
    },
    false,
  );
}

const SLEEVE_PTS = [
  [0.42, 0.6, -0.01],
  [0.74, 0.5, 0.0],
  [0.96, 0.04, 0.04],
  [1.05, -0.52, 0.09],
  [1.08, -0.98, 0.12],
];

function sleeveRadius(t: number) {
  let r = lerp(0.19, 0.142, smooth(0.0, 0.85, t));
  if (t > 0.87) r *= lerp(1, 0.84, smooth(0.87, 0.9, t));
  return r;
}

function makeSleeve(sign: 1 | -1) {
  const curve = new THREE.CatmullRomCurve3(SLEEVE_PTS.map(([x, y, z]) => new THREE.Vector3(x * sign, y, z)));
  const T = 90,
    R = 44;
  const frames = curve.computeFrenetFrames(T, false);
  const len = curve.getLength();
  const tmp = new THREE.Vector3();
  const geo = buildGrid(
    R,
    T,
    (i, j, p) => {
      const t = j / T;
      const phi = (i / R) * Math.PI * 2 * sign;
      const P = curve.getPointAt(t);
      const N = frames.normals[j],
        B = frames.binormals[j];
      let r = sleeveRadius(t);
      // elbow folds + noise + cuff ribs
      r += 0.0055 * Math.sin(t * 38 + Math.cos(phi) * 3 + vnoise(phi, t * 4) * 4) * smooth(0.3, 0.45, t) * (1 - smooth(0.7, 0.84, t));
      r += 0.008 * (vnoise(phi * 1.7 + sign * 9, t * 9) - 0.5);
      if (t > 0.88) r += 0.0035 * Math.sin(phi * 70);
      tmp.copy(N).multiplyScalar(Math.cos(phi) * r).addScaledVector(B, Math.sin(phi) * r * 0.88);
      p.copy(P).add(tmp);
      return [(i / R) * 1.0, t * len];
    },
    true,
  );
  const end = curve.getPointAt(1);
  const tan = curve.getTangentAt(1);
  return { geo, end, tan };
}

/* zipper path running down the centre front */
function makeZipCurve() {
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k <= 24; k++) {
    const y = lerp(ZIP_TOP, ZIP_BOTTOM, k / 24);
    pts.push(new THREE.Vector3(0, y, frontZ(y) + 0.008));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/* ================================================================== */

const TEETH = 150;

export default function Garment() {
  const tapeMat = useRef<THREE.MeshStandardMaterial>(null);
  const teethRef = useRef<THREE.InstancedMesh>(null);
  const slider = useRef<THREE.Group>(null);
  const tab = useRef<THREE.Group>(null);
  const tapeL = useRef<THREE.BufferGeometry>(null);
  const tapeR = useRef<THREE.BufferGeometry>(null);
  const gap = useRef<THREE.BufferGeometry>(null);

  const torso = useMemo(makeTorso, []);
  const collar = useMemo(makeCollar, []);
  const sleeveR = useMemo(() => makeSleeve(1), []);
  const sleeveL = useMemo(() => makeSleeve(-1), []);
  const zip = useMemo(makeZipCurve, []);
  const zipFrames = useMemo(() => {
    const n = 120;
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const p = zip.getPointAt(t);
      const tan = zip.getTangentAt(t);
      const nrm = new THREE.Vector3(0, -tan.z, tan.y).normalize();
      return { t, p, tan, nrm };
    });
  }, [zip]);

  const normals = useMemo(() => {
    const m = {} as Record<FabricKind, THREE.Texture>;
    (["merino", "fleece", "tech", "terry"] as FabricKind[]).forEach((k) => (m[k] = fabricNormalMap(k)));
    return m;
  }, []);
  const label = useMemo(labelTexture, []);
  const fabricMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: COLORS[0].hex,
        roughness: 0.9,
        sheen: 0.9,
        sheenRoughness: 0.55,
        clearcoat: 0,
        clearcoatRoughness: 0.4,
        normalMap: normals.merino,
        normalScale: new THREE.Vector2(0.9, 0.9),
        side: THREE.DoubleSide,
      }),
    [normals],
  );
  const fabric = useRef(fabricMat);

  // label placement on the left chest
  const labelPose = useMemo(() => {
    const theta = Math.PI / 2 - 0.62,
      y = 0.4;
    const p = torsoPoint(theta, y);
    const a = torsoPoint(theta - 0.01, y),
      b = torsoPoint(theta + 0.01, y);
    const tangent = b.sub(a).normalize();
    const normal = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), tangent).normalize();
    if (normal.z < 0) normal.negate();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    p.addScaledVector(normal, 0.012);
    return { p, q };
  }, []);

  useEffect(() => {
    Promise.all([document.fonts?.load('92px "Archivo Black"'), document.fonts?.load('600 30px "Inter Tight Variable"')]).then(() => {
      const fresh = labelTexture();
      label.canvas.getContext("2d")!.drawImage(fresh.canvas, 0, 0);
      label.tex.needsUpdate = true;
      fresh.tex.dispose();
    });
  }, [label]);

  // live targets
  const target = useRef({
    color: new THREE.Color(COLORS[0].hex),
    type: TYPES[0],
  });
  useEffect(() => {
    const apply = () => {
      const s = ui.get();
      target.current.color.set(COLORS[s.color].hex);
      const t = TYPES[s.type];
      target.current.type = t;
      if (fabric.current) {
        fabric.current.normalMap = normals[t.id];
        fabric.current.needsUpdate = true;
      }
    };
    apply();
    return ui.subscribe(apply);
  }, [normals]);

  const white = useMemo(() => new THREE.Color("#efeee9"), []);
  const display = useMemo(() => new THREE.Color(), []);
  const lastZip = useRef(-1);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const basis = useMemo(() => new THREE.Matrix4(), []);
  const X = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const negX = useMemo(() => new THREE.Vector3(-1, 0, 0), []);
  const up = useMemo(() => new THREE.Vector3(), []);

  const frameAt = (t: number) => zipFrames[Math.round(THREE.MathUtils.clamp(t, 0, 1) * (zipFrames.length - 1))];

  const updateZip = (z: number) => {
    const sp = 0.045 + z * 0.88;
    const sep = (t: number) => (t < sp ? Math.pow((sp - t) / Math.max(sp, 1e-3), 0.9) * 0.05 * Math.min(1, z * 4) : 0);

    // teeth
    const m = teethRef.current;
    if (m) {
      for (let k = 0; k < TEETH; k++) {
        const t = (k + 0.5) / TEETH;
        const f = frameAt(t);
        const side = k % 2 ? 1 : -1;
        const x = side * (0.0042 + sep(t));
        basis.makeBasis(X, f.tan, f.nrm);
        dummy.position.copy(f.p).setX(x);
        dummy.quaternion.setFromRotationMatrix(basis);
        dummy.rotation.z += side * sep(t) * 0.6;
        dummy.updateMatrix();
        m.setMatrixAt(k, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }

    // tapes + dark opening
    const write = (geo: THREE.BufferGeometry | null, fn: (f: (typeof zipFrames)[number]) => [number, number, number]) => {
      if (!geo) return;
      const pos = geo.attributes.position as THREE.BufferAttribute;
      zipFrames.forEach((f, i) => {
        const [x0, x1, back] = fn(f);
        pos.setXYZ(i * 2, x0, f.p.y, f.p.z - back);
        pos.setXYZ(i * 2 + 1, x1, f.p.y, f.p.z - back);
      });
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
    };
    write(tapeL.current, (f) => [-0.03 - sep(f.t), -0.001 - sep(f.t), 0.004]);
    write(tapeR.current, (f) => [0.001 + sep(f.t), 0.03 + sep(f.t), 0.004]);
    write(gap.current, (f) => [-sep(f.t) - 0.002, sep(f.t) + 0.002, 0.009]);

    // slider
    if (slider.current) {
      const f = frameAt(sp);
      up.copy(f.tan).negate();
      basis.makeBasis(negX, up, f.nrm);
      slider.current.position.copy(f.p).addScaledVector(f.nrm, 0.012);
      slider.current.quaternion.setFromRotationMatrix(basis);
    }
  };

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const mat = fabric.current;
    if (mat) {
      display.copy(target.current.color).lerp(white, garment.invert);
      mat.color.lerp(display, 1 - Math.pow(0.004, d));
      const t = target.current.type;
      mat.roughness = THREE.MathUtils.damp(mat.roughness, t.roughness, 4, d);
      mat.sheen = THREE.MathUtils.damp(mat.sheen, t.sheen, 4, d);
      mat.clearcoat = THREE.MathUtils.damp(mat.clearcoat, t.clearcoat, 4, d);
      const ns = THREE.MathUtils.damp(mat.normalScale.x, t.normalScale, 4, d);
      mat.normalScale.set(ns, ns);
      mat.normalMap?.repeat.set(t.repeat[0], t.repeat[1]);
      // velvet-like sheen that reads on dark AND light cloth
      const lum = mat.color.r * 0.3 + mat.color.g * 0.59 + mat.color.b * 0.11;
      mat.sheenColor.setScalar(lum < 0.05 ? 0.22 : lum < 0.2 ? 0.4 : 1).lerp(mat.color, 0.3);
    }
    if (tapeMat.current) {
      tapeMat.current.color.copy(fabric.current?.color ?? display).multiplyScalar(0.55);
    }

    if (Math.abs(garment.zip - lastZip.current) > 0.0005) {
      lastZip.current = garment.zip;
      updateZip(garment.zip);
    }

    // pull tab swing
    if (tab.current) {
      const t = state.clock.elapsedTime;
      tab.current.rotation.x = 0.18 + Math.sin(t * 1.8) * 0.06;
      tab.current.rotation.z = Math.sin(t * 1.3) * 0.05;
    }
  });

  const ribbonGeo = (ref: React.RefObject<THREE.BufferGeometry | null>) => (
    <bufferGeometry ref={ref}>
      <bufferAttribute attach="attributes-position" args={[new Float32Array(zipFrames.length * 6), 3]} />
      <bufferAttribute
        attach="index"
        args={[
          new Uint16Array(
            Array.from({ length: zipFrames.length - 1 }, (_, i) => {
              const a = i * 2;
              return [a, a + 2, a + 1, a + 1, a + 2, a + 3];
            }).flat(),
          ),
          1,
        ]}
      />
    </bufferGeometry>
  );

  return (
    <group position={[0, 0.02, 0]}>
      <mesh geometry={torso} material={fabricMat} />
      <mesh geometry={collar} material={fabricMat} />
      <mesh geometry={sleeveR.geo} material={fabricMat} />
      <mesh geometry={sleeveL.geo} material={fabricMat} />

      {/* dark interiors so openings never read as hollow */}
      <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[COLLAR_W * 0.95, COLLAR_D * 0.95, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      {[sleeveR, sleeveL].map((s, i) => (
        <mesh
          key={i}
          position={s.end.clone().addScaledVector(s.tan, -0.006)}
          quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), s.tan)}
          scale={[0.118, 0.105, 1]}
        >
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* chest label */}
      <mesh position={labelPose.p} quaternion={labelPose.q}>
        <planeGeometry args={[0.15, 0.058]} />
        <meshStandardMaterial map={label.tex} roughness={0.75} />
      </mesh>

      {/* zipper: opening, tapes, teeth, slider & pull */}
      <mesh>
        {ribbonGeo(gap)}
        <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        {ribbonGeo(tapeL)}
        <meshStandardMaterial ref={tapeMat} color="#111" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        {ribbonGeo(tapeR)}
        <meshStandardMaterial color="#111" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={teethRef} args={[undefined, undefined, TEETH]} frustumCulled={false}>
        <boxGeometry args={[0.018, 0.0058, 0.009]} />
        <meshStandardMaterial color="#cfcfcb" metalness={1} roughness={0.32} envMapIntensity={1.3} />
      </instancedMesh>
      <group ref={slider}>
        <RoundedBox args={[0.046, 0.06, 0.022]} radius={0.008} smoothness={3}>
          <meshStandardMaterial color="#e2e2df" metalness={1} roughness={0.16} envMapIntensity={1.8} />
        </RoundedBox>
        <group ref={tab} position={[0, -0.012, 0.016]}>
          <RoundedBox args={[0.036, 0.1, 0.007]} radius={0.003} smoothness={3} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#ececea" metalness={1} roughness={0.12} envMapIntensity={2} />
          </RoundedBox>
          <mesh position={[0, -0.072, 0.0037]}>
            <planeGeometry args={[0.014, 0.036]} />
            <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

