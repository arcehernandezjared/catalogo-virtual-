import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return (
    <AdminShell storeName={settings.storeName}>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Configuración de la tienda</h1>
      <SettingsForm
        initialValues={{
          storeName: settings.storeName,
          tagline: settings.tagline,
          whatsapp: settings.whatsapp,
          logoUrl: settings.logoUrl ?? "",
          heroImageUrl: settings.heroImageUrl ?? "",
          primaryColor: settings.primaryColor,
        }}
      />
    </AdminShell>
  );
}
