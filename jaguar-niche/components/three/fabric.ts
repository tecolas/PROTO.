import * as THREE from "three";
import type { FabricKind } from "@/lib/catalog";

/* ------------------------------------------------------------------ */
/* Tileable procedural height fields for each fabric                    */
/* ------------------------------------------------------------------ */

const SIZE = 256;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Periodic value noise so textures tile seamlessly */
function makeNoise(period: number, seed: number) {
  const r = rng(seed);
  const grid = new Float32Array(period * period).map(() => r());
  const at = (x: number, y: number) => grid[(((y % period) + period) % period) * period + (((x % period) + period) % period)];
  return (x: number, y: number) => {
    const xi = Math.floor(x),
      yi = Math.floor(y);
    const xf = x - xi,
      yf = y - yi;
    const u = xf * xf * (3 - 2 * xf),
      v = yf * yf * (3 - 2 * yf);
    const a = at(xi, yi),
      b = at(xi + 1, yi),
      c = at(xi, yi + 1),
      d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function fbm(px: number, py: number, octaves: number[], seed: number) {
  // octaves = periods (must divide SIZE evenly for tiling)
  let v = 0,
    amp = 0.5,
    tot = 0;
  octaves.forEach((p, i) => {
    const n = noiseCache(p, seed + i);
    v += amp * n((px / SIZE) * p, (py / SIZE) * p);
    tot += amp;
    amp *= 0.55;
  });
  return v / tot;
}

const cache = new Map<string, (x: number, y: number) => number>();
function noiseCache(p: number, seed: number) {
  const k = `${p}:${seed}`;
  let n = cache.get(k);
  if (!n) {
    n = makeNoise(p, seed);
    cache.set(k, n);
  }
  return n;
}

function heightField(kind: FabricKind): Float32Array {
  const h = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let v = 0;
      if (kind === "merino") {
        // jersey knit: columns of interlocking "V" loops
        const cw = 16,
          ch = 16;
        const u = (x % cw) / cw;
        const w = ((y + (Math.floor(x / cw) % 2) * 0) % ch) / ch;
        const leg = (cx: number, ang: number) => {
          const dx = u - cx,
            dy = w - 0.5;
          const c = Math.cos(ang),
            s = Math.sin(ang);
          const rx = dx * c - dy * s,
            ry = dx * s + dy * c;
          const e = 1 - (rx / 0.2) ** 2 - (ry / 0.56) ** 2;
          return e > 0 ? Math.sqrt(e) : 0;
        };
        v = Math.max(leg(0.29, 0.45), leg(0.71, -0.45));
        v = v * 0.85 + fbm(x, y, [64, 128], 3) * 0.15;
      } else if (kind === "fleece") {
        // clumpy pile + fine fibre speckle
        const clump = fbm(x, y, [16, 32, 64], 11);
        const fine = fbm(x, y, [128, 256], 17);
        v = Math.pow(clump, 1.6) * 0.75 + fine * 0.35;
      } else if (kind === "tech") {
        // ripstop: fine plain weave with a raised grid every 32px
        const weave = (Math.sin((x * Math.PI) / 2) * Math.sin((y * Math.PI) / 2) + 1) * 0.5;
        const gx = Math.min(x % 32, 32 - (x % 32));
        const gy = Math.min(y % 32, 32 - (y % 32));
        const grid = Math.max(Math.exp(-gx * gx * 0.6), Math.exp(-gy * gy * 0.6));
        v = weave * 0.25 + grid * 0.6 + fbm(x, y, [32, 64], 23) * 0.15;
      } else {
        // heavy terry / sweatshirt: tight vertical wales + diagonal twill
        const wale = (Math.sin((x * Math.PI * 2) / 8) + 1) * 0.5;
        const twill = (Math.sin(((x + y) * Math.PI * 2) / 16) + 1) * 0.5;
        v = wale * 0.55 + twill * 0.25 + fbm(x, y, [64, 128], 31) * 0.2;
      }
      h[y * SIZE + x] = v;
    }
  }
  return h;
}

function toNormalData(h: Float32Array, strength: number) {
  const data = new Uint8Array(SIZE * SIZE * 4);
  const at = (x: number, y: number) => h[((y + SIZE) % SIZE) * SIZE + ((x + SIZE) % SIZE)];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * SIZE + x) * 4;
      data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  return data;
}

const heights = new Map<FabricKind, Float32Array>();
const getHeight = (k: FabricKind) => {
  let h = heights.get(k);
  if (!h) {
    h = heightField(k);
    heights.set(k, h);
  }
  return h;
};

const STRENGTH: Record<FabricKind, number> = { merino: 3, fleece: 6, tech: 2.2, terry: 2.5 };

export function fabricNormalMap(kind: FabricKind) {
  const tex = new THREE.DataTexture(toNormalData(getHeight(kind), STRENGTH[kind]), SIZE, SIZE, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Lit, greyscale macro swatch as a data URL (used by the DOM material cards). */
export function fabricPreview(kind: FabricKind, tone = 0.12, tiles = 2): string {
  const h = getHeight(kind);
  const S = SIZE * tiles;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(S, S);
  const at = (x: number, y: number) => h[(((y % SIZE) + SIZE) % SIZE) * SIZE + (((x % SIZE) + SIZE) % SIZE)];
  const L = new THREE.Vector3(-0.5, 0.6, 0.65).normalize();
  const st = STRENGTH[kind] * 1.3;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * st;
      const dy = (at(x, y + 1) - at(x, y - 1)) * st;
      const len = Math.hypot(dx, dy, 1);
      const ndl = Math.max(0, (-dx * L.x + -dy * L.y + L.z) / len);
      const ao = 0.55 + 0.45 * at(x, y);
      const v = Math.min(255, (tone + ndl * 0.75 * ao) * 255);
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

/* ------------------------------------------------------------------ */
/* Woven chest label                                                    */
/* ------------------------------------------------------------------ */
export function labelTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 200;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, 512, 200);
  // woven texture
  for (let y = 0; y < 200; y += 3) {
    ctx.fillStyle = `rgba(255,255,255,${0.03 + (y % 6 === 0 ? 0.03 : 0)})`;
    ctx.fillRect(0, y, 512, 1);
  }
  ctx.strokeStyle = "rgba(240,240,236,0.6)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 7]);
  ctx.strokeRect(14, 14, 484, 172);
  ctx.setLineDash([]);
  ctx.fillStyle = "#f0efea";
  ctx.font = '120px "Archivo Black", "Arial Black", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NORTE", 256, 108);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { tex, canvas: c };
}
