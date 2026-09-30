# Medidas y supuestos del prototipo de analítica

## Objetivo

Documentar las medidas utilizadas en el prototipo de Power BI y aclarar los supuestos utilizados para interpretar los datos sintéticos.

## Medidas

| Indicador | Cálculo | Interpretación | Interpretación |
|---|---|---|
| Interacciones registradas | Conteo de event_name o example_id | Cantidad total de eventos registrados en los datos de ejemplo. |
| Eventos por fecha | Conteo de eventos agrupados por datetime | Muestra la evolución de las interacciones a lo largo del tiempo. |
| Eventos por idioma | Conteo de eventos agrupados por locale | Permite comparar las interacciones registradas en español (es) e inglés (en). |
| Eventos por página | Conteo de eventos agrupados por path | Permite identificar las páginas con mayor cantidad de interacciones registradas. |
| Eventos por tipo | Conteo de eventos agrupados por event_name | Permite identificar las acciones registradas con mayor frecuencia. |               |

## Supuestos

* Los datos utilizados son sintéticos y se presentan únicamente como ejemplo.
* Los conteos representan cantidad de eventos registrados, no cantidad de usuarios únicos.
* Un mismo usuario podría generar varios eventos.
* datetime se utiliza para analizar la evolución temporal.
* locale identifica el idioma de la página.
* path identifica la página donde se registró el evento.
* event_name identifica la acción que se desea medir.
* source identifica la fuente del registro.
* example_id es un identificador ficticio utilizado únicamente en los datos de ejemplo.

## Cumbre

Los eventos relacionados con Cumbre permiten representar diferentes interacciones:

cumbre_registration_click: clic para iniciar el proceso de inscripción.
cumbre_zeffy_click: clic hacia el servicio externo Zeffy.
cumbre_transfer_calculator_use: uso de la calculadora de transferencia. cumbre_conversion_confirmed: conversión confirmada.

El clic hacia Zeffy no se considera una conversión confirmada.

En el conjunto de datos sintéticos actual no se incluyen registros de cumbre_conversion_confirmed. Por esta razón, los gráficos actuales representan interacciones registradas y no pagos confirmados.

## Donaciones

donation_zeffy_embed_rendered: registro de visualización o carga del componente externo de donación.
donation_conversion_confirmed: donación confirmada.

La visualización del componente de Zeffy no equivale a una donación realizada.

En el conjunto de datos sintéticos actual no se incluyen registros de donation_conversion_confirmed.

## Embudo

El prototipo puede mostrar los conteos de diferentes eventos de Cumbre como referencia visual.

Sin embargo, estos conteos no deben interpretarse como un embudo de usuarios que necesariamente realizaron todos los pasos.

Para construir un embudo real sería necesario contar con identificadores consistentes de usuario o sesión y registros de cada etapa, además de eventos de conversión confirmada.

## Nota sobre los datos

Todos los resultados mostrados en el prototipo deben identificarse como *Datos de ejemplo* y no representan resultados reales de SIGUE.