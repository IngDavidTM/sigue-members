# Diccionario de datos - Modelo de eventos

## Objetivo

Definir las columnas que utilizará el modelo de datos de Power BI para analizar interacciones del sitio web de SIGUE mediante datos sintéticos de ejemplo.

## Tabla de eventos

| Columna | Tipo de dato | ¿Qué significa? | Ejemplo |
|---|---|---|---|
| datetime | Fecha y hora | Cuándo ocurrió la acción | 2026-09-28 10:30 |
| locale | Texto | Idioma de la página | es |
| path | Texto | Página donde ocurrió | /es/blog |
| event_name | Texto | Acción que queremos medir | blog_click |
| source | Texto | Fuente del dato | website |
| example_id | Texto | Identificador ficticio | EVT001 |