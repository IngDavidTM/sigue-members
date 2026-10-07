# Cambio de dominio: siguenetwork.org

## Arquitectura

Cloudflare conserva la zona DNS y recibe todo el tráfico de `siguenetwork.org`.
El Worker `sigue-wordpress-bridge` enruta la mayoría de las solicitudes a Vercel.
Las rutas que todavía necesitan WordPress se envían al origen de GoDaddy mediante
`wp-origin.siguenetwork.org`, sin cambiar el `Host` público. La aplicación Next.js
y Supabase publican el inicio, las páginas institucionales, el blog, los eventos,
los recursos y los formularios nuevos.

| Destino | Rutas |
| --- | --- |
| Next.js | `/`, `/es/*`, `/en/*`, `/blog`, `/eventos`, `/contacto`, `/recursos`, `/herramientas-y-guias`, páginas institucionales y las 60 redirecciones históricas de artículos/eventos |
| WordPress | `/producto/*` (12 productos), `/event-organizers/*`, `/event-venues/*`, `/my-calendar/*`, `/organizer-dashboard/*`, `/venue-dashboard/*`, `/submit-organizer-form/*`, `/submit-venue-form/*`, `/confirmacion-de-donacion/*`, rutas de carrito/checkout/cuenta, `/wp-*`, `/wp-json/*` y sitemaps antiguos de Rank Math |

El Worker también deja las imágenes en `/wp-content/*` en GoDaddy: todavía hay
imágenes institucionales referenciadas por la app. Por ello **no se debe cancelar
el hosting de GoDaddy ni WordPress** hasta trasladar esas funciones y medios.
La zona DNS contiene MX, SPF, DKIM y DMARC de Google; el cambio del registro
web no modifica esos registros.

## SEO

- La app publica `/sitemap.xml` con las secciones institucionales en español e
  inglés, artículos, eventos, series y etiquetas. `robots.txt` anuncia ese mapa
  y `/product-sitemap.xml` de WordPress.
- Los cinco enlaces de sección que Google mostraba en la captura (Recursos,
  Conoce SIGUE, Únete, Miembros SIGUE, Herramientas y Guías) siguen teniendo
  páginas accesibles, enlaces internos y entradas en el sitemap nuevo.
- Las 60 URLs anteriores de artículos/eventos usan redirecciones permanentes a
  sus nuevas rutas localizadas. Los canonical y `hreflang` nuevos usan
  `https://siguenetwork.org`. Google decide si y cuándo muestra sitelinks; no
  existe una configuración que garantice conservar exactamente su presentación.
- Los sitemaps antiguos de WordPress quedan accesibles para que las URLs de
  productos no desaparezcan durante la transición.

## Operación y verificación

1. Mantener en Vercel `siguenetwork.org` en Production, `www.siguenetwork.org`
   como redirección 308 al dominio raíz y `NEXT_PUBLIC_SITE_URL` apuntando al raíz.
2. Publicar la rama probada en `main`; esperar a que el despliegue de Vercel esté
   Ready. El repo contiene `wrangler.toml` y la fuente del Worker actualmente
   publicado en Cloudflare.
3. Cambiar solo el registro A raíz en Cloudflare por el CNAME que Vercel indica
   para `siguenetwork.org`, conservando el proxy naranja. Dejar `wp-origin` hacia
   `107.180.26.71` y la ruta Worker `siguenetwork.org/*` activos.
4. Comprobar `/es`, `/en`, `/sitemap.xml`, `/robots.txt`, `/recursos`, `/blog`,
   una redirección de blog, `/producto/reed-fan/`, `/event-organizers/`,
   `/wp-admin/`, `/wp-content/` y `www` con HTTP, títulos y canonical correctos.
5. Solicitar el rastreo de `/sitemap.xml` en Search Console y vigilar 404,
   formularios, pagos y logs de Cloudflare/Vercel. Los correos automáticos de
   formularios requieren configurar el proveedor de email y el cron.

Si alguna ruta crítica falla, restaurar el registro A raíz de Cloudflare a
`107.180.26.71`. El Worker puede seguir activo: su destino principal volverá a
WordPress. No cambiar MX ni eliminar `wp-origin` al revertir.

## Estado de la importación final

El 7 de octubre de 2026 el inventario verificó 46 blogs, 14 eventos, 12
etiquetas usadas, un comentario y 49 imágenes. La última aplicación actualizó
46 blogs, 12 etiquetas y un comentario; omitió los 14 eventos ya sincronizados;
no creó duplicados ni registró errores. Las cuatro plantillas de captación
(`novedades`, `voluntariado-interes`, `membresia-interes`, `cumbre-alianzas`)
existen en la base de datos de producción.
