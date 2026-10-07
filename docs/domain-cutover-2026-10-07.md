# Cambio de dominio: siguenetwork.org

## Arquitectura

Cloudflare conserva la zona DNS y recibe todo el tráfico de `siguenetwork.org`.
El registro A raíz permanece en GoDaddy. El Worker `sigue-wordpress-bridge`
envía las páginas públicas a `sigue-members.vercel.app`, cuyo certificado Vercel ya
está activo. WordPress permanece para su administración y archivos antiguos.
La aplicación Next.js y Supabase publican el inicio, las páginas institucionales,
el blog, los eventos, los recursos y los formularios nuevos.

| Destino | Rutas |
| --- | --- |
| Next.js | `/`, `/es/*`, `/en/*`, `/blog`, `/eventos`, `/contacto`, `/recursos`, `/herramientas-y-guias`, páginas institucionales y las 60 redirecciones históricas de artículos/eventos |
| WordPress | `/wp-admin/*`, `/wp-login.php`, `/wp-json/*`, `/wp-content/*` y demás rutas técnicas `/wp-*` necesarias para el administrador y medios antiguos |
| Retiradas (HTTP 410) | `/producto/*`, tienda, carrito, pago, cuenta, organizadores/sedes y sitemaps antiguos de WordPress |

Las variantes antiguas con prefijo `/es/` o `/en/` de las rutas retiradas
también devuelven 410. Los 12 productos de muestra de 2016 se enviaron a la
papelera de WordPress; no se eliminaron definitivamente.

El Worker deja `/wp-content/*` en GoDaddy para preservar los enlaces antiguos.
Las 29 imágenes y documentos que la app referenciaba directamente ya se sirven
desde `/legacy-media/*` en Vercel. La biblioteca de WordPress conserva 639
archivos en total; antes de apagar el hosting hay que decidir qué enlaces
antiguos deben mantenerse. **No se debe cancelar el hosting de GoDaddy ni
WordPress** mientras sigan alojados allí el administrador y los medios antiguos.
La zona DNS contiene MX, SPF, DKIM y DMARC de Google; el cambio del registro
web no modifica esos registros.

## SEO

- La app publica `/sitemap.xml` con las secciones institucionales en español e
  inglés, artículos, eventos, series y etiquetas. `robots.txt` anuncia solo ese
  mapa; los sitemaps antiguos de WordPress devuelven 410.
- Los cinco enlaces de sección que Google mostraba en la captura (Recursos,
  Conoce SIGUE, Únete, Miembros SIGUE, Herramientas y Guías) siguen teniendo
  páginas accesibles, enlaces internos y entradas en el sitemap nuevo.
- Las 60 URLs anteriores de artículos/eventos usan redirecciones permanentes a
  sus nuevas rutas localizadas. Los canonical y `hreflang` nuevos usan
  `https://siguenetwork.org`. Google decide si y cuándo muestra sitelinks; no
  existe una configuración que garantice conservar exactamente su presentación.
- Las URLs de productos y las otras rutas públicas de WordPress sin sustituto
  devuelven 410 y `X-Robots-Tag: noindex`; no se redirigen a una página distinta.

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
   una redirección de blog, 410 en `/producto/reed-fan/` y
   `/event-organizers/`, acceso a `/wp-admin/`, un medio de `/wp-content/` y `www`.
5. Vigilar `/sitemap.xml` en Search Console, 404, formularios, pagos y logs de
   Cloudflare/Vercel. Los correos automáticos de formularios requieren
   configurar el proveedor de email y el cron.

El 7 de octubre se confirmó que Sandra Prieto ya tiene una propiedad de prefijo
`https://siguenetwork.org/` en Search Console. Se envió `/sitemap.xml` y se
solicitó indexar `/es`. La prueba en vivo de Google pudo acceder a ambos; el
informe del sitemap mostró `Couldn't fetch` inmediatamente después del envío,
pero el 7 de octubre cambió a **Success** con 202 páginas descubiertas.
Se retiró de Search Console el envío antiguo de `/wp-sitemap.xml`; solo queda
`/sitemap.xml`. La indexación histórica (83 páginas indexadas y 97 no indexadas)
tenía fecha de actualización del 3 de octubre, anterior a este cambio.

## Evaluación para reducir GoDaddy

GoDaddy puede continuar como registrador del dominio aunque el hosting de
WordPress se retire. La cuenta autenticada de Sandra muestra que
`siguenetwork.org`, `sandraprieto.org` y `sp-act.education` comparten **una**
cuenta de Web Hosting Ultimate (cPanel), cuyo dominio principal es
`sp-act.education`. Por tanto, retirar SIGUE del hosting no elimina el costo
del plan mientras los otros dos sitios lo usen. En particular,
`sandraprieto.org` figura con una instalación de WordPress 5.7.11.
La comprobación pública de DNS matiza este inventario: `sandraprieto.org`
apunta a `162.241.203.121`, con servidores de nombres HostGator, no al
origen GoDaddy de SIGUE (`107.180.26.71`); `sp-act.education` no resuelve
actualmente. Las copias de ambos sitios en cPanel podrían ser antiguas o de
reserva. La portada de Sandra en el origen GoDaddy tiene una modificación
distinta de la portada pública y el certificado del origen está vencido;
son más indicios de una copia antigua. El usuario indicó que Sandra es el
único sitio adicional que necesita conservar, pero SIGUE **sí depende hoy** de
WordPress para administración y medios antiguos. Confirmar que las copias de
Sandra y SP-ACT no
ejecutan procesos ni sirven correos necesarios antes de retirar el hosting
cuando SIGUE ya no dependa de WordPress.

El 7 de octubre de 2026 el panel mostró 2,91 GB de disco, 99.750 de 250.000
archivos, 494,69 MB de bases de datos y una copia automática reciente de
2,62 GB. La renovación del hosting figura para el **27 de octubre de 2026**.
En el selector de GoDaddy, Ultimate cuesta **$26,99/mes** y Deluxe
**$19,99/mes**. El ahorro nominal de cambiar a Deluxe sería $7/mes antes de
impuestos o prorrateos. Los límites publicados por GoDaddy para Deluxe son
50 GB de disco, 250.000 archivos, 1 GB de RAM y un núcleo de CPU; el uso de
disco y archivos actual cabe, pero hay que comprobar el rendimiento de los
tres sitios y disponer de una copia restaurable antes de rebajar. El cambio
podría afectar al origen web y a su IP; verificar el registro A de Cloudflare
y las tres webs inmediatamente después. La confirmación de GoDaddy indica que
la reducción sería **inmediata** pero el nuevo precio se cobraría recién en
la renovación del 27 de octubre; GoDaddy recomienda hacerla cerca de esa
fecha. Se cerró la confirmación sin aplicar el cambio el 7 de octubre.

Hay además una suscripción separada de **Respaldo de sitio web Essential de
5GB**, a **$3,99/mes**, también con fecha del 27 de octubre. En el panel de
seguridad aparece como **un plan disponible para configurar**, sin dominio
asignado. El hosting ya tiene su propia copia automática. Verificar el alcance
y la retención de esa copia y, si nadie necesita el producto separado,
cancelar únicamente el respaldo Essential. El ahorro nominal adicional sería
$3,99/mes. `Páginas Web + Marketing` de SIGUE es gratuito; no justifica un
cambio de plan. El dominio `siguenetwork.org` y su protección total se
renuevan el 12 de enero de 2029 y pueden seguir en GoDaddy.

GoDaddy advierte que PHP 8.2 en este hosting requerirá soporte extendido de
pago a partir de la próxima renovación. Antes de esa fecha, actualizar la
versión de PHP compatible con **los tres sitios**, con prueba de páginas,
formularios y administración, para evitar el cargo y mantener seguridad.
La instalación WordPress de Sandra debe revisarse especialmente por su
antigüedad. No aplicar una versión de PHP a todo el cPanel sin esa prueba.
Referencias de GoDaddy: [límites de recursos](https://www.godaddy.com/en-ca/help/resource-limits-12001),
[cambio de versión de PHP](https://www.godaddy.com/es-es/help/ver-o-cambiar-la-version-php-para-mi-web-hosting-cpanel-16090)
y [tipos de respaldo](https://www.godaddy.com/en/help/what-is-a-website-backup-20318).

WooCommerce muestra cero pedidos. Sus 12 productos eran entradas del tema de
2016 y están en la papelera; los listados de organizadores y sedes tienen cero registros. En Search
Console, del 5 de julio al 4 de octubre, cinco URL de productos tuvieron cero
clics y 11 impresiones; cinco rutas de organizadores, sedes y paneles tuvieron
cero clics y 16 impresiones. El usuario confirmó el retiro de estas rutas públicas.
El siguiente paso es inventariar y migrar o preservar los medios restantes,
probar `/wp-admin/` y definir dónde alojarlo antes de retirar el hosting.
Una vez que el administrador y los enlaces a medios ya no dependan del origen
GoDaddy, se podrá conectar el dominio raíz directamente a Vercel en Cloudflare,
verificar su certificado y retirar el Worker puente. GoDaddy seguirá siendo
el registrador del dominio; los registros de correo no se deben modificar.

Si alguna ruta crítica falla, quitar la ruta Worker `siguenetwork.org/*` en
Cloudflare. El registro A raíz seguirá sirviendo WordPress. No cambiar MX al
revertir. El 7 de octubre se probó el CNAME directo hacia Vercel y produjo 525
en páginas nuevas por falta de certificado para el dominio raíz; se revirtió
el DNS y se confirmó respuesta 200 en Inicio, Recursos y un producto. Ese
producto se retiró posteriormente por decisión del usuario.

## Estado de la importación final

El 7 de octubre de 2026 el inventario verificó 46 blogs, 14 eventos, 12
etiquetas usadas, un comentario y 49 imágenes. La última aplicación actualizó
46 blogs, 12 etiquetas y un comentario; omitió los 14 eventos ya sincronizados;
no creó duplicados ni registró errores. Las cuatro plantillas de captación
(`novedades`, `voluntariado-interes`, `membresia-interes`, `cumbre-alianzas`)
existen en la base de datos de producción.
