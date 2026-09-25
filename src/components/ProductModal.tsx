"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice, getDiscountPercent, buildWhatsAppUrl, productWhatsAppMessage } from "@/lib/format";
import { useCart, getViewportCenterRect } from "@/lib/cart-context";
import type { CatalogProduct } from "@/lib/types";

export default function ProductModal({
  product,
  whatsapp,
  onClose,
}: {
  product: CatalogProduct;
  whatsapp: string;
  onClose: () => void;
}) {
  const { addItem, openCart, flyToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const discount = getDiscountPercent(product.price, product.originalPrice);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const whatsappUrl = whatsapp
    ? buildWhatsAppUrl(whatsapp, productWhatsAppMessage(product.name, product.price))
    : null;

  function handleAddToCart() {
    const wasEmpty = addItem(product, quantity);
    // Fly from the center of the screen rather than the modal's image side,
    // since the modal itself is centered and that reads more naturally.
    flyToCart(product.imageUrl, getViewportCenterRect(), wasEmpty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-surface shadow-[var(--shadow-xl)] animate-scale-in sm:max-h-[85vh] sm:flex-row sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-[var(--shadow-sm)] backdrop-blur transition-all active:scale-90 hover:rotate-90 hover:bg-surface-muted"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-square w-full shrink-0 bg-surface-muted sm:aspect-auto sm:w-1/2">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-64 w-full items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
            {discount !== null && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-[var(--shadow-sm)]">
                -{discount}% de descuento
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white shadow-[var(--shadow-sm)]">
                Destacado
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            {product.category}
          </span>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">{product.name}</h2>
          <div className="flex items-center gap-2.5">
            <span className={`text-2xl font-extrabold ${discount !== null ? "text-red-500" : "text-foreground"}`}>
              {formatPrice(product.price)}
            </span>
            {discount !== null && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice as number)}
              </span>
            )}
          </div>
          {product.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Cantidad</span>
            <div className="flex items-center gap-1 rounded-full border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-transform active:scale-90 hover:bg-surface-muted"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-transform active:scale-90 hover:bg-surface-muted"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2.5">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[var(--shadow-md)] transition-all duration-200 active:scale-95 ${
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-[var(--brand)] text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:brightness-95"
              }`}
            >
              {added ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Agregado al carrito
                </>
              ) : (
                "Agregar al carrito"
              )}
            </button>

            {added && (
              <button
                onClick={() => {
                  openCart();
                  onClose();
                }}
                className="text-xs font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                Ver carrito y enviar pedido →
              </button>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:border-[#25D366] hover:text-[#1da851] hover:shadow-[var(--shadow-md)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.54 6.63Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33-.11 0-.25-.02-.38-.02a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
                </svg>
                Pedir solo este producto
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
