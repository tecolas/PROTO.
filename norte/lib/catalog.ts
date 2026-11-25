export type FabricKind = "fleece" | "merino" | "tech" | "terry";

export type ZipType = {
  id: FabricKind;
  name: string;
  short: string;
  tagline: string;
  description: string;
  weight: string;
  feel: string;
  climate: string;
  price: number;
  specs: [string, string][];
  /* rendering */
  roughness: number;
  sheen: number;
  clearcoat: number;
  normalScale: number;
  /** texture tiles per world unit */
  repeat: [number, number];
};

export const TYPES: ZipType[] = [
  {
    id: "merino",
    name: "Merino Tricô",
    short: "Merino",
    tagline: "Quente no frio. Fresco no resto.",
    description:
      "Tricô de lã merino 18,5 µm com ponto jersey fechado. Regula a temperatura, não guarda odor e fica melhor a cada lavagem.",
    weight: "320 g/m²",
    feel: "Macio, seco",
    climate: "−5° a 18°C",
    price: 649,
    specs: [
      ["Fibra", "100% merino"],
      ["Micragem", "18,5 µm"],
      ["Ponto", "Jersey 12GG"],
    ],
    roughness: 0.9,
    sheen: 0.9,
    clearcoat: 0,
    normalScale: 0.9,
    repeat: [3, 3.4],
  },
  {
    id: "fleece",
    name: "Polar Fleece",
    short: "Fleece",
    tagline: "Um abraço com zíper.",
    description:
      "Fleece de felpa alta feito com garrafas recicladas. Prende o ar, seca rápido e pesa quase nada na mochila.",
    weight: "280 g/m²",
    feel: "Felpudo, leve",
    climate: "−10° a 12°C",
    price: 459,
    specs: [
      ["Fibra", "100% poliéster reciclado"],
      ["Felpa", "Dupla face"],
      ["Garrafas", "32 por peça"],
    ],
    roughness: 1,
    sheen: 1,
    clearcoat: 0,
    normalScale: 1.4,
    repeat: [1.6, 1.6],
  },
  {
    id: "tech",
    name: "Tech Shell",
    short: "Tech",
    tagline: "Chuva fina não é desculpa.",
    description:
      "Tecido ripstop com acabamento repelente sem PFC e interior escovado. Corta vento, respira e dobra no próprio bolso.",
    weight: "190 g/m²",
    feel: "Liso, técnico",
    climate: "0° a 22°C",
    price: 729,
    specs: [
      ["Fibra", "Nylon 6.6 ripstop"],
      ["Coluna d'água", "10.000 mm"],
      ["Respirabilidade", "15.000 g/m²"],
    ],
    roughness: 0.42,
    sheen: 0.2,
    clearcoat: 0.55,
    normalScale: 0.35,
    repeat: [4.5, 4.5],
  },
  {
    id: "terry",
    name: "Moletom Pesado",
    short: "Moletom",
    tagline: "Peso de verdade. Caimento de verdade.",
    description:
      "Moletom felpado de algodão orgânico 480 g/m², pré-encolhido e lavado à pedra. Estrutura que segura a forma por anos.",
    weight: "480 g/m²",
    feel: "Denso, encorpado",
    climate: "5° a 20°C",
    price: 549,
    specs: [
      ["Fibra", "100% algodão orgânico"],
      ["Interior", "Felpado"],
      ["Lavagem", "Stone wash"],
    ],
    roughness: 0.95,
    sheen: 0.6,
    clearcoat: 0,
    normalScale: 0.7,
    repeat: [2.4, 2.4],
  },
];

export type ZipColor = { id: string; name: string; hex: string; code: string };

export const COLORS: ZipColor[] = [
  { id: "preto", name: "Preto Absoluto", hex: "#141414", code: "N-01" },
  { id: "branco", name: "Branco Gelo", hex: "#ecebe6", code: "N-02" },
  { id: "grafite", name: "Grafite", hex: "#3d3e40", code: "N-03" },
  { id: "mescla", name: "Cinza Mescla", hex: "#9a9a97", code: "N-04" },
  { id: "osso", name: "Osso", hex: "#d6d0c4", code: "N-05" },
];

export const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140;
};

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
