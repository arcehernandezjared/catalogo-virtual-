"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice, buildWhatsAppUrl, cartWhatsAppMessage } from "@/lib/format";

export default function CartDrawer({ whatsapp }: { whatsapp: string }) {
  const { items, totalPrice, isOpen, closeCart, removeItem, setQuantity, clearCart } = useCart();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const whatsappUrl = whatsapp
    ? buildWhatsAppUrl(
        whatsapp,
        cartWhatsAppMessage(items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })))
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeCart}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-gradient-to-b from-[#0d0f1a] to-[#14161f] shadow-[var(--shadow-xl)] animate-slide-in-right"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4.5 w-4.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.877-4.85 2.13-7.502a.75.75 0 00-.75-.822H5.106M7.5 14.25L5.106 5.653M7.5 14.25l-1.128 5.635a1.125 1.125 0 001.11 1.329h9.586a1.125 1.125 0 001.11-1.329L17.05 15"
                />
              </svg>
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-bold text-white">Tu pedido</h2>
              {itemCount > 0 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">
                  {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-all active:scale-90 hover:rotate-90 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.877-4.85 2.13-7.502a.75.75 0 00-.75-.822H5.106M7.5 14.25L5.106 5.653M7.5 14.25l-1.128 5.635a1.125 1.125 0 001.11 1.329h9.586a1.125 1.125 0 001.11-1.329L17.05 15"
                />
              </svg>
            </div>
            <p className="font-semibold text-white">Tu carrito está vacío</p>
            <p className="text-sm text-white/50">Agrega productos del catálogo para armar tu pedido.</p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-95 hover:border-[var(--brand)]/60 hover:bg-white/5"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="animate-fade-in flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-white/40">
                          Sin foto
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-semibold text-white">{item.name}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Quitar ${item.name}`}
                          className="shrink-0 text-white/40 transition-all active:scale-90 hover:scale-110 hover:text-red-400"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5">
                          <button
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            aria-label="Disminuir cantidad"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-transform active:scale-90 hover:bg-white/10"
                          >
                            −
                          </button>
                          <span key={item.quantity} className="w-5 animate-pop text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-transform active:scale-90 hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex flex-col items-end">
                          {item.quantity > 1 && (
                            <span className="text-[11px] text-white/40">{formatPrice(item.price)} c/u</span>
                          )}
                          <span className="text-sm font-bold text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={clearCart}
                className="mt-4 flex items-center gap-1.5 px-1 text-xs font-medium text-white/40 transition hover:text-red-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Vaciar carrito
              </button>
            </div>

            <div className="border-t border-white/10 bg-black/20 px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-white/60">Total</span>
                <span className="text-2xl font-extrabold text-white">{formatPrice(totalPrice)}</span>
              </div>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:brightness-95"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.54 6.63Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33-.11 0-.25-.02-.38-.02a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
                  </svg>
                  Enviar pedido por WhatsApp
                </a>
              ) : (
                <p className="text-center text-xs text-white/50">
                  Este catálogo aún no tiene un número de WhatsApp configurado.
                </p>
              )}

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/35">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                Coordina el pago y la entrega directamente por WhatsApp
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
