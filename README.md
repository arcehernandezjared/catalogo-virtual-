# Catálogo Virtual

Catálogo de productos en línea con panel de administración. Construido con
Next.js, Prisma (SQLite) y Tailwind CSS.

## Características

- Catálogo público con búsqueda, filtro por categoría y ficha de producto
  con botón de pedido por WhatsApp.
- Carrito de compras: agrega varios productos, ajusta cantidades y envía
  todo el pedido en un solo mensaje de WhatsApp. Incluye una animación de
  "producto volando al carrito" al agregar.
- Sección de "Ofertas del día" que muestra automáticamente los productos
  con descuento, más un filtro rápido "Ofertas" en el catálogo.
- Panel de administración protegido con contraseña para agregar, editar,
  ocultar y eliminar productos.
- Subida de imágenes de producto y logo de la tienda.
- Configuración de nombre de tienda, frase, número de WhatsApp y color
  de marca desde el panel.
- Base de datos SQLite local (no requiere instalar un servidor de base
  de datos aparte).

## Primeros pasos

Copia el archivo de variables de entorno de ejemplo y complétalo (ver
[Cambiar la contraseña de administrador](#cambiar-la-contraseña-de-administrador)
para generar `ADMIN_PASSWORD_HASH_B64`):

```bash
cp .env.example .env
```

Instala las dependencias (ya están instaladas si acabas de recibir este
proyecto):

```bash
npm install
```

Crea la base de datos (ya está creada y con datos de ejemplo si acabas de
recibir este proyecto):

```bash
npm run db:migrate
npm run db:seed
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el catálogo, y
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) para
entrar al panel de administración.

**Contraseña de administrador por defecto:** `admin123`

## Cambiar la contraseña de administrador

```bash
node scripts/hash-password.js "tu-nueva-contraseña"
```

El comando imprime una línea `ADMIN_PASSWORD_HASH_B64="..."`. Copia esa línea
y reemplaza la que ya existe en tu archivo `.env`, luego reinicia el servidor.

> El hash se guarda codificado en base64 porque Next.js interpreta el signo
> `$` en archivos `.env` como referencias a variables, lo cual corrompería un
> hash de bcrypt normal (que siempre empieza con `$2b$...`).

## Configurar tu tienda

Desde `/admin/configuracion` puedes cambiar:

- Nombre de la tienda y frase corta
- Número de WhatsApp (con código de país, solo dígitos, ej. `50688887777`
  para Costa Rica)
- Logo
- Color principal del sitio

## Poner un producto en oferta

Al agregar o editar un producto, llena el campo **"Precio antes de
descuento"** con un valor mayor al precio actual. El producto aparecerá
automáticamente en la sección "Ofertas del día" de la portada, con su
badge de porcentaje de descuento y el precio anterior tachado. Deja ese
campo vacío para quitarlo de ofertas.

## Estructura del proyecto

```
prisma/schema.prisma      Modelos de datos (Product, Settings)
prisma/seed.js            Datos de ejemplo
src/app/                  Páginas (App Router de Next.js)
src/app/api/               Rutas de API (productos, configuración, subida, sesión)
src/app/admin/             Panel de administración
src/components/           Componentes de la tienda pública
src/components/admin/     Componentes del panel de administración
src/lib/                  Prisma, autenticación, utilidades
public/uploads/           Imágenes subidas desde el panel
scripts/hash-password.js  Genera el hash de una nueva contraseña
```

## Notas sobre el hosting / despliegue

- Las imágenes subidas se guardan en `public/uploads` en el disco del
  servidor. Esto funciona en un servidor tradicional (VPS, tu propia
  máquina, Railway, Render, etc.), pero **no funciona en plataformas
  serverless como Vercel**, donde el sistema de archivos es de solo
  lectura. Si despliegas ahí, deberás adaptar la subida de imágenes a un
  almacenamiento externo (S3, Cloudinary, Vercel Blob, etc.).
- La base de datos es un archivo SQLite (`dev.db`) en la raíz del
  proyecto. Para producción con más de un usuario administrando al mismo
  tiempo, considera migrar a PostgreSQL cambiando el `provider` en
  `prisma/schema.prisma` y el adaptador en `src/lib/prisma.ts`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila la app para producción |
| `npm run start` | Sirve la app ya compilada |
| `npm run db:migrate` | Aplica cambios al esquema de la base de datos |
| `npm run db:seed` | Carga productos de ejemplo |
| `npm run db:studio` | Abre Prisma Studio para ver/editar datos con una interfaz visual |
