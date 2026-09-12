# SIGUE Network

Sitio público y panel de administración de SIGUE Network. El proyecto usa Next.js 16, Supabase, contenido bilingüe y un sistema configurable de formularios.

## Desarrollo local

Requiere Node.js 20.9 o posterior. Instala dependencias y copia la configuración de ejemplo:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Completa las variables públicas de Supabase para navegar el sitio y las variables de servidor para las operaciones administrativas. No uses `SUPABASE_SERVICE_ROLE_KEY` como clave pública.

## Comandos

```sh
npm run test:admin       # Validación, sanitización, formularios e imágenes
npm run test:admin:ui    # Editor y páginas reales en Chromium con datos aislados
npm run lint
npm run build
npm run migrate:wordpress       # Inventario sin escrituras
npm run migrate:wordpress:apply # Importación idempotente a Supabase
npm run content:english         # Revisa las traducciones importadas pendientes
npm run content:english:apply   # Aplica inglés sin pisar cambios editoriales
```

## Base de datos y despliegue

Aplica en orden los archivos de `supabase/migrations` antes de desplegar una versión que dependa de ellos. El procedimiento, variables, correo, cron y verificaciones están documentados en [docs/admin-content-production.md](docs/admin-content-production.md). El estado de la migración desde WordPress está en [docs/wordpress-migration-plan.md](docs/wordpress-migration-plan.md).

El panel vive bajo `/admin`. Los blogs, eventos, taxonomías, formularios, respuestas y comentarios se administran allí; Supabase conserva el contenido y los medios optimizados.
