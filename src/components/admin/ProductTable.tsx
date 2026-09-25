"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getDiscountPercent } from "@/lib/format";

type AdminProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  category: string;
  imageUrl: string | null;
  featured: boolean;
  visible: boolean;
};

export default function ProductTable({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleVisible(product: AdminProduct) {
    setBusyId(product.id);
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !product.visible }),
    });
    router.refresh();
    setBusyId(null);
  }

  async function handleDelete(product: AdminProduct) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    setBusyId(product.id);
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.refresh();
    setBusyId(null);
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-20 text-center">
        <p className="text-base font-medium text-foreground">Aún no tienes productos</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Agrega tu primer producto para que aparezca en el catálogo.
        </p>
        <Link
          href="/admin/productos/nuevo"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:brightness-95"
        >
          + Agregar producto
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="grid grid-cols-1 divide-y divide-border">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center gap-4 p-4 transition hover:bg-surface-muted/50 ${busyId === product.id ? "opacity-50" : ""}`}
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill sizes="56px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  Sin foto
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.category} · {formatPrice(product.price)}
                {product.featured && " · Destacado"}
              </p>
            </div>

            {(() => {
              const discount = getDiscountPercent(product.price, product.originalPrice);
              return discount !== null ? (
                <span className="shrink-0 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500">
                  -{discount}%
                </span>
              ) : null;
            })()}

            <button
              onClick={() => toggleVisible(product)}
              disabled={busyId === product.id}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                product.visible
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-slate-500/10 text-slate-500"
              }`}
              title={product.visible ? "Visible en el catálogo" : "Oculto del catálogo"}
            >
              {product.visible ? "Visible" : "Oculto"}
            </button>

            <Link
              href={`/admin/productos/${product.id}/editar`}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              Editar
            </Link>

            <button
              onClick={() => handleDelete(product)}
              disabled={busyId === product.id}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-red-500 transition hover:border-red-500"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
