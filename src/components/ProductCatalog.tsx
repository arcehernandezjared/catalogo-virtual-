"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Reveal from "@/components/Reveal";
import CategorySelect from "@/components/CategorySelect";
import { getDiscountPercent } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

const DEALS_FILTER = "Ofertas";

export default function ProductCatalog({
  products,
  whatsapp,
}: {
  products: CatalogProduct[];
  whatsapp: string;
}) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") || "Todos";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [selected, setSelected] = useState<CatalogProduct | null>(null);

  // Lets the header's category menu (a plain link to ?category=X) drive this
  // filter even when Next.js keeps this component mounted across the
  // client-side navigation instead of a full page reload. This is React's
  // documented "adjust state during render" pattern, so it doesn't need an
  // effect: https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    setCategory(urlCategory);
  }

  const hasDeals = useMemo(
    () => products.some((p) => getDiscountPercent(p.price, p.originalPrice) !== null),
    [products]
  );

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["Todos", ...(hasDeals ? [DEALS_FILTER] : []), ...Array.from(set).sort()];
  }, [products, hasDeals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        category === "Todos" ||
        (category === DEALS_FILTER
          ? getDiscountPercent(p.price, p.originalPrice) !== null
          : p.category === category);
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="sticky top-[118px] z-20 -mx-4 mb-8 border-b border-border bg-background/95 px-4 py-4 shadow-[var(--shadow-xs)] backdrop-blur-md sm:top-[146px] sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
            />
          </div>

          <CategorySelect
            categories={categories}
            value={category}
            onChange={setCategory}
            dealsLabel={DEALS_FILTER}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-foreground">No encontramos productos</p>
          <p className="text-sm text-muted-foreground">
            Prueba con otra búsqueda o categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={(i % 8) * 60}>
              <ProductCard product={product} onSelect={setSelected} />
            </Reveal>
          ))}
        </div>
      )}

      {selected && (
        <ProductModal product={selected} whatsapp={whatsapp} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
