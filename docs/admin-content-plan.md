# Administración de contenido de SIGUE Network

## Objetivo

Convertir el login actual de Supabase en la entrada a dos experiencias autorizadas:

- `user`: conserva el dashboard de usuario.
- `admin`: accede a un panel editorial para gestionar series, blogs, comentarios, eventos, lugares y medios.

La autorización se valida en el servidor y en Row Level Security (RLS). Ocultar enlaces no se considera una medida de seguridad.

## Hallazgos de las referencias oficiales

### Blog

La portada necesita hero, cuadrícula de publicaciones, miniatura, título, filtros editoriales y paginación. La página individual requiere:

- título, slug, fecha, autor y tiempo estimado de lectura;
- miniatura/imagen destacada y texto alternativo;
- extracto y contenido enriquecido;
- serie jerárquica (serie padre e hijos) y etiquetas;
- publicaciones recientes y contenido relacionado;
- compartir en redes;
- comentarios públicos con moderación;
- SEO: título y descripción, canonical, palabra clave, robots, Open Graph y Twitter Card.

### Eventos

La portada necesita separar automáticamente próximos y pasados. Cada tarjeta y detalle requiere:

- fecha y hora de inicio y fin, sin duraciones predeterminadas;
- zona horaria y opción de día completo;
- modalidad presencial, virtual o híbrida;
- lugar reutilizable o URL virtual;
- imagen, extracto, descripción, agenda y organizador;
- enlace de registro, fecha límite y capacidad opcional;
- estados borrador, publicado, cancelado y archivado;
- SEO y datos estructurados `Event`.

## Modelo de datos

### Identidad y autorización

- `profiles`: perfil de `auth.users` y rol `user | admin`.
- `is_admin()`: función `security definer` utilizada por RLS.
- El alta crea siempre un usuario normal. La promoción a administrador solo se hace con credenciales de servicio o SQL administrativo.

### Blogs

- `blog_series`: árbol editorial mediante `parent_id`.
- `blog_series_translations`: nombre, slug y descripción por idioma.
- `blog_posts`: estado, serie, autor, imagen, publicación y comentarios.
- `blog_post_translations`: título, slug, extracto, HTML y SEO por idioma.
- `blog_tags`, `blog_tag_translations`, `blog_post_tags`: clasificación adicional.
- `blog_comments`: comentarios anidados y estados `pending | approved | spam | rejected`.

### Eventos

- `event_venues`: lugares reutilizables con dirección, mapa y coordenadas opcionales.
- `events`: fechas UTC, zona horaria, modalidad, registro, capacidad y estado.
- `event_private_access`: enlaces virtuales privados, protegidos por RLS.
- `public_event_access`: solo expone el enlace cuando el administrador lo autoriza.
- `event_translations`: título, slug, contenido, agenda y SEO por idioma.

### Medios

- Bucket público `content-media` de Supabase Storage.
- Solo administradores pueden subir, reemplazar o borrar archivos.
- Las imágenes guardan URL y texto alternativo; el contenido no depende de archivos locales del despliegue.

## Reglas editoriales

- Español e inglés son obligatorios antes de guardar para evitar experiencias inconsistentes.
- Un slug es único por tipo de contenido e idioma.
- Los borradores nunca son visibles para usuarios anónimos.
- Una publicación programada solo se vuelve pública desde `published_at`.
- Los comentarios nuevos quedan pendientes hasta ser aprobados.
- Las fechas se guardan en UTC y se presentan con la zona horaria configurada.
- Un evento publicado debe cumplir los campos de su modalidad: lugar para presencial, URL para virtual y ambos para híbrido.
- El HTML se valida y sanea en el servidor antes de almacenarse.

## Fases de entrega

1. Migración, tipos, roles, RLS, Storage y promoción segura de administradores.
2. Layout protegido del administrador, dashboard y navegación.
3. CRUD de series y blogs con editor, traducciones, SEO, imágenes y etiquetas.
4. Portada/detalle público de blogs y comentarios moderados.
5. CRUD de lugares y eventos con fechas/modos dinámicos.
6. Portada/detalle público de eventos, datos estructurados y contenido relacionado.
7. Pruebas de permisos, responsive, accesibilidad, SEO y despliegue.

## Criterios de aceptación

- Un usuario normal no puede abrir rutas `/admin` ni mutar tablas editoriales.
- Un administrador puede crear, guardar como borrador, editar, publicar, programar y archivar.
- Los cambios publicados aparecen en las páginas públicas sin redesplegar Vercel.
- Los previews sociales, canonical, robots y JSON-LD corresponden al contenido guardado.
- Los eventos cambian automáticamente entre próximos y pasados según su fecha final.
- Las páginas públicas funcionan en ES/EN, móvil y escritorio sin desbordes.
