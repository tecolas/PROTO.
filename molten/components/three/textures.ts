import type { Flavor } from "@/lib/flavors";

const DISPLAY = '"Anton", "Impact", sans-serif';
const BODY = '"Inter Tight Variable", "Inter Tight", system-ui, sans-serif';
const SERIF = '"Instrument Serif", Georgia, serif';

/** Deterministic PRNG so textures look identical across renders */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function paperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, seed = 7, alpha = 0.06) {
  const r = rng(seed);
  for (let i = 0; i < (w * h) / 90; i++) {
    const v = r() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${r() * alpha})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 1.5, 1 + r() * 1.5);
  }
}

function chili(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.5);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.bezierCurveTo(s * 0.55, -s * 0.45, s * 0.5, s * 0.4, 0, s * 1.1);
  ctx.bezierCurveTo(-s * 0.25, s * 0.4, -s * 0.45, -s * 0.4, 0, -s * 0.5);
  ctx.fill();
  ctx.fillRect(-s * 0.08, -s * 0.85, s * 0.16, s * 0.4);
  ctx.restore();
}

/**
 * Wrap-around label. Canvas spans 270° of the jar, so the visual "front"
 * is the centre ~45% of the width.
 */
export function drawLabel(canvas: HTMLCanvasElement, f: Flavor, index: number) {
  const W = (canvas.width = 2048);
  const H = (canvas.height = 600);
  const ctx = canvas.getContext("2d")!;
  const cx = W / 2;

  // Base: deep warm black paper
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#14100e");
  bg.addColorStop(1, "#0b0908");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  paperGrain(ctx, W, H, 11 + index, 0.08);

  // Accent rails
  ctx.fillStyle = f.accent;
  ctx.fillRect(0, 22, W, 10);
  ctx.fillRect(0, H - 32, W, 10);
  ctx.globalAlpha = 0.35;
  ctx.fillRect(0, 42, W, 2);
  ctx.fillRect(0, H - 44, W, 2);
  ctx.globalAlpha = 1;

  // ---------- FRONT PANEL ----------
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#f6ede3";
  ctx.font = `600 22px ${BODY}`;
  ctx.letterSpacing = "10px";
  ctx.fillText("SMALL BATCH  ·  EST. 2019  ·  HOT SAUCE", cx, 98);

  // Big brand mark
  ctx.letterSpacing = "6px";
  ctx.font = `200px ${DISPLAY}`;
  ctx.fillStyle = f.accent;
  ctx.fillText("MOLTEN", cx, 300);

  // flavour name
  ctx.letterSpacing = "0px";
  ctx.font = `italic 64px ${SERIF}`;
  ctx.fillStyle = "#f6ede3";
  ctx.fillText(f.name, cx, 392);

  // heat meter
  const heatW = 5 * 46;
  for (let i = 0; i < 5; i++) {
    chili(ctx, cx - heatW / 2 + 23 + i * 46, 440, 26, i < f.heat ? f.accent : "rgba(246,237,227,0.18)");
  }

  ctx.font = `600 20px ${BODY}`;
  ctx.letterSpacing = "6px";
  ctx.fillStyle = "rgba(246,237,227,0.7)";
  ctx.fillText(`NET WT 8 FL OZ (237 mL)  ·  ${f.scoville}`, cx, 530);

  // Divider lines framing front
  ctx.strokeStyle = "rgba(246,237,227,0.25)";
  ctx.lineWidth = 2;
  [cx - 520, cx + 520].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 80);
    ctx.lineTo(x, H - 80);
    ctx.stroke();
  });

  // ---------- LEFT SIDE PANEL : ingredients ----------
  ctx.textAlign = "left";
  ctx.letterSpacing = "4px";
  ctx.fillStyle = f.accent;
  ctx.font = `26px ${DISPLAY}`;
  ctx.fillText("INGREDIENTS", 140, 130);
  ctx.letterSpacing = "1px";
  ctx.fillStyle = "rgba(246,237,227,0.75)";
  ctx.font = `500 21px ${BODY}`;
  const ing = [...f.notes, "Filtered water", "Sea salt", "Nothing else."];
  ing.forEach((t, i) => ctx.fillText(t.toUpperCase(), 140, 180 + i * 34));
  ctx.font = `italic 30px ${SERIF}`;
  ctx.fillStyle = "#f6ede3";
  ctx.fillText("“" + f.tagline + "”", 140, 470);

  // ---------- RIGHT SIDE PANEL : barcode ----------
  const bx = W - 420;
  const r = rng(99 + index);
  ctx.fillStyle = "#f6ede3";
  ctx.fillRect(bx - 20, 140, 300, 190);
  ctx.fillStyle = "#0b0908";
  let x = bx;
  while (x < bx + 260) {
    const w = 2 + Math.floor(r() * 5);
    if (r() > 0.4) ctx.fillRect(x, 160, w, 130);
    x += w + 2;
  }
  ctx.font = `600 18px ${BODY}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("0 84219 0" + (index + 1) + "77 3", bx + 4, 316);

  ctx.fillStyle = "rgba(246,237,227,0.7)";
  ctx.font = `500 18px ${BODY}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("REFRIGERATE AFTER OPENING", bx - 20, 390);
  ctx.fillText("SHAKE LIKE YOU MEAN IT", bx - 20, 422);
  ctx.fillStyle = f.accent;
  ctx.font = `28px ${DISPLAY}`;
  ctx.fillText(`Nº ${String(index + 1).padStart(2, "0")}`, bx - 20, 480);
}

export function drawLidTop(canvas: HTMLCanvasElement, accent: string) {
  const S = (canvas.width = canvas.height = 512);
  const ctx = canvas.getContext("2d")!;
  const c = S / 2;
  const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 10, c, c, c);
  g.addColorStop(0, "#2a2420");
  g.addColorStop(1, "#0c0a09");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  paperGrain(ctx, S, S, 3, 0.05);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(c, c, c - 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(c, c, c - 58, 0, Math.PI * 2);
  ctx.stroke();

  // circular text
  ctx.fillStyle = "#f6ede3";
  ctx.font = `600 22px ${BODY}`;
  const text = "MOLTEN SAUCE CO · SLOW FIRE · SMALL BATCH · ";
  const radius = c - 92;
  for (let i = 0; i < text.length; i++) {
    const a = (i / text.length) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.translate(c + Math.cos(a) * radius, c + Math.sin(a) * radius);
    ctx.rotate(a + Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }

  ctx.fillStyle = accent;
  ctx.font = `180px ${DISPLAY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", c, c + 10);
}
