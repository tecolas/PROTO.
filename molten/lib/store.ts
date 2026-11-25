"use client";

import { useSyncExternalStore } from "react";
import { FLAVORS } from "./flavors";

/* ------------------------------------------------------------------ */
/* Tiny external store (no extra deps)                                 */
/* ------------------------------------------------------------------ */
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
/* Jar choreography – mutated directly by GSAP, read every frame by R3F */
/* ------------------------------------------------------------------ */
export const jar = {
  /** -1 = left slot, 0 = centre, 1 = right slot */
  side: 0,
  /** extra vertical offset in viewport heights (used when scrolling away) */
  lift: 0,
  scale: 1,
  /** extra scroll-driven spin in radians */
  spin: 0,
  /** 1 = lid floating open, 0 = sealed */
  lid: 1,
  /** steam intensity */
  steam: 1,
  /** spice particle spread multiplier */
  spread: 1,
  /** global visibility 0..1 */
  visible: 1,
};

/* ------------------------------------------------------------------ */
/* UI state                                                            */
/* ------------------------------------------------------------------ */
type UIState = {
  flavor: number;
  loaded: boolean;
  introDone: boolean;
  sceneActive: boolean;
};

export const ui = createStore<UIState>({ flavor: 0, loaded: false, introDone: false, sceneActive: true });
export const useUI = <S,>(sel: (s: UIState) => S) => useStore(ui, sel);

export const setFlavor = (i: number) => {
  const n = ((i % FLAVORS.length) + FLAVORS.length) % FLAVORS.length;
  if (ui.get().flavor !== n) ui.set({ flavor: n });
};

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */
export type CartItem = { id: string; name: string; price: number; qty: number; color: string };
type CartState = { items: CartItem[]; open: boolean; bump: number };

export const cart = createStore<CartState>({ items: [], open: false, bump: 0 });
export const useCart = <S,>(sel: (s: CartState) => S) => useStore(cart, sel);

export const addToCart = (item: Omit<CartItem, "qty">, qty = 1) =>
  cart.set((s) => {
    const found = s.items.find((i) => i.id === item.id);
    const items = found
      ? s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
      : [...s.items, { ...item, qty }];
    return { items, bump: s.bump + 1 };
  });

export const setQty = (id: string, qty: number) =>
  cart.set((s) => ({
    items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
  }));

export const toggleCart = (open?: boolean) => cart.set((s) => ({ open: open ?? !s.open }));
