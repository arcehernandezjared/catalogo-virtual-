import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bold condensed display face used only for the hero banner's store name,
// for a more editorial/premium feel than the default body font.
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  // latin-ext is required for ñ/á/é/í/ó/ú — this app is Spanish-first.
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });

  return {
    title: settings?.storeName || "Catálogo Virtual",
    description: settings?.tagline || "Catálogo de productos en línea",
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const brand = settings?.primaryColor || "#6366f1";

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
      style={{ "--brand": brand } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
