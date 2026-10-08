# Blogs y eventos: preparación para producción

La edición se mantiene en `/admin/blogs` y `/admin/eventos`. No se requiere una clave de servicio en el navegador. Todas las acciones verifican la sesión y el rol administrador; las funciones de guardado conservan las políticas RLS.

## Despliegue

1. Copiar `.env.example` en el proveedor de despliegue y configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SITE_URL` con el dominio público definitivo. Esta última variable determina las URLs canónicas, los enlaces de idioma y el sitemap.
2. Aplicar todas las migraciones de `supabase/migrations` antes de desplegar el frontend nuevo. `202609110001` y `202609110002` aseguran el guardado del contenido; `202609110003` a `202609120002` crean los formularios, el guardado administrativo atómico, la cola de avisos, sus políticas públicas, la validación de valores estructurados y el límite de frecuencia. `202609120003` amplía la trazabilidad de importación a etiquetas y comentarios. El frontend anterior puede seguir funcionando durante este paso.
3. Desplegar con `npm ci` y `npm run build`. El procesamiento de imágenes usa el runtime Node.js.
4. Verificar en el proyecto real que el bucket público `content-media` existe, admite WebP/AVIF y permite subir únicamente a administradores; esas reglas se crean en las migraciones anteriores.
5. Con una cuenta administradora, crear un borrador de blog y un evento, subir una foto, guardar, abrir la vista previa, modificar y guardar de nuevo. Publicar contenido de prueba solo en staging. Verificar como visitante, sin sesión, las páginas en español e inglés, las imágenes y el sitemap.

Si falta la nueva migración, el admin muestra un mensaje específico al guardar. No debe desplegarse el frontend sin aplicarla.

## Uso del editor

- Las fotos se pueden subir en portada, redes sociales y dentro del texto. Se aceptan JPG, PNG, WebP y AVIF de hasta 8 MB. JPG/PNG se convierten a WebP en el navegador; el servidor valida, reorienta y optimiza las imágenes a un máximo de 2400 píxeles por lado. Los archivos originales demasiado grandes deben reducirse antes de subirlos.
- Dentro del texto, pulsar el botón de imagen o pegar una foto desde el portapapeles. Completar la descripción alternativa e insertar. Para cambiarla o quitarla, seleccionar la imagen y volver a pulsar el botón.
- El botón Guardar se bloquea durante las subidas. Una validación fallida conserva los campos y el contenido, abre el apartado con errores y dirige el foco al campo correspondiente.
- La vista previa es privada y muestra la última versión guardada, en español o inglés. También funciona con borradores.
- Si otra persona actualizó el registro después de abrirlo, se rechaza el guardado para evitar sobrescribirlo. Copiar los cambios pendientes y recargar antes de continuar.
- En blogs, dejar la fecha vacía al seleccionar Publicado publica en ese momento. Programado exige una fecha futura. Las publicaciones cuya programación ya se cumplió se editan como publicadas.
- La agenda del evento es opcional y puede vaciarse. Los eventos finalizados o cancelados no ofrecen inscripción; el enlace virtual privado solo se expone cuando se ha marcado su publicación.

## SEO

En cada idioma, abrir **SEO y datos para buscadores** para editar título, descripción, frase clave, canónica, título/descripción/imagen para redes, noindex y nofollow. Los blogs también permiten elegir Article, BlogPosting o NewsArticle. Si los campos SEO están vacíos, se usan el título/resumen y la portada. La frase clave sirve para analizar el contenido del editor; no se publica como una metaetiqueta de palabras clave.

Las páginas generan Open Graph, Twitter y datos estructurados. El sitemap excluye versiones noindex y contenido no publicado. Se invalida al guardar/archivar y se regenera como máximo cada cinco minutos para incorporar publicaciones programadas. Los cambios de idioma resuelven el slug de la otra traducción.

Al modificar manualmente un slug, la URL anterior deja de existir: conservarlo en contenido ya difundido o configurar una redirección antes de cambiarlo.

## Formularios y avisos

Los formularios y sus preguntas se administran en `/admin/formularios`; las respuestas, notas, estados y exportación CSV están en `/admin/respuestas`. La base de datos valida las preguntas obligatorias, tipos, opciones y tamaños aunque un envío no use la interfaz web. Cada respuesta se guarda antes de intentar enviar cualquier correo.

La migración `202610040001_lead_capture_forms.sql` crea, sin sobrescribir formularios existentes, los slugs publicados `novedades`, `voluntariado-interes`, `membresia-interes` y `cumbre-alianzas`. `novedades` aparece en Inicio y Consulting; los otros tres captan consultas en Únete, Membresía y Cumbre. La migración `202610080001_legacy_form_replacements.sql` añade solicitud formal de membresía, descarga de recursos y reporte de transferencia de la Cumbre. Se pueden editar o archivar desde el administrador; conservar sus slugs para mantener la integración con esas páginas. Las respuestas guardan la página de origen en `source_path`; el formulario de novedades no añade el correo automáticamente a un proveedor de mailing.

Para activar avisos por correo en producción, configurar `RESEND_API_KEY` y `FORM_FROM_EMAIL`. El remitente debe usar un dominio verificado, por ejemplo `SIGUE Network <formularios@siguenetwork.org>`. Si el proveedor rechaza un aviso, la respuesta permanece en el admin y se puede reintentar desde su detalle. La integración usa una clave de idempotencia por respuesta para evitar mensajes duplicados.

Mientras no exista `RESEND_API_KEY`, los avisos permanecen pendientes y no consumen reintentos. El usuario decidió posponer los correos; no programar el cron hasta configurar el proveedor y `CRON_SECRET`.

Configurar `FORM_RATE_LIMIT_SECRET` con una cadena aleatoria de al menos 32 bytes. Si falta, el servidor usa temporalmente la clave de servicio para calcular una huella HMAC; nunca se guarda la IP original. Cada formulario permite hasta cinco intentos por origen en diez minutos y el RPC de escritura solo acepta llamadas con rol de servicio.

Configurar `CRON_SECRET` y programar una petición `GET /api/cron/form-notifications` con `Authorization: Bearer <CRON_SECRET>` cada cinco minutos. El trabajo recupera hasta 25 avisos pendientes o fallidos por ejecución y deja de reintentar automáticamente después de cinco intentos; el reintento manual desde el admin reinicia ese contador.

## Verificación reproducible

```sh
npm ci
npm run test:admin
npx playwright install chromium
npm run test:admin:ui
npm run lint
npm run build
npm audit
```

`test:admin:ui` usa un servidor local de datos ficticios y una ruta temporal sin acceso a la base real. Monta los componentes auténticos del editor y las páginas públicas. Elimina la ruta y el directorio de compilación al terminar. No ejecutarlo al mismo tiempo que `next build`; sí permite mantener abierto un servidor de desarrollo, gracias a un directorio de compilación separado. Puede usarse `PLAYWRIGHT_CHROMIUM_EXECUTABLE` para indicar un Chromium ya instalado.

La prueba SQL `tests/content-transactions.sql` se ejecuta con `psql -v ON_ERROR_STOP=1 -f tests/content-transactions.sql` **exclusivamente en una base de pruebas vacía con las migraciones aplicadas**. Comprueba creación/actualización, rollback ante fallos, conflictos de edición y permisos, y revierte sus datos al terminar.

## Resultado local y límite de la verificación

Se verificaron 14 pruebas de validación, sanitización, formularios, zonas horarias y procesamiento de imágenes; también transacciones en PostgreSQL aislado, interfaz en Chromium y páginas públicas con respuestas de Supabase simuladas. Las pruebas de navegador comprueban el envío completo del formulario dinámico, metadatos reales, JSON-LD, imágenes, cambios de idioma, borradores ocultos, inscripción cerrada y sitemap.

Se verificaron las tablas reales sin registrar valores de credenciales. La portada existente devuelve HTTP 200. Una imagen WebP temporal pudo subirse, descargarse sin autenticación (con bytes idénticos) y eliminarse correctamente.

Entre el 11 y el 12 de septiembre de 2026 se aplicaron al proyecto remoto las migraciones hasta `202609120003_extend_import_ledger.sql`. Las funciones atómicas de blogs, eventos y formularios están disponibles en PostgREST. Las pruebas remotas de escritura, permisos, validación y límite de frecuencia terminaron con `ROLLBACK`; no dejaron datos de prueba.

La importación dejó 46 blogs de WordPress, 12 etiquetas utilizadas, un comentario público aprobado y 14 eventos históricos, además del contenido que ya existía. Los 11 eventos caducados de WP Event Manager conservan su descripción real mediante el endpoint individual de WordPress. Se copiaron 49 imágenes únicas a `content-media`; las imágenes destacadas y embebidas importadas usan AVIF o WebP, y ningún HTML importado depende ya de `wp-content`. La ejecución de comprobación posterior omitió todo por checksum, confirmando que el proceso es idempotente.

Para ejecutar login, admin y formularios localmente deben estar configuradas la URL y la clave pública de Supabase. Nunca usar la clave de servicio como `NEXT_PUBLIC_SUPABASE_ANON_KEY`. El sitio público ya sirve la aplicación mediante el Worker de Cloudflare; WordPress sigue alojando su administrador y medios antiguos. La migración de formularios del 8 de octubre se aplicó a Supabase y se importaron 34 respuestas humanas de los formularios vigentes.

Se actualizaron Next.js a 16.3.8 y sharp a 0.35.4. Referencias: [aviso de Next.js sobre AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) y [release de sharp](https://github.com/lovell/sharp/releases/tag/v0.35.4).
