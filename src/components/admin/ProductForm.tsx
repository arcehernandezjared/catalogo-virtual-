"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  visible: boolean;
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "",
  imageUrl: "",
  featured: false,
  visible: true,
};

export default function ProductForm({
  initialValues,
  existingCategories,
}: {
  initialValues?: ProductFormValues;
  existingCategories: string[];
}) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? EMPTY_VALUES);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo subir la imagen");
        return;
      }

      update("imageUrl", data.url);
    } catch {
      setError("Error al subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Number(values.price);
    const originalPrice = values.originalPrice.trim() ? Number(values.originalPrice) : null;

    if (!values.name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!values.category.trim()) {
      setError("La categoría es requerida");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setError("El precio debe ser un número válido");
      return;
    }
    if (originalPrice !== null && (Number.isNaN(originalPrice) || originalPrice < 0)) {
      setError("El precio antes de descuento debe ser un número válido");
      return;
    }
    if (originalPrice !== null && originalPrice <= price) {
      setError("El precio antes de descuento debe ser mayor al precio actual");
      return;
    }

    setSaving(true);

    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      price,
      originalPrice,
      category: values.category.trim(),
      imageUrl: values.imageUrl || null,
      featured: values.featured,
      visible: values.visible,
    };

    try {
      const res = await fetch(isEditing ? `/api/products/${values.id}` : "/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo guardar el producto");
        setSaving(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Imagen del producto</label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
            {values.imageUrl ? (
              <Image src={values.imageUrl} alt="Vista previa" fill sizes="96px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
            >
              {uploading ? "Subiendo..." : values.imageUrl ? "Cambiar imagen" : "Subir imagen"}
            </button>
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP o GIF. Máx 5MB.</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          Nombre del producto
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-foreground">
            Precio (₡)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
            required
          />
        </div>

        <div>
          <label htmlFor="originalPrice" className="mb-1.5 block text-sm font-medium text-foreground">
            Precio antes de descuento
            <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="originalPrice"
            type="number"
            min="0"
            step="0.01"
            value={values.originalPrice}
            onChange={(e) => update("originalPrice", e.target.value)}
            placeholder="Déjalo vacío si no hay oferta"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Si lo llenas con un valor mayor al precio, el producto aparecerá en Ofertas.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
          Categoría
        </label>
        <input
          id="category"
          type="text"
          list="category-options"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
          required
        />
        <datalist id="category-options">
          {existingCategories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
          Descripción
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[var(--brand)]"
          />
          Producto destacado
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={values.visible}
            onChange={(e) => update("visible", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[var(--brand)]"
          />
          Visible en el catálogo
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:brightness-95 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
