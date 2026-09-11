# Blogs y eventos: preparación para producción

La edición se mantiene en `/admin/blogs` y `/admin/eventos`. No se requiere una clave de servicio en el navegador. Todas las acciones verifican la sesión y el rol administrador; las funciones de guardado conservan las políticas RLS.

## Despliegue

1. Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SITE_URL` con el dominio público definitivo. Esta última variable determina las URLs canónicas, los enlaces de idioma y el sitemap.
2. Aplicar las migraciones anteriores si el proyecto aún no las tiene y después **`supabase/migrations/202609110001_content_atomic_saves.sql`**, antes de desplegar el frontend nuevo. La migración añade dos funciones; no borra contenido ni cambia el formato de los registros existentes. El frontend anterior puede seguir funcionando durante este paso.
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

Se verificaron validación/sanitización/zonas horarias, transacciones en PostgreSQL aislado, interfaz en Chromium y páginas públicas con respuestas de Supabase simuladas. Las pruebas de navegador comprueban metadatos reales, JSON-LD, imágenes, cambios de idioma, borradores ocultos, inscripción cerrada y sitemap.

El entorno de trabajo no dispone de credenciales del proyecto Supabase. Por ello, la nueva migración no se ha aplicado al proyecto remoto ni se ha verificado una subida real a su Storage. Esos pasos y el despliegue final siguen pendientes; las pruebas locales no los sustituyen.

Se actualizaron Next.js a 16.3.5 y sharp a 0.35.4. Referencias: [aviso de Next.js sobre AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) y [release de sharp](https://github.com/lovell/sharp/releases/tag/v0.35.4).
