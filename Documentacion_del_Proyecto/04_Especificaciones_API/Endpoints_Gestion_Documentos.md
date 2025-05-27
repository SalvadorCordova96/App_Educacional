# Endpoints Gestión de Documentos

## POST /api/v1/documents/upload
Permite a docentes subir archivos PDF o TXT asociados a una clase.

### Parámetros (multipart/form-data)
- `file`: Archivo a subir (PDF o TXT, obligatorio)
- `clase_id`: ID de la clase a la que se asocia el archivo (opcional)

### Encabezados
- `Authorization: Bearer <token>` (requerido)

### Respuestas
- 201 Created: Retorna los metadatos del archivo subido y encola la tarea de extracción de texto.
- 400 Bad Request: Si el archivo no es válido, excede el tamaño permitido o el tipo no es soportado.

### Ejemplo de respuesta exitosa
```json
{
  "id": 1,
  "nombre_original": "documento.pdf",
  "nombre_servidor": "uuid_documento.pdf",
  "tipo_mime": "application/pdf",
  "tamano": 123456,
  "ruta_almacenamiento": "uploads/uuid_documento.pdf",
  "usuario_id": 5,
  "clase_id": 2,
  "fecha_subida": "2025-05-20T12:34:56Z",
  "estado_procesamiento_texto": "pendiente",
  "texto_extraido": null,
  "fecha_procesamiento": null,
  "mensaje_error": null
}
```

### Notas
- El procesamiento de texto es asíncrono; el campo `texto_extraido` estará disponible cuando Celery termine la tarea.
- El endpoint valida tipo MIME, tamaño y nombre de archivo.
- Solo usuarios autenticados pueden subir archivos.

## Referencias
- Implementación: `backend/app/routes/documents.py`
- Tarea de extracción: `backend/app/tasks/document_processing.py`
- Modelo: `backend/app/models/archivo_cargado.py`
