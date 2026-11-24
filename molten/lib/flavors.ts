export type Flavor = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  heat: number; // 1-5
  sauce: string; // liquid colour inside the jar
  accent: string; // UI accent for this flavour
  notes: string[];
  pairs: string[];
  description: string;
  price: number;
  scoville: string;
};

export const FLAVORS: Flavor[] = [
  {
    id: "ember",
    name: "Ember Original",
    short: "Ember",
    tagline: "The one that started the fire.",
    heat: 3,
    sauce: "#e2400c",
    accent: "#ff5b0b",
    notes: ["Smoked habanero", "Roasted garlic", "Cider vinegar"],
    pairs: ["Tacos", "Eggs", "Fried chicken"],
    description:
      "Oak-smoked habaneros blistered over open flame, folded into slow-roasted garlic and a bright cider finish.",
    price: 14,
    scoville: "45,000 SHU",
  },
  {
    id: "black-gold",
    name: "Black Gold",
    short: "Black Gold",
    tagline: "Dark, deep, dangerously smooth.",
    heat: 2,
    sauce: "#3a160a",
    accent: "#ffb23e",
    notes: ["Black garlic", "Ancho chile", "Blackstrap molasses"],
    pairs: ["Ribs", "Ramen", "Burgers"],
    description:
      "Ninety-day fermented black garlic meets raisin-sweet ancho and a whisper of molasses. Umami in a jar.",
    price: 16,
    scoville: "8,000 SHU",
  },
  {
    id: "mango-inferno",
    name: "Mango Inferno",
    short: "Mango",
    tagline: "Tropical first. Then the storm.",
    heat: 4,
    sauce: "#f2900f",
    accent: "#ffa21f",
    notes: ["Alphonso mango", "Scotch bonnet", "Key lime"],
    pairs: ["Fish", "Wings", "Grilled pineapple"],
    description:
      "Sun-ripe mango and fruity scotch bonnets, sharpened with key lime and toasted allspice. Sweet heat with teeth.",
    price: 15,
    scoville: "120,000 SHU",
  },
  {
    id: "reaper",
    name: "Reaper's Reserve",
    short: "Reserve",
    tagline: "Numbered bottles. Signed waivers.",
    heat: 5,
    sauce: "#9c120a",
    accent: "#ff3b1a",
    notes: ["Carolina reaper", "Smoked sea salt", "Charred onion"],
    pairs: ["Chili", "Brave friends", "Regret"],
    description:
      "Small-run reaper mash aged in charred oak, cut with smoked sea salt and blackened onion. Not a dare. A ritual.",
    price: 22,
    scoville: "1,200,000 SHU",
  },
];
