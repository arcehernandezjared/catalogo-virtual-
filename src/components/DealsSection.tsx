"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Reveal from "@/components/Reveal";
import type { CatalogProduct } from "@/lib/types";

export default function DealsSection({
  products,
  whatsapp,
}: {
  products: CatalogProduct[];
  whatsapp: string;
}) {
  const [selected, setSelected] = useState<CatalogProduct | null>(null);

  if (products.length === 0) return null;

  return (
    <section
      id="ofertas"
      className="relative scroll-mt-[118px] overflow-hidden border-y-2 border-red-500/40 bg-gradient-to-br from-[#1c0609] via-[#120708] to-[#1c0609] sm:scroll-mt-[146px]"
    >
      {/* Faint diagonal "sale" stripe texture for extra energy, kept subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #fff 0, #fff 2px, transparent 2px, transparent 18px)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-[0_0_20px_-2px_rgba(239,68,68,0.6)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z"
                />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Ofertas del día
                </h2>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
                  </span>
                  Activas ahora
                </span>
              </div>
              <p className="mt-0.5 text-sm text-white/60">
                Precios especiales por tiempo limitado, aprovéchalos antes que se acaben.
              </p>
            </div>
          </div>

          <span className="hidden shrink-0 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/70 sm:block">
            {products.length} {products.length === 1 ? "producto" : "productos"} en oferta
          </span>
        </Reveal>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 80} className="w-[46%] shrink-0 snap-start sm:w-60">
              <ProductCard product={product} onSelect={setSelected} variant="deal" />
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <ProductModal product={selected} whatsapp={whatsapp} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
