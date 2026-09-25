import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import TrustBar from "@/components/TrustBar";
import DealsSection from "@/components/DealsSection";
import ProductCatalog from "@/components/ProductCatalog";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import FlyToCartLayer from "@/components/FlyToCartLayer";
import HeroBanner from "@/components/HeroBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settingsRow, products] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.product.findMany({
      where: { visible: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        originalPrice: true,
        category: true,
        imageUrl: true,
        featured: true,
      },
    }),
  ]);

  const settings = {
    storeName: settingsRow.storeName,
    tagline: settingsRow.tagline,
    whatsapp: settingsRow.whatsapp,
    logoUrl: settingsRow.logoUrl,
    heroImageUrl: settingsRow.heroImageUrl,
    primaryColor: settingsRow.primaryColor,
  };

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const deals = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <CartProvider>
      <StoreHeader settings={settings} categories={categories} hasDeals={deals.length > 0} />

      <main className="flex-1">
        <HeroBanner
          storeName={settings.storeName}
          tagline={settings.tagline}
          heroImageUrl={settings.heroImageUrl}
          stats={{ products: products.length, categories: categories.length }}
        />

        <DealsSection products={deals} whatsapp={settings.whatsapp} />

        <TrustBar />

        <div id="catalogo" className="mx-auto max-w-7xl scroll-mt-[118px] px-4 py-10 sm:scroll-mt-[146px] sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <ProductCatalog products={products} whatsapp={settings.whatsapp} />
          </Suspense>
        </div>
      </main>

      <StoreFooter settings={settings} categories={categories} dark={Boolean(settings.heroImageUrl)} />
      <CartDrawer whatsapp={settings.whatsapp} />
      <FlyToCartLayer />
    </CartProvider>
  );
}
