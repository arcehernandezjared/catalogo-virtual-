"use client";

import { useRef } from "react";
import Image from "next/image";
import { formatPrice, getDiscountPercent } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import type { CatalogProduct } from "@/lib/types";

export default function ProductCard({
  product,
  onSelect,
  variant = "default",
}: {
  product: CatalogProduct;
  onSelect: (product: CatalogProduct) => void;
  /** "deal" gives the card a dark, sale-themed look so the Ofertas section
   * reads as visually distinct from the regular catalog grid. */
  variant?: "default" | "deal";
}) {
  const { addItem, lastAdded, flyToCart } = useCart();
  const justAdded = lastAdded === product.id;
  const imageRef = useRef<HTMLButtonElement>(null);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const isDeal = variant === "deal";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 ${
        isDeal
          ? "border border-red-500/25 bg-gradient-to-b from-[#241016] to-[#150a0d] shadow-[0_0_0_1px_rgba(239,68,68,0.08),var(--shadow-md)] hover:border-red-400/50 hover:shadow-[0_0_24px_-4px_rgba(239,68,68,0.45),var(--shadow-lg)]"
          : "border border-border bg-surface shadow-[var(--shadow-sm)] hover:border-[var(--brand)]/30 hover:shadow-[var(--shadow-lg)]"
      }`}
    >
      <button
        ref={imageRef}
        onClick={() => onSelect(product)}
        className={`relative aspect-square w-full overflow-hidden text-left focus:outline-none ${isDeal ? "bg-black/40" : "bg-surface-muted"}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition duration-500 group-hover:scale-105 ${isDeal ? "opacity-90" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 12V4.5A1.5 1.5 0 014.5 3h15a1.5 1.5 0 011.5 1.5V15a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 15v-1.5z"
              />
            </svg>
          </div>
        )}
        <div
          className={`pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 ${
            isDeal
              ? "bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              : "bg-gradient-to-t from-black/10 via-transparent to-transparent"
          }`}
        />
        <div className="animate-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discount !== null && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-[var(--shadow-sm)] ${
                isDeal ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-red-500"
              }`}
            >
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white shadow-[var(--shadow-sm)] ${
                isDeal ? "bg-white/15 backdrop-blur" : "bg-[var(--brand)]"
              }`}
            >
              Destacado
            </span>
          )}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          const wasEmpty = addItem(product, 1);
          flyToCart(product.imageUrl, imageRef.current, wasEmpty);
        }}
        aria-label={`Agregar ${product.name} al carrito`}
        className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-[var(--shadow-md)] ring-2 ring-white/80 transition-all duration-200 active:scale-90 hover:scale-110 ${
          justAdded ? "scale-110 bg-emerald-500" : isDeal ? "bg-red-500 hover:bg-red-600" : "bg-[var(--brand)] hover:bg-[var(--brand-dark)]"
        }`}
      >
        {justAdded ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </button>

      <button onClick={() => onSelect(product)} className="flex flex-1 flex-col gap-1 p-4 text-left">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider ${isDeal ? "text-red-400" : "text-[var(--brand)]"}`}
        >
          {product.category}
        </span>
        <h3 className={`line-clamp-2 text-sm font-semibold sm:text-base ${isDeal ? "text-white" : "text-foreground"}`}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div className="flex flex-col">
            {discount !== null && (
              <span className={`text-xs line-through ${isDeal ? "text-white/40" : "text-muted-foreground"}`}>
                {formatPrice(product.originalPrice as number)}
              </span>
            )}
            <span
              className={`text-base font-bold sm:text-lg ${
                isDeal ? "text-orange-400" : discount !== null ? "text-red-500" : "text-foreground"
              }`}
            >
              {formatPrice(product.price)}
            </span>
          </div>
          <span
            className={`hidden items-center gap-1 text-xs font-semibold opacity-0 transition group-hover:opacity-100 sm:flex ${
              isDeal ? "text-red-400" : "text-[var(--brand)]"
            }`}
          >
            Ver detalles
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </button>
    </div>
  );
}
