"use client";

import { useSyncExternalStore } from "react";
import { COLORS, TYPES } from "./catalog";

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (next: Partial<T> | ((s: T) => Partial<T>)) => {
      const patch = typeof next === "function" ? next(state) : next;
      state = { ...state, ...patch };
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

function useStore<T, S>(store: ReturnType<typeof createStore<T>>, selector: (s: T) => S) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get()),
  );
}

/* ------------------------------------------------------------------ */
/* Garment choreography – mutated by GSAP, read every frame by R3F     */
/* ------------------------------------------------------------------ */
export const garment = {
  /** -1 left slot, 0 centre, 1 right slot */
  side: 0,
  /** vertical offset in viewport heights */
  lift: 0,
  scale: 1,
  /** extra scroll-driven spin (radians) */
  spin: 0,
  /** 0 = zipped to the top, 1 = pulled all the way down */
  zip: 0,
  /** 0 = full garment, 1 = close-up on the collar & zipper */
  zoom: 0,
  /** 0 = light backdrop, 1 = dark backdrop (drives steam/particle tint) */
  dark: 0,
  /** 0 = chosen colour, 1 = forced contrast colour (white on dark scenes) */
  invert: 0,
  /** particle spread multiplier */
  spread: 1,
  visible: 1,
};

/* ------------------------------------------------------------------ */
type UIState = {
  type: number;
  color: number;
  loaded: boolean;
  introDone: boolean;
  sceneActive: boolean;
  /** true while the Colours section owns the backdrop */
  colorsActive: boolean;
  /** size-guide modal */
  sizesOpen: boolean;
};

export const ui = createStore<UIState>({ type: 0, color: 0, loaded: false, introDone: false, sceneActive: true, colorsActive: false, sizesOpen: false });
export const openSizes = (open = true) => ui.set({ sizesOpen: open });
export const useUI = <S,>(sel: (s: UIState) => S) => useStore(ui, sel);

export const setType = (i: number) => {
  const n = ((i % TYPES.length) + TYPES.length) % TYPES.length;
  if (ui.get().type !== n) ui.set({ type: n });
};
export const setColor = (i: number) => {
  const n = ((i % COLORS.length) + COLORS.length) % COLORS.length;
  if (ui.get().color !== n) ui.set({ color: n });
};

/* ------------------------------------------------------------------ */
export type CartItem = { key: string; name: string; detail: string; price: number; qty: number; hex: string };
type CartState = { items: CartItem[]; open: boolean; bump: number };

export const cart = createStore<CartState>({ items: [], open: false, bump: 0 });
export const useCart = <S,>(sel: (s: CartState) => S) => useStore(cart, sel);

export const addToCart = (item: Omit<CartItem, "qty">, qty = 1) =>
  cart.set((s) => {
    const found = s.items.find((i) => i.key === item.key);
    const items = found
      ? s.items.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i))
      : [...s.items, { ...item, qty }];
    return { items, bump: s.bump + 1 };
  });

export const setQty = (key: string, qty: number) =>
  cart.set((s) => ({
    items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty } : i)),
  }));

export const toggleCart = (open?: boolean) => cart.set((s) => ({ open: open ?? !s.open }));
