import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional().nullable(),
  category: z.string().min(1, "La categoría es requerida").max(100),
  imageUrl: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get("all") === "1";

  const products = await prisma.product.findMany({
    where: includeHidden ? {} : { visible: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Datos inválidos" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: parsed.data,
  });

  return NextResponse.json(product, { status: 201 });
}
