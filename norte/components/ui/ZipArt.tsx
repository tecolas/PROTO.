import { useId } from "react";
import type { FabricKind } from "@/lib/catalog";

/** Flat-lay SVG quarter zip, tinted per colour with a fabric texture hint. */
export default function ZipArt({
  hex,
  kind = "merino",
  className = "",
  title = "Quarter zip",
}: {
  hex: string;
  kind?: FabricKind;
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  const light = lum > 140;
  const line = light ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.14)";
  const shade = light ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.45)";

  const pattern =
    kind === "merino" ? (
      <pattern id={`p${id}`} width="5" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 0l2.5 4L5 0" fill="none" stroke={line} strokeWidth="0.7" />
      </pattern>
    ) : kind === "tech" ? (
      <pattern id={`p${id}`} width="9" height="9" patternUnits="userSpaceOnUse">
        <path d="M0 0H9V9" fill="none" stroke={line} strokeWidth="0.6" />
      </pattern>
    ) : kind === "terry" ? (
      <pattern id={`p${id}`} width="3" height="3" patternUnits="userSpaceOnUse">
        <path d="M1.5 0V3" stroke={line} strokeWidth="0.6" />
      </pattern>
    ) : (
      <pattern id={`p${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="2" r="0.9" fill={line} />
        <circle cx="4.5" cy="4.6" r="0.8" fill={line} />
      </pattern>
    );

  const body =
    "M70 52 L88 40 Q100 36 112 40 L130 52 L162 62 Q176 68 180 84 L196 214 Q197 222 189 223 L172 225 Q165 226 164 219 L150 118 L150 238 Q150 246 142 246 L58 246 Q50 246 50 238 L50 118 L36 219 Q35 226 28 225 L11 223 Q3 222 4 214 L20 84 Q24 68 38 62Z";

  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={title}>
      <defs>
        {pattern}
        <linearGradient id={`g${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity={light ? 0.15 : 0.06} />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id={`s${id}`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="252" rx="78" ry="6" fill={`url(#s${id})`} />
      <path d={body} fill={hex} />
      <path d={body} fill={`url(#p${id})`} />
      <path d={body} fill={`url(#g${id})`} />
      {/* sleeve seams + folds */}
      <path d="M50 118 L50 70 M150 118 L150 70" stroke={shade} strokeWidth="1.2" fill="none" />
      <path d="M26 150 Q32 156 40 150 M164 158 Q170 164 176 158 M70 200 Q100 206 130 198" stroke={shade} strokeWidth="1.4" fill="none" />
      {/* ribbed hem + cuffs */}
      <rect x="50" y="232" width="100" height="14" rx="3" fill={shade} />
      <path d="M8 206 L30 209 M170 209 L192 206" stroke={shade} strokeWidth="9" />
      {/* collar */}
      <path d="M80 44 L80 22 Q100 17 120 22 L120 44 Q100 50 80 44Z" fill={hex} />
      <path d="M80 44 L80 22 Q100 17 120 22 L120 44 Q100 50 80 44Z" fill={`url(#g${id})`} />
      <path d="M80 22 Q100 17 120 22" stroke={light ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)"} strokeWidth="1.2" fill="none" />
      {/* zipper */}
      <line x1="100" y1="19" x2="100" y2="112" stroke="#111" strokeWidth="4.5" />
      <line x1="100" y1="19" x2="100" y2="112" stroke="#d8d8d4" strokeWidth="2" strokeDasharray="1.4 1.4" />
      <rect x="96.5" y="23" width="7" height="9" rx="1.5" fill="#e6e6e2" />
      <rect x="98" y="31" width="4" height="13" rx="1.5" fill="#cfcfcb" />
      {/* chest label */}
      <rect x="122" y="88" width="17" height="7" rx="1" fill="#0d0d0d" />
      <rect x="125" y="90.6" width="11" height="1.8" fill="#eee" />
    </svg>
  );
}
