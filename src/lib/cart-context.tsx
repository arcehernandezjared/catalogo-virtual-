"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CatalogProduct } from "@/lib/types";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

export type FlyingItem = {
  id: string;
  imageUrl: string | null;
  startRect: DOMRect;
  dx: number;
  dy: number;
  /** Whether the cart was empty right before this item was added — used to
   * decide whether the cart icon should play its empty→full transition. */
  wasEmpty: boolean;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  lastAdded: string | null;
  flyingItems: FlyingItem[];
  openCart: () => void;
  closeCart: () => void;
  /** Returns true if the cart was empty before this call (i.e. this is the first item). */
  addItem: (product: CatalogProduct, quantity?: number) => boolean;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  registerCartButton: (el: HTMLElement | null) => void;
  /** `source` can be a real element (its position/size is used as the start
   * point) or a plain rect — e.g. a synthetic rect centered on the viewport,
   * used when the add-to-cart action happens from a centered modal. */
  flyToCart: (
    imageUrl: string | null,
    source: HTMLElement | DOMRect | null,
    wasEmpty: boolean
  ) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "catalogo-cart-v1";

/** A square rect centered on the current viewport — used as the flight's
 * starting point when adding to cart from a centered modal, so the animation
 * originates from the middle of the screen rather than off to one side. */
export function getViewportCenterRect(size = 140): DOMRect {
  const half = size / 2;
  return new DOMRect(window.innerWidth / 2 - half, window.innerHeight / 2 - half, size, size);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartButtonElRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    // One-time hydration from localStorage after mount. This can't be done in
    // the useState initializer because localStorage isn't available during
    // SSR, and the initial render must match the server output exactly to
    // avoid a hydration mismatch.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: CatalogProduct, quantity = 1) => {
    const wasEmpty = itemsRef.current.length === 0;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        },
      ];
    });
    setLastAdded(product.id);
    window.setTimeout(() => setLastAdded((current) => (current === product.id ? null : current)), 900);

    return wasEmpty;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const registerCartButton = useCallback((el: HTMLElement | null) => {
    cartButtonElRef.current = el;
  }, []);

  const flyToCart = useCallback(
    (imageUrl: string | null, source: HTMLElement | DOMRect | null, wasEmpty: boolean) => {
      const cartEl = cartButtonElRef.current;
      if (!source || !cartEl) return;

      const startRect = source instanceof HTMLElement ? source.getBoundingClientRect() : source;
      const endRect = cartEl.getBoundingClientRect();
      const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
      const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      setFlyingItems((prev) => [...prev, { id, imageUrl, startRect, dx, dy, wasEmpty }]);
      window.setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== id));
      }, 700);
    },
    []
  );

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    isOpen,
    lastAdded,
    flyingItems,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    registerCartButton,
    flyToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
