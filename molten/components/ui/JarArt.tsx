import { useId } from "react";

/** Stylised studio-lit SVG jar used in product cards & cart. */
export default function JarArt({
  sauce,
  accent,
  name,
  className = "",
}: {
  sauce: string;
  accent: string;
  name: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 270" className={className} role="img" aria-label={`${name} jar`}>
      <defs>
        <linearGradient id={`glass${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`sauce${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={sauce} stopOpacity="0.75" />
          <stop offset="0.35" stopColor={sauce} />
          <stop offset="0.7" stopColor={sauce} />
          <stop offset="1" stopColor="#000" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`lid${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#3a3330" />
          <stop offset="0.25" stopColor="#0d0b0a" />
          <stop offset="0.55" stopColor="#2b2522" />
          <stop offset="1" stopColor="#070606" />
        </linearGradient>
        <linearGradient id={`label${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.3" stopColor="#1a1512" />
          <stop offset="0.7" stopColor="#14110f" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id={`shadow${id}`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <pattern id={`ridge${id}`} width="4" height="10" patternUnits="userSpaceOnUse">
          <rect width="2" height="10" fill="#fff" fillOpacity="0.07" />
        </pattern>
      </defs>

      <ellipse cx="100" cy="258" rx="78" ry="9" fill={`url(#shadow${id})`} />

      {/* sauce */}
      <path d="M32 96 Q32 86 40 84 H160 Q168 86 168 96 V236 Q168 250 152 252 H48 Q32 250 32 236Z" fill={`url(#sauce${id})`} />
      {/* specks */}
      {[
        [48, 112], [150, 120], [62, 230], [140, 238], [56, 176], [146, 196], [92, 240], [118, 104], [44, 214], [156, 152],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={i % 2 ? 2.4 : 1.6} ry="1" fill={i % 3 ? "#2a0702" : "#f2c37a"} opacity="0.75" transform={`rotate(${i * 37} ${x} ${y})`} />
      ))}

      {/* glass body */}
      <path
        d="M28 92 Q28 70 52 62 L56 54 H144 L148 62 Q172 70 172 92 V238 Q172 256 150 258 H50 Q28 256 28 238Z"
        fill={`url(#glass${id})`}
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="1.2"
      />
      <rect x="38" y="80" width="6" height="160" rx="3" fill="#fff" opacity="0.35" />
      <rect x="156" y="90" width="3" height="140" rx="1.5" fill="#fff" opacity="0.18" />

      {/* label */}
      <path d="M28 128 H172 V208 H28Z" fill={`url(#label${id})`} />
      <rect x="28" y="131" width="144" height="2.5" fill={accent} />
      <rect x="28" y="202.5" width="144" height="2.5" fill={accent} />
      <text x="100" y="172" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="30" fill={accent} letterSpacing="1">
        MOLTEN
      </text>
      <text x="100" y="191" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontStyle="italic" fontSize="13" fill="#f6ede3">
        {name}
      </text>
      <text x="100" y="146" textAnchor="middle" fontFamily="Inter Tight Variable, sans-serif" fontSize="5.5" letterSpacing="2.5" fill="#f6ede3" opacity="0.7">
        SMALL BATCH · HOT SAUCE
      </text>

      {/* lid */}
      <path d="M46 24 Q46 16 54 16 H146 Q154 16 154 24 V54 H46Z" fill={`url(#lid${id})`} />
      <rect x="46" y="20" width="108" height="34" fill={`url(#ridge${id})`} />
      <rect x="46" y="16" width="108" height="3" rx="1.5" fill="#fff" opacity="0.12" />
      <rect x="44" y="50" width="112" height="5" rx="2" fill="#050404" />
    </svg>
  );
}
