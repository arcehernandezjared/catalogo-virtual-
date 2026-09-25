"use client";

import { useEffect, useRef, useState } from "react";

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

export default function CategorySelect({
  categories,
  value,
  onChange,
  dealsLabel,
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  /** The special "on sale" entry, styled with a flame accent instead of the brand color. */
  dealsLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const isDealsSelected = value === dealsLabel;

  return (
    <div ref={ref} className="relative w-full sm:w-56">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-xs)] transition-all duration-200 active:scale-[0.98] ${
          isDealsSelected
            ? "border-red-500/40 bg-red-500/10 text-red-500"
            : "border-border bg-surface text-foreground hover:border-[var(--brand)]/40"
        }`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4.5h18M6 9.75h12M9.75 15h4.5"
            />
          </svg>
          <span className="truncate">{value}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-scale-in absolute right-0 top-full z-30 mt-2 w-full min-w-[14rem] origin-top-right rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-lg)] sm:left-0 sm:right-auto"
        >
          {categories.map((c) => {
            const isDeals = c === dealsLabel;
            const active = c === value;
            return (
              <button
                key={c}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? isDeals
                      ? "bg-red-500/10 text-red-500"
                      : "bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "text-foreground hover:bg-surface-muted"
                }`}
              >
                {isDeals && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0">
                    {FLAME_PATHS}
                  </svg>
                )}
                <span className="flex-1 truncate">{c}</span>
                {active && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
