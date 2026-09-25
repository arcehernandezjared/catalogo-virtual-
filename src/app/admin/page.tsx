import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import ProductTable from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [settings, products] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.product.findMany({
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        category: true,
        imageUrl: true,
        featured: true,
        visible: true,
      },
    }),
  ]);

  return (
    <AdminShell storeName={settings.storeName}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} producto{products.length === 1 ? "" : "s"} en tu catálogo
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:brightness-95"
        >
          + Agregar producto
        </Link>
      </div>

      <ProductTable products={products} />
    </AdminShell>
  );
}
