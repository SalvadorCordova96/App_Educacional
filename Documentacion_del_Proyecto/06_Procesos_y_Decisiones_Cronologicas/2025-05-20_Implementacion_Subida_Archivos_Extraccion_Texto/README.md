# 2025-05-20 Implementación de Subida de Archivos y Extracción de Texto

**Fecha y Hora:** 2025-05-20
**Responsable(s):** GitHub Copilot

## Descripción del Proceso/Cambio:
Se implementó la funcionalidad completa para la subida de archivos (PDF, TXT) por parte de docentes y la extracción asíncrona de su contenido textual. Esto incluye:
- Nuevo endpoint API en `app/routes/documents.py` para manejar las subidas.
- El modelo `ArchivoCargado` en `app/models/archivo_cargado.py` para persistir metadatos y texto.
- Tarea de Celery en `app/tasks/document_processing.py` para la extracción de texto con PyMuPDF.
- Registro del blueprint en `app/__init__.py`.
- Validaciones de tipo, tamaño y seguridad en la subida.
- Asociación de archivos a clases y usuarios docentes.

## Justificación:
Permitir a los docentes enriquecer el material de sus clases y habilitar funcionalidades de IA que dependan de estos documentos, alineado al Plan de Desarrollo Estratégico y el Plan de Acción.

## Impacto:
- Nuevos endpoints y lógica de backend para gestión de archivos.
- Cambios en la base de datos (nuevo modelo y relación con Clase).
- Requiere que el worker de Celery esté corriendo.

## Dependencias:
- PyMuPDF (para extracción de texto de PDF)
- Celery (procesamiento asíncrono)
- Redis (broker de Celery)

## Instrucciones Adicionales:
- Asegurarse de que el worker de Celery esté corriendo para procesar las tareas de extracción.
- Configurar la variable de entorno `MAX_UPLOAD_SIZE` (ej. `MAX_UPLOAD_SIZE=10485760` para 10MB).
- Revisar los logs del worker de Celery para el estado del procesamiento de archivos.

## Advertencias/Precauciones (si aplica):
- El almacenamiento local de archivos en `uploads/` es temporal para desarrollo. Planificar migración a cloud storage para producción.
- Monitorear el consumo de recursos de las tareas de Celery.

## Archivos Relevantes (si aplica):
- backend/app/models/archivo_cargado.py
- backend/app/routes/documents.py
- backend/app/tasks/document_processing.py
- backend/app/schemas/archivo_cargado_schemas.py
- backend/app/models/clase.py
- backend/app/__init__.py
