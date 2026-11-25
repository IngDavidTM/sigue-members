# Área de miembros SIGUE: análisis y propuesta

Fecha: 25 de noviembre de 2026
Alcance: onboarding de organizaciones, panel (dashboard) del miembro y archivo de webinars grabados.

## 1. Punto de partida

Lo que hay hoy en el código y en producción:

| Pieza | Estado |
|---|---|
| Registro e inicio de sesión | Funciona: correo + contraseña y Google (`/register`, `/login`, Supabase Auth). |
| Perfil | Tabla `profiles` con `email`, `full_name` y `role` (`user` / `admin`). Nada sobre la organización. |
| Panel `/dashboard` | Una tarjeta de bienvenida, el correo y el último acceso. Enlaces a Blog y Eventos públicos. Solo en español. |
| Eventos | 70 eventos publicados por idioma. Los pasados se muestran en público en `/eventos` y en el sitemap. **No existe ningún campo de grabación**: ningún evento enlaza un video. |
| Menú «Webinars» | En el menú de Recursos aparece «Webinars – Sesiones grabadas por eje SIGUE», pero **no tiene enlace**. La promesa ya está publicada; falta el contenido. |
| Promesa de la membresía | `/miembros-sigue` ofrece «webinars y materiales exclusivos», comunidad, Certificación SIGUE para financiamiento, visibilidad y formación. |
| Marco SIGUE | Cinco ejes: **S**ervir, **I**mpactar, **G**uiar, **U**nir fuerzas y **E**quipar para expandir. Es la base natural del diagnóstico. |

Conclusión: el sistema de cuentas ya existe, pero estar registrado hoy no da nada que no sea público. Esta propuesta convierte la cuenta en el lugar donde la organización trabaja con SIGUE.

## 2. Qué debe resolver el área de miembros

Para la organización:
1. Contar quién es una sola vez (onboarding) y mantenerlo al día.
2. Ver en un solo lugar cómo va: proyectos, dinero y madurez por eje SIGUE.
3. Acceder a lo exclusivo: webinars grabados con su resumen y materiales.

Para SIGUE:
1. Conocer a cada organización sin pedir la misma información por correo.
2. Hacer un análisis rápido con datos comparables entre organizaciones.
3. Tener una base objetiva para la Certificación SIGUE y para recomendar Academy, Consulting o Tracks.

## 3. Modelo: la organización es el miembro, no la persona

Las organizaciones tienen varias personas (directora, tesorero, coordinador de proyectos). Si la información se cuelga del usuario, se pierde cuando esa persona sale. Propuesta:

- `organizations`: la ficha de la organización.
- `organization_members`: qué usuarios pertenecen a cada organización y con qué rol (`owner`, `editor`, `viewer`).
- Una persona se registra, crea su organización (queda como `owner`) e invita a otras por correo.
- Estado de la organización: `draft` → `submitted` → `approved` (lo aprueba un admin). El estado decide qué contenido exclusivo ve.

## 4. Onboarding (asistente en pasos)

Un asistente corto, que se puede dejar a medias y retomar, con barra de progreso. Solo lo marcado con * es obligatorio para enviar a revisión.

**Paso 1 – Identidad**
- Nombre legal* y nombre público, país*, ciudad, año de fundación.
- Tipo de entidad*: ONG / fundación / iglesia o ministerio / empresa social / proyecto sin registro legal.
- Registro legal: número de identificación fiscal o de registro (EIN 501(c)(3) en EE. UU., NIT en Colombia, CIF en España, etc.). Opcional al principio, necesario para la certificación.
- Sitio web, redes sociales y logo.

**Paso 2 – Misión y alcance**
- Misión* (texto corto) y visión.
- Causas o áreas (educación, salud, niñez, fe, emprendimiento…)*, población que atiende y zonas geográficas.
- Personas beneficiadas al año (rango).

**Paso 3 – Equipo**
- Personal pagado y voluntarios (rangos), junta directiva (sí/no, número de miembros).
- Persona de contacto principal*.

**Paso 4 – Finanzas (resumen anual)**
- Presupuesto anual en rangos* (menos de 10 000, 10 000–50 000, 50 000–250 000, 250 000–1 M, más de 1 M USD) y moneda de trabajo.
- Ingresos por fuente: donaciones individuales, iglesias, fundaciones/subvenciones, gobierno, venta de servicios, eventos, otros.
- Gastos por categoría: programas, administración, recaudación de fondos.
- ¿Tiene estados financieros o auditoría? (sí/no y archivo opcional).

**Paso 5 – Diagnóstico SIGUE**
- 3 o 4 preguntas por eje (S, I, G, U, E), con escala de 1 a 5. Unas 15–20 preguntas en total, unos 10 minutos.
- Resultado inmediato: gráfico de radar por eje y 2–3 recomendaciones (webinar, herramienta o programa SIGUE).

Recomendaciones de diseño:
- Pedir **rangos** antes que cifras exactas: se completa más rápido y genera menos desconfianza.
- Decir en cada paso para qué se usa el dato y quién lo ve.
- Guardar automáticamente cada paso.

## 5. Panel del miembro (pestañas)

| Pestaña | Contenido |
|---|---|
| **Resumen** | Completitud del perfil, estado de la membresía, radar SIGUE, próximos eventos y último webinar. |
| **Organización** | Ficha editable (lo del onboarding) e invitación a otras personas. |
| **Proyectos** | Lista de proyectos: nombre, eje SIGUE, estado (idea, activo, pausado, terminado), fechas, presupuesto, beneficiarios meta vs. reales e indicador principal con meta y avance. |
| **Finanzas** | Presupuesto vs. gastado por año y por proyecto, y registro sencillo de gastos (fecha, monto, categoría, proyecto, nota). Indicadores automáticos (ver abajo). |
| **Webinars** | Archivo de grabaciones (sección 6). |
| **Recursos** | Más adelante: herramientas y materiales exclusivos. |

Indicadores financieros que se calculan solos, estándar en el sector sin fines de lucro:
- **Proporción de gasto en programas** = gasto en programas / gasto total. Los donantes suelen esperar 65–75 % o más.
- **Meses de reserva** = reservas disponibles / gasto mensual promedio. Menos de 3 meses es una alerta.
- **Diversificación de ingresos**: porcentaje de la fuente principal. Más del 50 % en una sola fuente es un riesgo.
- **Ejecución presupuestal**: gastado vs. presupuestado.

Límite importante: **no construir un software contable**. El registro de gastos es para ver tendencias y apoyar el análisis, no para llevar la contabilidad. Para quien ya lleva cuentas en otro sistema, basta con importar un CSV con totales por mes y categoría.

## 6. Webinars grabados

### Qué cambia para el admin

En el editor de eventos se agrega una sección **«Grabación»** que se habilita cuando el evento ya terminó:
- Enlace de la grabación (YouTube, Vimeo o Zoom).
- Resumen por idioma: qué se trató, ideas clave y materiales (texto enriquecido, como el contenido actual).
- Archivos o enlaces de materiales (presentación, plantillas).
- Eje SIGUE del webinar (para filtrar «por eje», como promete el menú).
- Visibilidad: `members` (por defecto) o `public`.

### Qué ve el miembro

Pestaña **Webinars** en el panel: tarjetas filtrables por eje y por año, y una página de detalle con video incrustado, resumen y materiales.

### Qué pasa en la web pública

**No ocultar ni borrar las páginas de eventos pasados.** Son 70 URLs indexadas que traen tráfico orgánico y respaldan el SEO que acabamos de ordenar. Propuesta:
- La página pública del evento pasado se mantiene con su descripción.
- Se agrega un bloque: «Grabación y resumen disponibles para miembros → Inicia sesión o hazte miembro». Así cada evento viejo se convierte en una puerta de captación.
- El enlace al video y el resumen **nunca** van en el HTML público: se guardan en una tabla aparte (`event_recordings`) que solo pueden leer los miembros autorizados (con RLS en Supabase).
- El menú «Webinars» pasa a enlazar a esa sección: el panel para los miembros y una página de presentación para el público.

### Límite técnico del video

Ocultar el enlace en la web no hace privado el video:
- **YouTube «no listado»**: gratis, pero quien tenga el enlace lo puede compartir.
- **Vimeo** (plan de pago): permite restringir la reproducción al dominio `siguenetwork.org`. Es la opción realmente privada.
- **Zoom**: las grabaciones en la nube caducan según el plan; no sirve como archivo permanente.

Recomendación: empezar con YouTube no listado (costo cero) y pasar a Vimeo con restricción de dominio si la exclusividad se vuelve parte del valor de pago.

## 7. Análisis por parte de SIGUE (admin)

- Nueva sección **Miembros** en `/admin`: lista de organizaciones con estado, país, tamaño, completitud y puntaje SIGUE, con filtros.
- Ficha de cada organización: todo lo que cargó, sus indicadores y **notas internas** de SIGUE (no visibles para la organización).
- Acciones: aprobar, pedir más información y marcar «certificada».
- Vista agregada: cuántas organizaciones por país y por tamaño, y el promedio por eje SIGUE. Esto permite decidir qué webinars o programas hacen falta.
- Más adelante: un resumen automático con IA de cada organización (fortalezas, riesgos y recomendaciones) como borrador para quien la asesora.

## 8. Seguridad y privacidad

Son datos sensibles (finanzas y personas), y hay miembros en Europa (GDPR) y en EE. UU.:
- RLS en cada tabla nueva: una persona solo ve las organizaciones a las que pertenece; el admin lo ve todo. Seguir el patrón de `requireUser` / `requireAdmin` y los permisos por columna de la migración de seguridad del 21-nov.
- Archivos (estados financieros, logos) en un bucket **privado** con URLs firmadas.
- No pedir datos bancarios, números de cuenta ni documentos de identidad personales.
- Consentimiento explícito en el onboarding («SIGUE usa estos datos para asesorarte y para estadísticas agregadas y anónimas»).
- Exportar y borrar la cuenta y la organización a pedido (GDPR). Coordinarlo con el issue #24 (política de privacidad).
- Registro de cambios en las finanzas (quién cambió qué y cuándo).

## 9. Plan por fases

| Fase | Contenido | Tamaño aproximado |
|---|---|---|
| **1. Webinars + base del panel** | Campos de grabación en el admin, tabla `event_recordings` con RLS, pestaña Webinars, bloque «para miembros» en eventos pasados, menú «Webinars» con enlace, panel con pestañas y en ES/EN. | 1–1,5 semanas |
| **2. Organización + onboarding** | Tablas `organizations` y `organization_members`, asistente de 4 pasos (sin diagnóstico), invitaciones, estado y aprobación en el admin. | 1,5–2 semanas |
| **3. Proyectos + finanzas** | Proyectos, resumen financiero anual, registro de gastos, indicadores y gráficos. | 2 semanas |
| **4. Diagnóstico SIGUE + análisis** | Cuestionario por eje, radar, recomendaciones, vista agregada en el admin y notas internas. | 1,5 semanas |
| **5. Comunidad y certificación** | Directorio «Conoce a los miembros» (opcional por organización), Certificación SIGUE y resumen con IA. | por definir |

La fase 1 da valor inmediato (cumple lo que el menú ya promete y convierte los eventos pasados en captación) y no depende de las demás.

## 10. Decisiones pendientes

1. **¿Quién ve las grabaciones?** Cualquier cuenta registrada (más captación) o solo organizaciones aprobadas (más exclusividad).
2. **¿La membresía es gratuita o de pago?** Si es de pago, la fase 2 necesita conectar el pago (Zeffy u otro) con el estado de la organización.
3. **Hospedaje del video:** YouTube no listado o Vimeo con restricción de dominio.
4. **Nivel de detalle financiero:** solo resumen anual o también registro de gastos individuales desde el inicio.
5. **Preguntas del diagnóstico SIGUE:** conviene que las redacte el equipo de SIGUE (Sandra) para que coincidan con la metodología de Consulting y Tracks.
