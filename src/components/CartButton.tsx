"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

// Heroicons v2 (MIT) — outline "empty cart" and solid "full cart" paths, used
// to show the cart transitioning from empty to having a product inside it.
const CART_OUTLINE_PATH =
  "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z";
const CART_SOLID_PATH =
  "M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z";
// Heroicons v2 solid "cube" — stands in for the product dropping into the cart.
const PRODUCT_ICON_PATH =
  "M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z";

export default function CartButton() {
  const { totalItems, openCart, flyingItems, registerCartButton } = useCart();
  const hasItems = totalItems > 0;

  // Whether the swap-to-solid animation has been triggered. Combined with
  // `hasItems` below (rather than reset on its own) so the icon still snaps
  // back to outline the instant the cart is emptied, with no extra effect.
  const [swapped, setSwapped] = useState(false);
  const [catching, setCatching] = useState(false);
  const [justFilled, setJustFilled] = useState(false);
  const [catchId, setCatchId] = useState(0);
  const prevFlyingCount = useRef(0);
  const isFull = hasItems && swapped;

  useEffect(() => {
    if (flyingItems.length > prevFlyingCount.current) {
      const latest = flyingItems[flyingItems.length - 1];
      // Match the ~0.65s flight duration so this plays right as the item "lands".
      const timeout = window.setTimeout(() => {
        setCatchId((id) => id + 1);
        setCatching(true);
        if (latest?.wasEmpty) {
          setJustFilled(true);
          setSwapped(true);
        }
        window.setTimeout(() => {
          setCatching(false);
          setJustFilled(false);
        }, 620);
      }, 600);
      prevFlyingCount.current = flyingItems.length;
      return () => window.clearTimeout(timeout);
    }
    prevFlyingCount.current = flyingItems.length;
  }, [flyingItems]);

  // Safety net: if items exist but nothing ever triggered the swap (e.g. the
  // cart was restored from localStorage on load), just reflect reality.
  useEffect(() => {
    if (!hasItems || swapped) return;
    const timeout = window.setTimeout(() => setSwapped(true), 900);
    return () => window.clearTimeout(timeout);
  }, [hasItems, swapped]);

  return (
    <button
      ref={registerCartButton}
      onClick={openCart}
      aria-label="Ver carrito"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/90 backdrop-blur transition-all duration-200 active:scale-90 hover:-translate-y-0.5 hover:border-[var(--brand)]/60 hover:bg-white/10 hover:text-white"
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {/* Empty cart (outline): visible until the first product lands inside */}
        {(!isFull || justFilled) && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className={`absolute inset-0 h-5 w-5 ${justFilled ? "animate-cart-outline-out" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={CART_OUTLINE_PATH} />
          </svg>
        )}

        {/* Full cart (solid): visible once a product has landed inside */}
        {isFull && (
          <svg
            key={catching ? `fill-${catchId}` : "fill-static"}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`absolute inset-0 h-5 w-5 text-[var(--brand)] ${
              justFilled ? "animate-cart-solid-in" : catching ? "animate-cart-catch" : ""
            }`}
          >
            <path d={CART_SOLID_PATH} />
          </svg>
        )}

        {/* The product: starts outside the cart, drops down and merges into it */}
        {catching && (
          <svg
            key={`drop-${catchId}`}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-drop-into-cart absolute -top-1.5 right-0 h-3 w-3 text-[var(--brand)]"
          >
            <path d={PRODUCT_ICON_PATH} />
          </svg>
        )}
      </span>

      {totalItems > 0 && (
        <span
          key={totalItems}
          className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[11px] font-bold text-white shadow-[var(--shadow-sm)]"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
