"use client";

import { useCart } from "@/lib/cart-context";

export default function FlyToCartLayer() {
  const { flyingItems } = useCart();

  if (flyingItems.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      {flyingItems.map((item) => (
        // Plain inline styles on purpose: a solid brand-colored frame is the
        // most reliable way to stay visible over any product photo or theme,
        // and avoids depending on the CSS engine parsing multi-layer
        // box-shadow / color-mix() arbitrary values correctly.
        <div
          key={item.id}
          className="animate-fly-to-cart absolute rounded-2xl"
          style={
            {
              left: item.startRect.left,
              top: item.startRect.top,
              width: item.startRect.width,
              height: item.startRect.height,
              padding: 5,
              backgroundColor: "var(--brand)",
              boxShadow: "var(--shadow-xl)",
              "--fly-dx": `${item.dx}px`,
              "--fly-dy": `${item.dy}px`,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full overflow-hidden rounded-xl bg-surface">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- short-lived decorative clone of an already-loaded image; next/image would add overhead for a 0.65s animation
              <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[var(--brand)]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
