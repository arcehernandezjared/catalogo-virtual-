import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [settings, categoryRows] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  const categories = categoryRows.map((c) => c.category).sort();

  return (
    <AdminShell storeName={settings.storeName}>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Agregar producto</h1>
      <ProductForm existingCategories={categories} />
    </AdminShell>
  );
}
