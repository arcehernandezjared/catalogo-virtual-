import Image from "next/image";
import Link from "next/link";
import type { StoreSettings } from "@/lib/types";
import CartButton from "@/components/CartButton";
import StoreNav from "@/components/StoreNav";

export default function StoreHeader({
  settings,
  categories = [],
  hasDeals = false,
}: {
  settings: StoreSettings;
  categories?: string[];
  hasDeals?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-[#0c0e18] to-[#12141f] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
      {settings.whatsapp && (
        <div className="hidden border-b border-white/[0.06] bg-black/20 sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 text-xs font-medium text-white/70 sm:px-6 lg:px-8">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-[var(--brand)]">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              Atención personalizada y compra 100% segura
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-[#25D366]">
                <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.54 6.63Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33-.11 0-.25-.02-.38-.02a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
              </svg>
              Atención directa por WhatsApp · Respuesta rápida garantizada
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.storeName}
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl border border-white/15 object-cover shadow-[var(--shadow-xs)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-lg font-bold text-white shadow-[var(--shadow-sm)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
              {settings.storeName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
              {settings.storeName}
            </span>
            <span className="hidden text-xs text-white/50 sm:block">{settings.tagline}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:border-[var(--brand)]/60 hover:bg-white/10 hover:text-white sm:flex"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#25D366]">
                <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.58 6.58 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.94 4.66 6.6 6.6 0 0 1-6.54 6.63Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-1.6-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33-.11 0-.25-.02-.38-.02a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.09-.18-.14-.38-.24Z" />
              </svg>
              Contáctanos
            </a>
          )}
          <CartButton />
        </div>
      </div>

      <StoreNav categories={categories} hasDeals={hasDeals} whatsapp={settings.whatsapp} />
    </header>
  );
}
