"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FLAME_PATHS = (
  <>
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
  </>
);

export default function StoreNav({
  categories,
  hasDeals,
  whatsapp,
}: {
  categories: string[];
  hasDeals: boolean;
  whatsapp: string;
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoriesOpen) return;

    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setCategoriesOpen(false);
    }
    function onScroll() {
      setCategoriesOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("scroll", onScroll);
    };
  }, [categoriesOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="relative border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop links */}
        <div className="hidden items-center sm:flex">
          <NavLink href="/#catalogo">Catálogo</NavLink>

          {categories.length > 0 && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex items-center gap-1 px-3.5 py-3 text-sm font-medium text-white/60 transition hover:text-white"
              >
                Categorías
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {categoriesOpen && (
                <div className="animate-scale-in absolute left-0 top-full z-40 mt-1 w-56 origin-top-left rounded-2xl border border-white/10 bg-[#161826] p-2 shadow-[var(--shadow-xl)]">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      href={`/?category=${encodeURIComponent(c)}#catalogo`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasDeals && (
            <Link
              href="/#ofertas"
              className="group flex items-center gap-1.5 px-3.5 py-3 text-sm font-semibold text-red-400 transition hover:text-red-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                {FLAME_PATHS}
              </svg>
              Ofertas
            </Link>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 py-3 text-sm font-semibold text-white sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
          Menú
        </button>

        <span className="hidden text-xs font-medium text-white/40 sm:block">
          {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
        </span>
      </div>

      {/* Mobile slide-down panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in absolute inset-x-0 top-0 flex max-h-[85vh] flex-col overflow-y-auto rounded-b-3xl border-b border-white/10 bg-[#12141f] p-5 shadow-[var(--shadow-xl)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-bold text-white">Menú</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all active:scale-90 hover:bg-white/5 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Link
              href="/#catalogo"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-3 text-base font-semibold text-white transition hover:bg-white/5"
            >
              Catálogo completo
            </Link>

            {hasDeals && (
              <Link
                href="/#ofertas"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3.5 py-3 text-base font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4.5 w-4.5">
                  {FLAME_PATHS}
                </svg>
                Ofertas del día
              </Link>
            )}

            {categories.length > 0 && (
              <>
                <p className="mb-1 mt-3 px-3.5 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Categorías
                </p>
                <div className="flex flex-col">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      href={`/?category=${encodeURIComponent(c)}#catalogo`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3.5 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.54 6.63Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33-.11 0-.25-.02-.38-.02a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
                </svg>
                Escríbenos por WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-3.5 py-3 text-sm font-medium text-white/60 transition hover:text-white"
    >
      {children}
    </Link>
  );
}
