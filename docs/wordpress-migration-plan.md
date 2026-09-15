# Plan de migración de WordPress a SIGUE

Este documento cubre la migración de contenido y las funciones que deben estar listas antes de mover `siguenetwork.org` al proyecto Next.js.

## Inventario confirmado

- 46 entradas públicas en la API REST de WordPress.
- 12 etiquetas usadas por las entradas migradas y un comentario público asociado a ellas. Los otros comentarios de WordPress pertenecen a contenido antiguo que no se migró.
- 11 eventos históricos del plugin WP Event Manager visibles en todas las páginas de `/eventos/`.
- 3 eventos antiguos del tipo `edge-event` publicados bajo `/event/`.
- Las entradas usan URLs históricas en la raíz, por ejemplo `/marca-con-proposito/`; el proyecto nuevo usa `/es/blog/marca-con-proposito`.
- Los eventos de WP Event Manager desaparecen de su API al caducar. El importador debe leer el archivo público y sus páginas, no depender solo del endpoint REST.
- WordPress sirve imágenes originales pesadas y referencias dentro del HTML. Todas se deben copiar, optimizar y reescribir.

## Fases y criterio de terminación

### 1. Base de datos y trazabilidad

- Crear formularios, campos y respuestas con RLS.
- Crear un RPC público que valide respuestas contra la versión publicada del formulario.
- Registrar cada contenido importado, su URL de origen, checksum y destino para que el proceso sea idempotente.
- Sembrar un formulario de contacto bilingüe editable.

Termina cuando la migración se aplica en Supabase y un usuario anónimo solo puede leer formularios publicados y enviar respuestas válidas.

### 2. Importador de WordPress

- Obtener todas las páginas de `/wp-json/wp/v2/posts`.
- Descubrir eventos históricos en todas las páginas de `/eventos/` y en `edge-event-sitemap.xml`.
- Extraer título, slug, contenido, extracto, autor, fechas, categorías, imagen destacada y metadatos SEO.
- Descargar imágenes destacadas y embebidas, convertirlas a WebP y subirlas al bucket `content-media` con rutas deterministas.
- Reescribir el HTML para que no dependa de `wp-content`.
- Ejecutar en modo inventario por defecto y exigir `--apply` para escribir.
- Producir un reporte de importados, actualizados, omitidos y errores.

Termina cuando los conteos de origen y destino coinciden y una segunda ejecución no crea duplicados.

### 3. Compatibilidad SEO

- Conservar slugs y fechas originales.
- Importar título SEO, descripción, canonical, Open Graph y robots desde el HTML público de Rank Math.
- Crear redirecciones permanentes de las URLs históricas a las rutas localizadas nuevas.
- Publicar traducciones inglesas completas y permitir su revisión posterior desde el admin.
- Validar sitemap, canonical, alternates y datos estructurados.

Termina sin URLs históricas públicas que respondan 404 y sin imágenes que apunten al hosting de WordPress.

### 4. Formularios dinámicos en el admin

- Listar, crear, editar, duplicar, publicar y archivar formularios.
- Configurar preguntas de texto, email, teléfono, número, fecha, URL, selección, selección múltiple, radio, casilla y consentimiento.
- Editar etiquetas, ayudas, opciones, obligatoriedad, ancho y orden en español e inglés.
- Mostrar una vista previa y la URL pública del formulario.
- Consultar respuestas, cambiar su estado, escribir notas y exportar CSV.
- Usar el formulario `contacto` en la página pública actual.

Termina cuando un administrador puede cambiar las preguntas sin tocar código y consultar cada respuesta desde el panel.

### 5. Preparación del cambio de dominio

- Probar navegación, formularios, medios, SEO y permisos en producción temporal.
- Congelar cambios en WordPress y ejecutar una última importación incremental.
- Cambiar DNS de `siguenetwork.org` al despliegue nuevo, manteniendo Supabase como base de datos.
- Vigilar errores 404, envíos de formularios y rendimiento durante los primeros días.

WordPress y su base MySQL se pueden retirar después de conservar un respaldo final. GoDaddy puede seguir administrando el dominio y DNS; la aplicación y sus datos no necesitan vivir allí.

## Estado al 12 de septiembre de 2026

- **Fase 1 completada:** las migraciones `202609110003` a `202609120002` están aplicadas en Supabase. El formulario bilingüe `contacto` quedó publicado con cinco preguntas. Los envíos válidos, el rechazo de valores estructurados inválidos, el límite de frecuencia y el guardado administrativo atómico se comprobaron dentro de transacciones revertidas. El RPC de escritura ya no es ejecutable por clientes anónimos.
- **Fase 2 completada:** se importaron 46 blogs, 12 etiquetas utilizadas, un comentario aprobado, 11 eventos de WP Event Manager y 3 eventos `edge-event`. El importador consulta individualmente los eventos caducados para conservar su descripción aunque WordPress la oculte en la página pública. Las 49 imágenes únicas se copiaron a `content-media` en AVIF o WebP. Una segunda ejecución omitió todo por checksum sin crear duplicados.
- **Fase 3 completada en código y datos:** los HTML importados ya no apuntan a `wp-content`; se conservaron metadatos SEO, slugs y fechas. Las 60 URLs antiguas tienen redirecciones 308. Los blogs, eventos, series y etiquetas tienen versiones inglesas diferenciadas, slugs propios y metadatos indexables.
- **Fase 4 completada:** el panel permite crear y editar formularios, consultar respuestas, anotar su seguimiento, exportar CSV y reintentar avisos por correo.
- **Fase 5 pendiente de operación:** falta configurar las variables públicas y de correo en el proveedor de despliegue, hacer la importación incremental final después de congelar WordPress y cambiar el DNS cuando se apruebe la nueva web.

## Mantenimiento de traducciones importadas

WordPress solo contiene los artículos y eventos originales en español. El
importador actualiza exclusivamente esa versión para evitar que una copia en
español aparezca bajo `/en` o sobrescriba el trabajo posterior del equipo.

El paquete inicial inglés está en `data/imported-content-en.json`. Se puede
revisar con `npm run content:english` y aplicar con
`npm run content:english:apply`. La operación guarda un respaldo, reemplaza
únicamente filas inglesas que todavía son idénticas al español y conserva las
traducciones ya editadas desde el admin.
