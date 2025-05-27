# 2025-05-22 Migración de Almacenamiento de Archivos a Servicio en la Nube

**Fecha y Hora:** 2025-05-22 00:50
**Responsable(s):** Asistente IA

**Descripción del Proceso/Cambio:**
Se modificó la funcionalidad de subida de archivos para utilizar un servicio de almacenamiento de objetos en la nube (ej. AWS S3) en lugar del sistema de ficheros local del servidor. Esto implicó:
- Actualizar el endpoint `POST /api/v1/documents/upload` en `app/routes/documents.py` para subir los archivos directamente al bucket S3 configurado.
- Modificar el modelo `ArchivoCargado` para que el campo `ruta_almacenamiento` almacene la URL o identificador del objeto en S3.
- Ajustar la tarea Celery `extraer_texto_archivo` en `app/tasks/document_processing.py` para descargar el archivo desde S3 a una ubicación temporal antes del procesamiento y asegurar su limpieza posterior.
- Configurar el acceso al servicio S3 mediante variables de entorno para las credenciales y el nombre del bucket.

**Justificación:**
El almacenamiento local de archivos no es escalable ni adecuado para entornos de producción distribuidos o serverless. La migración a un servicio de almacenamiento en la nube es esencial para la durabilidad, disponibilidad y escalabilidad de los archivos subidos por los usuarios, como se indica en el PDE (Sección 7) y el `Plan de Acción_ Mejoras.md` (Punto 1).

**Impacto:**
-   Mayor escalabilidad y fiabilidad del sistema de almacenamiento de archivos.
-   Desacoplamiento del almacenamiento de archivos de las instancias de la aplicación.
-   Requiere configuración de un bucket S3 (o similar) y credenciales de acceso en el entorno de despliegue.
-   La tarea Celery ahora tiene una dependencia de red adicional para descargar archivos.

**Dependencias:**
-   `boto3` (SDK de AWS para Python) - Se debe añadir a `requirements.txt`.
-   (O el SDK correspondiente si se elige otro proveedor como Google Cloud Storage o Azure Blob Storage).

**Instrucciones Adicionales:**
-   Configurar las variables de entorno necesarias para el acceso al servicio de almacenamiento en la nube (ej. `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`).
-   Asegurar que los permisos del bucket/contenedor en la nube estén correctamente configurados para permitir la subida por la aplicación y el acceso por la tarea Celery.
-   Monitorear los costos asociados con el servicio de almacenamiento en la nube.

**Advertencias/Precauciones (si aplica):**
-   La latencia en la subida/descarga de archivos desde/hacia el servicio en la nube puede ser un factor a considerar.
-   La gestión segura de credenciales de acceso al servicio de almacenamiento es crítica.
-   Asegurar la limpieza de archivos temporales en los workers de Celery después del procesamiento es importante para evitar el agotamiento del disco local del worker.
