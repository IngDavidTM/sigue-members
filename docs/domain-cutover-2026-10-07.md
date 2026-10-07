# Cambio de dominio: siguenetwork.org

## Arquitectura

Cloudflare conserva la zona DNS y recibe todo el tráfico de `siguenetwork.org`.
El registro A raíz permanece en GoDaddy. El Worker `sigue-wordpress-bridge`
envía las páginas nuevas a `sigue-members.vercel.app`, cuyo certificado Vercel ya
está activo, y deja las rutas antiguas en el origen WordPress. La aplicación Next.js
y Supabase publican el inicio, las páginas institucionales, el blog, los eventos,
los recursos y los formularios nuevos.

| Destino | Rutas |
| --- | --- |
| Next.js | `/`, `/es/*`, `/en/*`, `/blog`, `/eventos`, `/contacto`, `/recursos`, `/herramientas-y-guias`, páginas institucionales y las 60 redirecciones históricas de artículos/eventos |
| WordPress | `/producto/*` (12 productos), `/event-organizers/*`, `/event-venues/*`, `/my-calendar/*`, `/organizer-dashboard/*`, `/venue-dashboard/*`, `/submit-organizer-form/*`, `/submit-venue-form/*`, `/confirmacion-de-donacion/*`, rutas de carrito/checkout/cuenta, `/wp-*`, `/wp-json/*` y sitemaps antiguos de Rank Math |

Las variantes antiguas con prefijo `/es/` o `/en/` de esas rutas se redirigen
permanentemente a su única URL WordPress sin prefijo.

El Worker deja `/wp-content/*` en GoDaddy para preservar los enlaces antiguos.
Las 29 imágenes y documentos que la app referenciaba directamente ya se sirven
desde `/legacy-media/*` en Vercel. La biblioteca de WordPress conserva 639
archivos en total; antes de apagar el hosting hay que decidir qué enlaces
antiguos deben mantenerse. **No se debe cancelar el hosting de GoDaddy ni
WordPress** mientras el Worker siga enviando productos y otras rutas allí.
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

1. Mantener `NEXT_PUBLIC_SITE_URL` apuntando a `https://siguenetwork.org`.
   `app.siguenetwork.org` redirige con 308 al dominio raíz desde Vercel;
   `www.siguenetwork.org` redirige con 301 al raíz desde WordPress. Los
   dominios raíz y `www` pueden figurar como `Invalid Configuration` en Vercel
   porque el DNS raíz sigue en GoDaddy y el Worker conecta la app mediante
   `sigue-members.vercel.app`.
2. Publicar la rama probada en `main`; esperar a que el despliegue de Vercel esté
   Ready. El repo contiene `wrangler.toml` y la fuente del Worker actualmente
   publicado en Cloudflare.
3. Mantener el registro A raíz en `107.180.26.71`, con proxy naranja, y activar
   la ruta Worker `siguenetwork.org/*`. El Worker usa la conexión TLS del
   dominio de producción de Vercel para servir las páginas nuevas bajo el raíz.
   La URL pública funciona por el Worker aunque el dominio raíz no tenga una
   conexión DNS directa con Vercel.
4. Comprobar `/es`, `/en`, `/sitemap.xml`, `/robots.txt`, `/recursos`, `/blog`,
   una redirección de blog, `/producto/reed-fan/`, `/event-organizers/`,
   `/wp-admin/`, `/wp-content/` y `www` con HTTP, títulos y canonical correctos.
5. Vigilar `/sitemap.xml` en Search Console, 404, formularios, pagos y logs de
   Cloudflare/Vercel. Los correos automáticos de formularios requieren
   configurar el proveedor de email y el cron.

El 7 de octubre se confirmó que Sandra Prieto ya tiene una propiedad de prefijo
`https://siguenetwork.org/` en Search Console. Se envió `/sitemap.xml` y se
solicitó indexar `/es`. La prueba en vivo de Google pudo acceder a ambos; el
informe del sitemap aún mostraba `Couldn't fetch` inmediatamente después del
envío. `/wp-sitemap.xml` permanece registrado mientras se resuelve el retiro
de WordPress. La indexación histórica (83 páginas indexadas y 97 no indexadas)
tenía fecha de actualización del 3 de octubre, anterior a este cambio.

## Evaluación para reducir GoDaddy

GoDaddy puede continuar como registrador del dominio aunque el hosting de
WordPress se retire. El plan contratado, su consumo de almacenamiento y precio
de renovación no se pudieron leer: la cuenta de GoDaddy requiere inicio de
sesión y bloqueó el navegador automatizado. No recomendar una rebaja concreta
sin esos datos; cambiar de plan podría modificar la IP de origen.

WooCommerce muestra cero pedidos. Sus 12 productos son entradas del tema de
2016; los listados de organizadores y sedes tienen cero registros. En Search
Console, del 5 de julio al 4 de octubre, cinco URL de productos tuvieron cero
clics y 11 impresiones; cinco rutas de organizadores, sedes y paneles tuvieron
cero clics y 16 impresiones. Antes de eliminar estas rutas, confirmar si SIGUE
piensa usarlas y decidir redirecciones o sustitutos. Migrar o preservar los
medios restantes y probar todas las rutas críticas antes de retirar el hosting.

Si alguna ruta crítica falla, quitar la ruta Worker `siguenetwork.org/*` en
Cloudflare. El registro A raíz seguirá sirviendo WordPress. No cambiar MX al
revertir. El 7 de octubre se probó el CNAME directo hacia Vercel y produjo 525
en páginas nuevas por falta de certificado para el dominio raíz; se revirtió
el DNS y se confirmó respuesta 200 en Inicio, Recursos y un producto.

## Estado de la importación final

El 7 de octubre de 2026 el inventario verificó 46 blogs, 14 eventos, 12
etiquetas usadas, un comentario y 49 imágenes. La última aplicación actualizó
46 blogs, 12 etiquetas y un comentario; omitió los 14 eventos ya sincronizados;
no creó duplicados ni registró errores. Las cuatro plantillas de captación
(`novedades`, `voluntariado-interes`, `membresia-interes`, `cumbre-alianzas`)
existen en la base de datos de producción.
