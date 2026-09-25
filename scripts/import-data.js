// Importa los datos exportados de tu base de datos anterior (SQLite) a la
// base de datos configurada en DATABASE_URL (tu nuevo Postgres/Neon).
//
// Uso:
//   1. Asegúrate de que .env tenga el DATABASE_URL de tu base de datos nueva.
//   2. npm run db:migrate   (crea las tablas si aún no existen)
//   3. node scripts/import-data.js

require("dotenv/config");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const exportPath = path.join(__dirname, "..", "prisma", "data-export.json");

if (!fs.existsSync(exportPath)) {
  console.error(`No se encontró ${exportPath}. Nada que importar.`);
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const { products, settings } = JSON.parse(fs.readFileSync(exportPath, "utf8"));

  for (const s of settings) {
    await prisma.settings.upsert({
      where: { id: s.id },
      update: {
        storeName: s.storeName,
        tagline: s.tagline,
        whatsapp: s.whatsapp,
        logoUrl: s.logoUrl,
        heroImageUrl: s.heroImageUrl,
        primaryColor: s.primaryColor,
      },
      create: {
        id: s.id,
        storeName: s.storeName,
        tagline: s.tagline,
        whatsapp: s.whatsapp,
        logoUrl: s.logoUrl,
        heroImageUrl: s.heroImageUrl,
        primaryColor: s.primaryColor,
      },
    });
  }
  console.log(`Configuración de tienda importada (${settings.length} registro).`);

  let imported = 0;
  for (const p of products) {
    // SQLite stored booleans as 0/1 and dates as ISO strings — normalize both.
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        imageUrl: p.imageUrl,
        featured: Boolean(p.featured),
        visible: Boolean(p.visible),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    });
    imported++;
  }
  console.log(`Productos importados: ${imported}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
