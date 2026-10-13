# Guía para reemplazar los datos de ejemplo

## Objetivo

Indicar cómo reemplazar el archivo CSV sintético del prototipo de Power BI por un archivo real autorizado, manteniendo la misma estructura de datos.

## Archivo de origen

El prototipo utiliza actualmente:

data/events-sample.csv

Este archivo contiene únicamente datos sintéticos y no representa usuarios, visitas ni conversiones reales de SIGUE.

## Columnas obligatorias

El archivo real debe conservar las siguientes columnas:

| Columna  | Tipo esperado | Descripción |
| --- | --- | --- |
| datetime | Fecha y hora | Momento en que ocurrió el evento. |
| locale | Texto | Idioma de la página: es o en. |
| path | Texto | Ruta de la página donde ocurrió el evento. |
| event_name | Texto | Nombre estable del evento. |
| source | Texto  | Fuente de donde proviene el registro. |

El identificador example_id utilizado en los datos sintéticos puede reemplazarse por un identificador real de evento, si la fuente autorizada lo proporciona y es necesario para el análisis.

## Requisitos del archivo real

* Mantener los mismos nombres de columnas y tipos de datos.
* Los valores de datetime deben poder interpretarse como fecha y hora.
* locale debe identificar correctamente el idioma.
* No incluir contraseñas, credenciales ni información personal innecesaria.
* Utilizar únicamente datos cuya extracción y uso hayan sido autorizados.
* Mantener separados los clics hacia servicios externos de las conversiones confirmadas.
* Las conversiones de Zeffy o de otros medios externos deben considerarse confirmadas únicamente cuando exista un registro autorizado que las respalde.

## Reemplazo en Power BI

1. Reemplazar el archivo CSV de ejemplo por el archivo real autorizado.
2. Mantener la misma estructura y los mismos nombres de columnas.
3. Abrir la plantilla `SIGUE_Analytics.pbit`.
4. Al abrir la plantilla, establecer el parámetro `RutaCSV` con la ruta local donde se encuentra `events-sample.csv`.
5. Actualizar los datos mediante *Actualizar*.
6. Revisar que las visualizaciones continúen funcionando.
7. Verificar que los tipos de datos y los filtros se mantengan correctamente.

Si la fuente real utiliza otra estructura, primero se debe adaptar la consulta para conservar el esquema esperado por el modelo.

## Validación

Después del reemplazo se debe comprobar:

* Que el total de registros se actualice.
* Que las fechas aparezcan correctamente.
* Que funcionen los filtros por idioma y fecha.
* Que los eventos se agrupen correctamente.
* Que los gráficos no presenten errores.
* Que los eventos externos y las conversiones confirmadas permanezcan diferenciados.

## Seguridad

No se deben incluir en el repositorio credenciales, tokens, contraseñas ni extractos con información personal no autorizada.

El archivo de ejemplo incluido en el proyecto debe continuar siendo sintético cuando no exista autorización para incorporar datos reales.