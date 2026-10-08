# SIGUE: salida de WordPress y GoDaddy

Estado comprobado el 8 de octubre de 2026.

## Sitio público

- `siguenetwork.org` es un **Custom Domain** del Worker de Cloudflare `sigue-wordpress-bridge`. El Worker envía la web pública a `sigue-members.vercel.app`. Ya no existe el registro A raíz hacia GoDaddy.
- `www.siguenetwork.org/*` ejecuta el mismo Worker y responde 308 hacia el dominio sin `www`.
- `wp.siguenetwork.org/*` sigue apuntando al alojamiento GoDaddy únicamente para el administrador de WordPress y sus recursos técnicos. `/wp-admin/*` y `/wp-login.php` en el dominio principal redirigen allí. Las demás rutas técnicas públicas de WordPress devuelven 410.
- Los MX, SPF, DKIM y DMARC de Google no se modificaron. GoDaddy sigue siendo el registrador de `siguenetwork.org`.
- Las rutas de productos, tienda, organizadores y sedes sin sustituto devuelven 410. Los 12 productos de muestra de WooCommerce quedaron en la papelera; no hay pedidos. La confirmación de donación se sirve desde la app y no afirma que un pago se completó sin verificarlo.

## Datos y enlaces que se conservan

- La app contiene los 29 archivos de WordPress que aún utiliza directamente en `public/legacy-media`. Otros 48 medios importados de blog y eventos están en Supabase `content-media`. `data/wordpress-essential-media.json` mantiene 77 URL antiguas: `GET` y `HEAD` de esas rutas responden 308 a su nueva ubicación; otras rutas `/wp-content/*` responden 410. No se copió la biblioteca completa de 639 entradas.
- La selección se basó en las referencias de la app y los medios del contenido importado. En Search Console, la búsqueda de imágenes de los últimos tres meses mostró 0 clics y 488 impresiones; el informe de enlaces externos mostró 6 enlaces, todos a la portada y ninguno directo a medios. Esto reduce el riesgo de dejar archivos sin migrar, pero no demuestra que ningún tercero los utilice.
- Se importaron a Supabase 46 blogs, 14 eventos, 12 etiquetas, un comentario y las 49 imágenes originales utilizadas por ese contenido (48 destinos únicos después de deduplicar). Las 202 URL del sitemap se comprobaron sin referencias `wp-content` en el HTML.
- Los formularios vigentes de Descargas y Contacto están replicados en la app. Se importaron 34 respuestas humanas históricas a la tabla privada de Supabase, con autorización del usuario; se excluyeron IP y agente del navegador. Los nuevos envíos se almacenan en Supabase. Los avisos por correo quedan pendientes hasta configurar Resend y un cron autenticado, por decisión del usuario.
- `/sitemap.xml` se envió a Search Console y mostró **Success**, con 202 páginas descubiertas. Las cinco secciones que Google mostraba como enlaces del sitio tienen páginas, enlaces internos y entradas en el sitemap nuevo. Las 60 URL históricas de artículos y eventos redirigen a sus páginas nuevas. Google decide qué enlaces del sitio muestra.

## GoDaddy: plan y decisión pendiente

- La cuenta muestra **Web Hosting Ultimate** para el cPanel cuyo dominio principal es `sp-act.education`, con renovación el **27 de octubre de 2026**. En el selector, Ultimate figura a **USD 26,99/mes** y Deluxe a **USD 19,99/mes**. También hay un **Respaldo Essential de 5 GB** por **USD 3,99/mes**, con la misma fecha. Los importes pueden variar por impuestos o condiciones de renovación.
- El dominio `siguenetwork.org` y su protección se renuevan en enero de 2029; se pueden conservar en GoDaddy sin pagar alojamiento WordPress. `Páginas Web + Marketing` de SIGUE aparece gratuito.
- En el cPanel figuran copias de `sandraprieto.org` y `sp-act.education`. Sin embargo, el DNS público de Sandra apunta a HostGator (`162.241.203.121`) y `sp-act.education` no resuelve. Esto **sugiere** que el cPanel de GoDaddy no sirve esas webs públicas, pero no prueba que no contenga procesos, correo o copias necesarias. La sesión de cPanel caducó, así que esa comprobación final sigue pendiente.
- **Recomendación:** si el inventario final confirma que no hay uso oculto, cancelar Web Hosting Ultimate y el respaldo Essential en vez de bajar a Deluxe. A los precios vistos, evitaría hasta USD 30,98/mes. Si se necesita mantener alguna instalación en ese cPanel, Deluxe ahorraría solo USD 7/mes y debe probarse antes de cambiarlo. No se cambió ni canceló ningún plan.
- La cuenta también muestra un SSL Standard de `sandraprieto.org` con renovación en marzo de 2027; el certificado público actual es Let's Encrypt en HostGator. Verificar si esa suscripción se usa antes de renovarla.

## Para apagar WordPress y el hosting

1. Confirmar en cPanel y en la cuenta GoDaddy que las copias de Sandra y SP-ACT, tareas programadas, buzones y respaldos allí no se usan. La sesión de GoDaddy abrió Facturación, pero el enlace de cPanel volvió a pedir inicio de sesión.
2. Conservar fuera de ese hosting cualquier respaldo mínimo que se decida retener. El ZIP de `wp-content/uploads` de 577,47 MB creado el 7 de octubre está **en el mismo servidor**; desaparecería al cancelar el alojamiento. Los 77 enlaces seleccionados ya no dependen de ese ZIP.
3. Cuando no haga falta el administrador `wp.siguenetwork.org`, retirar su ruta Worker, su DNS y las redirecciones de administración del Worker. Comprobar entonces portada, formularios, blog, eventos, sitemap, `www`, los enlaces antiguos conservados y las respuestas 410.
4. Cancelar solo el alojamiento y el respaldo Essential si el paso 1 confirma que no sirven a otro sitio. Conservar el dominio, la protección deseada y los registros de correo en GoDaddy/Cloudflare.

Para revertir el cambio de origen web, restaurar el A raíz proxied `107.180.26.71` en Cloudflare, quitar el Custom Domain raíz del Worker y volver a asociar la ruta `siguenetwork.org/*`; la instalación WordPress sigue disponible en GoDaddy por ahora. No cambiar MX durante una reversión.

Referencias técnicas: [Custom Domains de Cloudflare](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) y [certificados de Vercel antes de mover DNS](https://vercel.com/docs/domains/pre-generating-ssl-certs). La web queda en Cloudflare como origen porque Vercel todavía no tiene certificado válido para `siguenetwork.org` ni `www`, y su panel marca esos dominios como configuración inválida. Se verificó que el Worker y Vercel funcionan mediante el alias con certificado válido.
