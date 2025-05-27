# Modelo ArchivoCargado

## Descripción
Modelo para gestionar los archivos subidos por docentes, almacenar metadatos, estado de procesamiento y texto extraído.

## Tabla: `archivos_cargados`

| Campo                      | Tipo         | Descripción                                                        |
|----------------------------|--------------|--------------------------------------------------------------------|
| id                         | Integer (PK) | Identificador único                                                |
| nombre_original            | String(255)  | Nombre original del archivo subido                                 |
| nombre_servidor            | String(255)  | Nombre único generado en el servidor                               |
| tipo_mime                  | String(50)   | Tipo MIME del archivo (application/pdf, text/plain)                |
| tamano                     | Integer      | Tamaño en bytes                                                    |
| ruta_almacenamiento        | String(512)  | Ruta local o URL de almacenamiento                                 |
| usuario_id                 | Integer (FK) | ID del docente que subió el archivo                                |
| clase_id                   | Integer (FK) | ID de la clase asociada (opcional)                                 |
| fecha_subida               | DateTime     | Fecha y hora de la subida                                          |
| estado_procesamiento_texto | String(20)   | Estado: 'pendiente', 'procesado', 'error'                          |
| texto_extraido             | Text         | Texto extraído del archivo (puede ser NULL hasta que se procese)   |
| fecha_procesamiento        | DateTime     | Fecha de procesamiento del texto                                   |
| mensaje_error              | Text         | Mensaje de error si el procesamiento falla                         |

## Relaciones
- Muchos a uno con `Usuario` (docente)
- Muchos a uno con `Clase` (opcional)

## Notas
- El campo `estado_procesamiento_texto` permite monitorear el avance y errores.
- El campo `texto_extraido` se llena de forma asíncrona por Celery.
- El almacenamiento local es temporal; para producción se recomienda cloud storage.

## Referencias
- Implementación: `backend/app/models/archivo_cargado.py`
- Relación en clase: `backend/app/models/clase.py`
