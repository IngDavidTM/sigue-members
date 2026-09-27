# Plan de medición - SIGUE
## 1. Objetivo
Documentar las principales interacciones que pueden medirse en el sitio de SIGUE, las preguntas de negocio que pueden responder, los datos permitidos para cada evento y las fuentes necesarias para obtener los indicadores.
El objetivo es proporcionar una base para una futura implementación de analítica y visualización en Power BI, sin realizar cambios de código ni conexiones con herramientas externas.
## 2. Alcance y fuentes actuales
El análisis contempla los recorridos públicos disponibles en español (ES) e inglés (EN):
Inicio → servicios/membresía.
Inicio → Blog/Recursos.
Inicio → Eventos.
Cumbre → Zeffy / transferencia.
Donación → Zeffy.
Formulario público → confirmación de envío.
En el frontend actual no se encontró una implementación de GA4, Google Tag Manager, Power BI u otro colector de analítica.
Por esta razón, actualmente no existe en el repositorio una fuente de datos que permita conocer de forma histórica las visitas, sesiones o cantidad real de clics.
Las interacciones propuestas en este documento corresponden a elementos y recorridos existentes en el sitio. La propuesta no implica que los eventos estén actualmente registrados.
## 3. Criterio de medición
Se distinguen tres tipos de resultados:
Clic observable en nuestro sitio: interacción realizada por el usuario sobre un enlace, botón o elemento medible del sitio.
Envío confirmado por nuestro formulario: envío que puede identificarse cuando el formulario muestra la confirmación correspondiente.
Pago o donación confirmado externamente: resultado que solo puede considerarse conversión cuando existe confirmación proveniente de Zeffy o de una fuente externa autorizada.
Un clic hacia Zeffy no se considera por sí mismo un registro, una venta, un pago ni una donación.
## 4. Interacciones prioritarias
Nombre estable: nombre único que identifica la interacción o evento.
Página/componente: lugar del sitio donde ocurre la interacción.
Acción del usuario: actividad que realiza la persona, por ejemplo, hacer clic o enviar un formulario.
Objetivo: propósito de medir esa interacción y qué pregunta de negocio ayuda a responder.
Datos permitidos: información no personal que se podría registrar, como ruta, idioma y fecha/hora.
Fuente necesaria: herramienta o sistema que tendría que proporcionar los datos, por ejemplo, GA4/GTM, Zeffy o una fuente autorizada.
Forma de comprobarla: manera de verificar que la interacción existe en el sitio o que una conversión fue confirmada por la fuente correspondiente.

| Nombre estable | Página/componente | Acción del usuario | Objetivo de negocio | Datos permitidos | Fuente necesaria | Forma de comprobarla | 
|---|---|---|---|---|---|---|    
| blog_click | Navegación global | Clic en Blog | Medir interés en contenido | Ruta,idioma, fecha/hora | GA4/GTM | Comprobar el enlace al Blog en la navegación global |
| membership_click | inicio→Miembros/HomeLanding.tsx | Clic en membresía | Medir interés en la membresía | Ruta, idioma, fecha/hora | GA4/GTM | Comprobar el enlace hacia /es/miembros-sigue |
| events_click | inicio→Eventos/HomeLanding.tsx | Clic en Eventos | Medir interés en eventos |  Ruta, idioma, fecha/hora | GA4/GTM | Comprobar el enlace existente a eventos |
| cumbre_registration_click | Cumbre/CumbreLanding.tsx / RegistrationControls.tsx | Clic en inscribirme | Medir el inicio del recorrido de inscripción | Ruta, idioma, fecha/hora | GA4/GTM | Comprobar el botón y el acceso a #inscripcion |
| cumbre_zeffy_click | Cumbre/RegistrationForm.tsx | Clic en Pagar con tarjeta en Zeffy | Medir la salida hacia el proveedor externo | Ruta, idioma, fecha/hora, destino | GA4/GTM | Comprobar el enlace hacia Zeffy |
| cumbre_transfer_calculator_use | Cumbre / RegistrationForm.tsx | Primera modificación manual de tarifa u hospedaje | Medir interés en la alternativa de transferencia | Ruta, idioma, fecha/hora | GA4/GTM | Verificar la calculadora en RegistrationForm.tsx |
| cumbre_conversion_confirmed | Cumbre-Zeffy | Completar el pago o inscripción | Medir conversiones externas reales | Fecha/hora y datos no personales autorizados | Zeffy o conciliación externa | Requiere confirmación o exportación de la fuente externa |
| donation_zeffy_embed_rendered | Donación / DonationEmbed.tsx | Renderizar el embed de Zeffy en la página | Identificar las páginas donde se carga el formulario de donación de Zeffy | Ruta, idioma, fecha/hora | GA4/GTM | Comprobar que el embed de Zeffy se renderiza en la página |
| donation_conversion_confirmed | Donación-Zeffy | Completar una donación | Medir donaciones confirmadas | Fecha/hora y datos no personales autorizados | Zeffy o conciliación externa |Requiere confirmación o exportación de Zeffy |
| form_submit_confirmed | Formulario público/DynamicForm.tsx | Enviar correctamente el formulario | Contabilizar formularios confirmados | Ruta, idioma, tipo de formulario, fecha/hora | Analítica futura/fuente del formulario | Verificar un submissionId válido generado después de la persistencia; excluir el honeypot |

## 5. Embudos de conversión
Embudo de Cumbre
El recorrido de Cumbre se plantea de la siguiente manera:
Inicio del recorrido → Clic en “Inscribirme” → Acceso a Zeffy o alternativa de transferencia → Pago o inscripción completada → Conversión confirmada
Fuentes disponibles:
Clic en “Inscribirme”: actualmente no existe un colector de analítica en el repositorio. Para medirlo se requeriría GA4/GTM.
Acceso a Zeffy: puede medirse como clic en nuestro sitio mediante una futura implementación de analítica.
Uso de la alternativa de transferencia: puede medirse mediante una futura implementación de analítica si la interacción es observable.
Pago o inscripción completada: no puede confirmarse únicamente desde nuestro sitio.
Conversión confirmada: requiere información o exportación autorizada de Zeffy o una fuente externa de conciliación.

Embudo de membresía / donación
Membresía:
Inicio → Clic en “Membresía” → Acción de membresía → Conversión confirmada
Donación:
Inicio → Clic en “Donar” → Formulario de Zeffy → Donación completada → Donación confirmada
Fuentes disponibles:
Clic en “Membresía” o “Donar”: actualmente no existe un colector de analítica en el repositorio. Para medirlos se requeriría GA4/GTM.
Visualización o interacción con Zeffy: puede requerir analítica del sitio y/o información proporcionada por Zeffy.
Acción o conversión de membresía: requiere una fuente que confirme la acción.
Donación completada: requiere confirmación de Zeffy.
Donación confirmada: requiere una fuente autorizada de Zeffy o una conciliación externa.

Nota: Un clic o una visualización no se considera una conversión. Las conversiones externas solo deben contabilizarse cuando exista una confirmación de la fuente correspondiente.

## 6. KPIs y limitaciones
Los siguientes indicadores permiten medir las principales interacciones del sitio. Debido a que actualmente no se encontró un colector de analítica en el frontend, algunos indicadores no pueden calcularse con datos reales en este momento.

Páginas vistas

Fórmula: cantidad de vistas registradas de una página o ruta durante un período.

Estado actual: no calculable con datos reales.

Fuente necesaria: GA4 u otra herramienta de analítica autorizada.

Limitación: actualmente el repositorio no contiene una fuente que registre visitas o sesiones históricas.

Clics en CTA

Fórmula: cantidad de clics registrados en un botón o enlace específico durante un período.

Estado actual: no calculable con datos reales.

Fuente necesaria: GA4/GTM u otra solución de analítica autorizada.
 
Limitación: los botones y enlaces existen en el sitio, pero actualmente no se encontró un colector que registre sus clics.

Descargas iniciadas

Fórmula: cantidad de descargas iniciadas de un recurso durante un período.

Estado actual: no calculable con datos reales; requiere un recurso descargable identificable y una fuente de analítica que registre el inicio de la descarga.

Fuente necesaria: GA4/GTM u otra herramienta de analítica autorizada.

Limitación: este indicador no debe interpretarse como una descarga completada si la fuente solo registra el inicio de la acción.

Formularios confirmados

Fórmula: cantidad de envíos que terminan en una confirmación exitosa del formulario. 

Estado actual: la confirmación está contemplada en el componente del formulario, pero no existe 
actualmente una fuente histórica de analítica que permita obtener el volumen real.

Fuente necesaria: fuente de analítica o del formulario que registre únicamente la confirmación del envío.

Limitación: no se deben registrar nombres, correos, teléfonos, respuestas ni otros datos personales para este indicador.

Conversiones externas

Fórmula: cantidad de pagos, inscripciones o donaciones confirmadas por la fuente externa correspondiente. 

Estado actual: no calculable con datos reales desde el repositorio actual.

Fuente necesaria: exportación o confirmación autorizada de Zeffy o una fuente externa de conciliación.

Limitación: un clic hacia Zeffy o la visualización de su formulario no equivale a una conversión. La conversión solo debe contabilizarse cuando exista una confirmación de la fuente externa.

## 7. Glosario ES/EN
Los nombres técnicos de los eventos se mantienen estables en español e inglés para facilitar la comparación de datos en Power BI. El idioma de la navegación se registra mediante el campo locale.
| Término / evento | Español | English |
|---|---|---|
| membership_click | Clic en membresía | Membership click |
| blog_click | Clic en Blog | Blog click |
| events_click | Clic en Eventos | Events click |
| cumbre_registration_click | Clic en inscripción de Cumbre | Cumbre registration click |
| cumbre_zeffy_click | Clic hacia Zeffy en Cumbre | Cumbre Zeffy click |
| cumbre_conversion_confirmed | Conversión de Cumbre confirmada | Confirmed Cumbre conversion |
| donation_zeffy_view | Visualización del formulario de donación de Zeffy | Zeffy donation form view |
| donation_conversion_confirmed | Donación confirmada | Confirmed donation |
| form_submit_confirmed | Formulario enviado y confirmado | Confirmed form submission |
| cumbre_transfer_calculator_use | Uso de la calculadora de transferencia | Transfer calculator use |

## 8. Prioridad de implementación
La prioridad propuesta se basa en la utilidad de los eventos para el análisis y en la disponibilidad de las fuentes de datos.

Prioridad alta

Implementar primero los eventos de navegación y llamadas a la acción dentro del sitio:

membership_click
blog_click
events_click
cumbre_registration_click
cumbre_zeffy_click
cumbre_transfer_calculator_use
Estos eventos permitirían conocer qué contenidos, servicios y acciones generan mayor interés. Para su medición sería necesaria una herramienta de analítica como GA4/GTM u otra solución autorizada.

Prioridad media

Implementar el seguimiento de formularios confirmados:

form_submit_confirmed
Este evento permitiría contabilizar envíos confirmados sin registrar información personal de los usuarios. Requiere una fuente de datos que permita registrar la confirmación del formulario.

Prioridad dependiente de fuente externa

Las conversiones externas deben implementarse únicamente cuando exista una fuente autorizada:
cumbre_conversion_confirmed
donation_conversion_confirmed
Para estos eventos se requiere información confirmada por Zeffy o una fuente externa de conciliación. Un clic hacia Zeffy no debe considerarse una conversión.

Estado actual

Actualmente el repositorio no contiene un colector de analítica que permita obtener estos indicadores con datos históricos reales. Por tanto, esta prioridad corresponde a una propuesta de implementación futura y no implica que los eventos estén actualmente registrados.

## 9. Gobernanza y privacidad de los datos

Antes de implementar cualquier medición, se debe definir la gobernanza de los datos utilizados en analítica.

Consentimiento: se debe determinar cuándo se requiere consentimiento del usuario para el uso de herramientas de analítica y respetar las políticas de privacidad aplicables.

Retención: se debe establecer durante cuánto tiempo se conservarán los datos de analítica y las exportaciones utilizadas para los indicadores.

Responsables de acceso: se deben definir los roles o responsables autorizados para consultar, administrar y utilizar los datos.

Datos permitidos en GA4/GTM: solo deben enviarse datos necesarios para la medición, evitando nombres, correos electrónicos, teléfonos, respuestas de formularios, datos bancarios u otros datos personales.

Exportaciones de Zeffy: cualquier información obtenida mediante exportaciones de Zeffy debe utilizarse únicamente con autorización y bajo las reglas de acceso, retención y privacidad definidas por la organización.

Criterio general: ningún evento debe diseñarse de forma que permita identificar directamente a una persona. Las conversiones externas deben basarse únicamente en información confirmada por la fuente autorizada correspondiente.

