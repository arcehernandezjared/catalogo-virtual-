import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { StoreSettings } from "@/lib/types";

export default function StoreFooter({
  settings,
  categories = [],
  dark = false,
}: {
  settings: StoreSettings;
  categories?: string[];
  /** Matches the footer's theme to a custom dark hero banner, so the page is
   * bookended consistently instead of jumping straight back to light. */
  dark?: boolean;
}) {
  const base = dark ? "bg-[#0a0b0f] text-white" : "bg-surface-muted/60 text-foreground";
  const muted = dark ? "text-white/55" : "text-muted-foreground";
  const border = dark ? "border-white/10" : "border-border";
  const linkHover = dark ? "hover:text-white" : "hover:text-[var(--brand)]";

  return (
    <footer className={`relative mt-auto overflow-hidden border-t ${border} ${base}`}>
      {/* Brand-colored top accent, ties the footer back to the rest of the site */}
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent" />
      {dark && <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />}

      <Reveal className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-sm font-bold text-white shadow-[var(--shadow-sm)]">
              {settings.storeName.charAt(0).toUpperCase()}
            </span>
            <span className={`text-lg font-bold ${dark ? "text-white" : "text-foreground"}`}>
              {settings.storeName}
            </span>
          </div>
          <p className={`max-w-xs text-sm leading-relaxed ${muted}`}>{settings.tagline}</p>
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-[var(--shadow-sm)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] hover:brightness-95"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.54 6.63Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33-.11 0-.25-.02-.38-.02a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
              </svg>
              Escríbenos por WhatsApp
            </a>
          )}
        </div>

        {categories.length > 0 && (
          <div>
            <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${muted}`}>Categorías</p>
            <ul className="flex flex-col gap-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c}>
                  <Link
                    href={`/?category=${encodeURIComponent(c)}#catalogo`}
                    className={`group flex items-center gap-1.5 text-sm transition ${muted} ${linkHover}`}
                  >
                    <span
                      className={`h-1 w-1 shrink-0 rounded-full transition-all group-hover:w-3 ${dark ? "bg-white/30 group-hover:bg-[var(--brand)]" : "bg-border group-hover:bg-[var(--brand)]"}`}
                    />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${muted}`}>Enlaces</p>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link
                href="/#catalogo"
                className={`group flex items-center gap-1.5 text-sm transition ${muted} ${linkHover}`}
              >
                <span
                  className={`h-1 w-1 shrink-0 rounded-full transition-all group-hover:w-3 ${dark ? "bg-white/30 group-hover:bg-[var(--brand)]" : "bg-border group-hover:bg-[var(--brand)]"}`}
                />
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className={`group flex items-center gap-1.5 text-sm transition ${muted} ${linkHover}`}
              >
                <span
                  className={`h-1 w-1 shrink-0 rounded-full transition-all group-hover:w-3 ${dark ? "bg-white/30 group-hover:bg-[var(--brand)]" : "bg-border group-hover:bg-[var(--brand)]"}`}
                />
                Panel de administración
              </Link>
            </li>
          </ul>
        </div>
      </Reveal>

      <div className={`relative border-t ${border}`}>
        <div
          className={`mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 text-center text-xs sm:flex-row sm:justify-between sm:px-6 lg:px-8 ${muted}`}
        >
          <span>
            © {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Catálogo activo
          </span>
        </div>
      </div>
    </footer>
  );
}
