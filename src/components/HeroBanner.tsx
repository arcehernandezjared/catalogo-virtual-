import Image from "next/image";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";

type Stats = { products: number; categories: number };

export default function HeroBanner({
  storeName,
  tagline,
  heroImageUrl,
  stats,
}: {
  storeName: string;
  tagline: string;
  heroImageUrl: string | null;
  stats: Stats;
}) {
  if (heroImageUrl) {
    return (
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative aspect-[4/3] w-full bg-[#0a0b0f] sm:aspect-[2/1] lg:aspect-[3/1]">
          <Image
            src={heroImageUrl}
            alt={storeName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Scrim so the store name stays legible over any photo */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 sm:pb-9 lg:px-8">
              <Reveal>
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                  Catálogo virtual
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-display text-balance bg-gradient-to-b from-white via-white to-white/70 bg-clip-text pt-1.5 text-3xl uppercase leading-[1.15] tracking-wide text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:pt-2 sm:text-5xl lg:text-6xl">
                  {storeName}
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-2.5 h-[3px] w-14 rounded-full bg-[var(--brand)]" />
              </Reveal>

              <Reveal delay={220}>
                <p className="mt-2.5 max-w-xl text-balance text-xs tracking-wide text-white/75 sm:text-sm">
                  {tagline}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0b0f] py-5">
          <Reveal>
            <div className="mx-auto flex max-w-md items-center justify-center gap-8 px-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">
                  <AnimatedCounter value={stats.products} />
                </p>
                <p className="text-xs text-white/60">Productos</p>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">
                  <AnimatedCounter value={stats.categories} />
                </p>
                <p className="text-xs text-white/60">Categorías</p>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">
                  <AnimatedCounter value={100} suffix="%" />
                </p>
                <p className="text-xs text-white/60">Vía WhatsApp</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[var(--brand)]/12 via-[var(--brand)]/[0.04] to-transparent">
      <div className="bg-dot-grid absolute inset-0" aria-hidden="true" />
      <div
        className="animate-float-a absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--brand)]/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-b absolute -right-16 top-20 h-80 w-80 rounded-full bg-[var(--brand-dark)]/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[var(--brand)]/25 bg-surface/80 px-4 py-1.5 text-xs font-semibold text-[var(--brand)] shadow-[var(--shadow-xs)] backdrop-blur">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12 2.25l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 15.9l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 2.25z" />
            </svg>
            Catálogo actualizado
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            {storeName}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            {tagline}
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-8 border-t border-border/70 pt-6 text-sm">
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                <AnimatedCounter value={stats.products} />
              </p>
              <p className="text-xs text-muted-foreground">Productos</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                <AnimatedCounter value={stats.categories} />
              </p>
              <p className="text-xs text-muted-foreground">Categorías</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">
                <AnimatedCounter value={100} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground">Vía WhatsApp</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
