require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const sampleProducts = [
  {
    name: "Audífonos Inalámbricos Pro",
    description: "Cancelación de ruido activa, 30 horas de batería y estuche de carga rápida.",
    price: 899,
    originalPrice: 1199,
    category: "Electrónica",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    featured: true,
  },
  {
    name: "Smartwatch Serie X",
    description: "Monitor de ritmo cardíaco, GPS integrado y resistencia al agua.",
    price: 1499,
    category: "Electrónica",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    featured: true,
  },
  {
    name: "Mochila Urbana Impermeable",
    description: "Compartimento para laptop de 15\", puerto USB externo y diseño antirrobo.",
    price: 650,
    category: "Accesorios",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  },
  {
    name: "Lámpara LED de Escritorio",
    description: "Luz regulable en 5 tonalidades, con puerto de carga inalámbrica integrado.",
    price: 420,
    category: "Hogar",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  },
  {
    name: "Set de Tazas de Cerámica",
    description: "Juego de 4 tazas artesanales, aptas para microondas y lavavajillas.",
    price: 280,
    category: "Hogar",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
  },
  {
    name: "Tenis Deportivos Running",
    description: "Suela de alta amortiguación, malla transpirable, disponible en varios colores.",
    price: 1050,
    originalPrice: 1400,
    category: "Ropa",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    featured: true,
  },
  {
    name: "Chamarra Impermeable",
    description: "Ideal para exteriores, resistente al viento y con forro térmico.",
    price: 1200,
    category: "Ropa",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
  {
    name: "Cámara Instantánea",
    description: "Impresión al instante, flash automático y modo selfie.",
    price: 1899,
    originalPrice: 2399,
    category: "Electrónica",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  },
];

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Mi Catálogo",
      tagline: "Los mejores productos, a un mensaje de distancia",
      whatsapp: "521234567890",
      primaryColor: "#6366f1",
    },
  });

  for (const product of sampleProducts) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log("Datos de ejemplo creados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
