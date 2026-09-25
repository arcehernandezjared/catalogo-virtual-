import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [settings, product, categoryRows] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.product.findUnique({ where: { id } }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  if (!product) {
    notFound();
  }

  const categories = categoryRows.map((c) => c.category).sort();

  return (
    <AdminShell storeName={settings.storeName}>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Editar producto</h1>
      <ProductForm
        existingCategories={categories}
        initialValues={{
          id: product.id,
          name: product.name,
          description: product.description ?? "",
          price: String(product.price),
          originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
          category: product.category,
          imageUrl: product.imageUrl ?? "",
          featured: product.featured,
          visible: product.visible,
        }}
      />
    </AdminShell>
  );
}
