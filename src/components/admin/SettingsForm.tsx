"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type SettingsFormValues = {
  storeName: string;
  tagline: string;
  whatsapp: string;
  logoUrl: string;
  heroImageUrl: string;
  primaryColor: string;
};

export default function SettingsForm({ initialValues }: { initialValues: SettingsFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function uploadFile(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "heroImageUrl",
    setBusy: (v: boolean) => void,
    errorMessage: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || errorMessage);
        return;
      }

      update(field, data.url);
    } catch {
      setError(errorMessage + " Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.storeName.trim()) {
      setError("El nombre de la tienda es requerido");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: values.storeName.trim(),
          tagline: values.tagline.trim(),
          whatsapp: values.whatsapp.replace(/[^\d]/g, ""),
          logoUrl: values.logoUrl || null,
          heroImageUrl: values.heroImageUrl || null,
          primaryColor: values.primaryColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo guardar la configuración");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Logo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
            {values.logoUrl ? (
              <Image src={values.logoUrl} alt="Logo" fill sizes="64px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                Sin logo
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => uploadFile(e, "logoUrl", setUploading, "No se pudo subir el logo.")}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-all active:scale-95 hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
          >
            {uploading ? "Subiendo..." : "Cambiar logo"}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Banner principal
          <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
        </label>
        <div className="relative mb-3 aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface-muted">
          {values.heroImageUrl ? (
            <Image src={values.heroImageUrl} alt="Banner del catálogo" fill sizes="448px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
              Sin banner personalizado: se mostrará el encabezado generado automáticamente
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={heroInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => uploadFile(e, "heroImageUrl", setUploadingHero, "No se pudo subir el banner.")}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => heroInputRef.current?.click()}
            disabled={uploadingHero}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-all active:scale-95 hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
          >
            {uploadingHero ? "Subiendo..." : values.heroImageUrl ? "Cambiar banner" : "Subir banner"}
          </button>
          {values.heroImageUrl && (
            <button
              type="button"
              onClick={() => update("heroImageUrl", "")}
              className="text-xs font-medium text-muted-foreground underline-offset-2 transition hover:text-red-500 hover:underline"
            >
              Quitar banner
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Usa una foto horizontal de buena resolución (mín. 1600px de ancho). El nombre de tu
          tienda y tu frase se muestran automáticamente sobre la imagen.
        </p>
      </div>

      <div>
        <label htmlFor="storeName" className="mb-1.5 block text-sm font-medium text-foreground">
          Nombre de la tienda
        </label>
        <input
          id="storeName"
          type="text"
          value={values.storeName}
          onChange={(e) => update("storeName", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
          required
        />
      </div>

      <div>
        <label htmlFor="tagline" className="mb-1.5 block text-sm font-medium text-foreground">
          Frase / descripción corta
        </label>
        <input
          id="tagline"
          type="text"
          value={values.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-foreground">
          Número de WhatsApp
        </label>
        <input
          id="whatsapp"
          type="text"
          value={values.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
          placeholder="50688887777"
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-[var(--shadow-xs)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Incluye código de país sin espacios ni símbolos, ej. 506 para Costa Rica + tu número a 8 dígitos.
        </p>
      </div>

      <div>
        <label htmlFor="primaryColor" className="mb-1.5 block text-sm font-medium text-foreground">
          Color principal
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primaryColor"
            type="color"
            value={values.primaryColor}
            onChange={(e) => update("primaryColor", e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-surface p-1"
          />
          <span className="text-sm text-muted-foreground">{values.primaryColor}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">Cambios guardados correctamente.</p>}

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:brightness-95 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
