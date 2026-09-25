# Catálogo Virtual

Catálogo de productos en línea con panel de administración. Construido con
Next.js, Prisma (PostgreSQL) y Tailwind CSS. Listo para desplegar en Vercel.

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
- Subida de imágenes de producto, logo y banner de la tienda (a Vercel Blob
  en producción, a `public/uploads` en desarrollo local).
- Configuración de nombre de tienda, frase, número de WhatsApp y color
  de marca desde el panel.

## Primeros pasos (desarrollo local)

Necesitas una base de datos Postgres. La forma más simple y gratuita es
[Neon](https://neon.tech): crea una cuenta, crea un proyecto, y copia la
cadena de conexión que te den (empieza con `postgresql://...`).

Copia el archivo de variables de entorno de ejemplo y complétalo:

```bash
cp .env.example .env
```

Pega tu cadena de conexión de Neon en `DATABASE_URL`, genera un `JWT_SECRET`
y un `ADMIN_PASSWORD_HASH_B64` (ver
[Cambiar la contraseña de administrador](#cambiar-la-contraseña-de-administrador)).

Instala las dependencias (ya están instaladas si acabas de recibir este
proyecto):

```bash
npm install
```

Crea las tablas en tu base de datos:

```bash
npm run db:migrate
```

Carga productos de ejemplo (opcional):

```bash
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

## Desplegar en Vercel

### 1. Base de datos: Neon (Postgres)

1. Crea una cuenta en [neon.tech](https://neon.tech) (tiene plan gratuito).
2. Crea un proyecto y una base de datos.
3. En el dashboard de Neon, copia la cadena de conexión **pooled**
   (la que dice "Pooled connection" — incluye `-pooler` en el host). Usar la
   versión con pool evita quedarte sin conexiones disponibles, ya que Vercel
   ejecuta tu app como funciones serverless que abren conexiones nuevas con
   frecuencia.

### 2. Sube el código a GitHub

Si aún no lo has hecho, sube este proyecto a un repositorio de GitHub.

### 3. Crea el proyecto en Vercel

1. En [vercel.com](https://vercel.com), "Add New" → "Project" → importa tu
   repositorio de GitHub.
2. En "Environment Variables" agrega:
   - `DATABASE_URL`: la cadena pooled de Neon del paso 1.
   - `JWT_SECRET`: genera una con
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ADMIN_PASSWORD_HASH_B64`: genera el tuyo con
     `node scripts/hash-password.js "tu-contraseña"`.
3. Despliega.

### 4. Conecta Vercel Blob (para las imágenes)

1. En tu proyecto de Vercel, ve a "Storage" → "Create Database" → "Blob".
2. Al conectarlo a tu proyecto, Vercel agrega automáticamente la variable
   `BLOB_READ_WRITE_TOKEN` — no necesitas copiarla a mano.
3. Vuelve a desplegar el proyecto (Deployments → ⋯ → Redeploy) para que la
   nueva variable esté disponible.

### 5. Crea las tablas en producción

Desde tu máquina, con el `DATABASE_URL` de producción en tu `.env` local
(puedes copiarlo temporalmente, o usar `vercel env pull`):

```bash
npm run db:deploy
```

(`db:deploy` usa `prisma migrate deploy`, pensado para aplicar migraciones ya
creadas sin hacer preguntas — a diferencia de `db:migrate`, que es solo para
desarrollo local.)

### 6. (Opcional) Recupera tus productos si ya usabas la versión con SQLite

Si venías usando este proyecto con la base de datos SQLite local y quieres
llevar tus productos y configuración a la nueva base de datos en Neon:

```bash
node -e "const D=require('better-sqlite3');const db=new D('dev.db',{readonly:true});require('fs').writeFileSync('prisma/data-export.json',JSON.stringify({products:db.prepare('SELECT * FROM Product').all(),settings:db.prepare('SELECT * FROM Settings').all()},null,2))"
node scripts/import-data.js
```

(El primer comando necesita `npm install better-sqlite3 --no-save` antes de
correr, solo para esta migración puntual.)

## Cambiar la contraseña de administrador

```bash
node scripts/hash-password.js "tu-nueva-contraseña"
```

El comando imprime una línea `ADMIN_PASSWORD_HASH_B64="..."`. Copia esa línea
y reemplaza la que ya existe en tu archivo `.env` (o en las variables de
entorno de Vercel), luego reinicia el servidor / vuelve a desplegar.

> El hash se guarda codificado en base64 porque Next.js interpreta el signo
> `$` en archivos `.env` como referencias a variables, lo cual corrompería un
> hash de bcrypt normal (que siempre empieza con `$2b$...`).

## Configurar tu tienda

Desde `/admin/configuracion` puedes cambiar:

- Nombre de la tienda y frase corta
- Número de WhatsApp (con código de país, solo dígitos, ej. `50688887777`
  para Costa Rica)
- Logo y banner principal
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
public/uploads/           Imágenes subidas en desarrollo local
scripts/hash-password.js  Genera el hash de una nueva contraseña
scripts/import-data.js    Importa datos exportados de una base anterior
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila la app para producción |
| `npm run start` | Sirve la app ya compilada |
| `npm run db:migrate` | Crea/aplica migraciones en desarrollo local |
| `npm run db:deploy` | Aplica migraciones existentes en producción |
| `npm run db:seed` | Carga productos de ejemplo |
| `npm run db:studio` | Abre Prisma Studio para ver/editar datos con una interfaz visual |
