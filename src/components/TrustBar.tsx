import Reveal from "@/components/Reveal";

const FEATURES = [
  {
    title: "Atención personalizada",
    description: "Resolvemos tus dudas por WhatsApp al instante",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 10.5h7.5m-7.5 3h5.25m-9-8.25h11.25A2.25 2.25 0 0121 7.5v6.75a2.25 2.25 0 01-2.25 2.25H8.25L4.5 20.25V16.5H3.75a2.25 2.25 0 01-2.25-2.25V7.5a2.25 2.25 0 012.25-2.25h1.5"
      />
    ),
  },
  {
    title: "Calidad garantizada",
    description: "Productos verificados antes de publicarse",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
  {
    title: "Pedido sin complicaciones",
    description: "Arma tu carrito y envíalo en un solo mensaje",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.877-4.85 2.13-7.502a.75.75 0 00-.75-.822H5.106M7.5 14.25L5.106 5.653M7.5 14.25l-1.128 5.635a1.125 1.125 0 001.11 1.329h9.586a1.125 1.125 0 001.11-1.329L17.05 15"
      />
    ),
  },
  {
    title: "Envíos a todo el país",
    description: "Hacemos llegar tu pedido estés donde estés",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    ),
  },
];

export default function TrustBar() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 90} className="group flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                {f.icon}
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{f.title}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{f.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
