# Procesamiento Asíncrono de Documentos con Celery

## Descripción General
El procesamiento de archivos subidos (PDF, TXT) se realiza de forma asíncrona usando Celery y PyMuPDF para evitar bloquear la API y mejorar la experiencia de usuario.

## Flujo
1. El docente sube un archivo mediante el endpoint `/api/v1/documents/upload`.
2. Se crea un registro en la base de datos con estado `pendiente`.
3. Se encola una tarea Celery (`extraer_texto_archivo`) que procesa el archivo:
   - Si es PDF: extrae el texto con PyMuPDF.
   - Si es TXT: lee el contenido directamente.
4. Al finalizar, actualiza el registro con el texto extraído, estado `procesado` o `error` y mensaje de error si aplica.

## Configuración
- Broker: Redis (configurado en `docker-compose.yml` y `requirements.txt`)
- Tarea: `backend/app/tasks/document_processing.py`
- Modelo: `backend/app/models/archivo_cargado.py`

## Variables de Entorno
- `MAX_UPLOAD_SIZE`: Tamaño máximo permitido para archivos (por defecto 10MB).
- `UPLOAD_FOLDER`: Carpeta local para almacenamiento temporal.

## Consideraciones
- El worker de Celery debe estar corriendo para procesar archivos.
- El almacenamiento local es solo para desarrollo; en producción se recomienda migrar a cloud storage.
- Monitorear el consumo de recursos y el estado de las tareas.

## Referencias
- Implementación: `backend/app/tasks/document_processing.py`
- Documentación Celery: https://docs.celeryq.dev/en/stable/
- Documentación PyMuPDF: https://pymupdf.readthedocs.io/
