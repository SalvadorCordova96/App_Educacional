# app/schemas/archivo_cargado_schemas.py
# BACKEND-REVIEW: 2025-05-20 - SCHEMA-UPLOAD-01 - Esquema Marshmallow para ArchivoCargado
# Permite la validación y serialización de archivos subidos por docentes.

from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from .base_schemas import BaseSchema, BaseSQLAlchemySchema
from ..models.archivo_cargado import ArchivoCargado

class ArchivoCargadoSchema(BaseSQLAlchemySchema):
    class Meta:
        model = ArchivoCargado
        load_instance = True
        include_fk = True
        unknown = EXCLUDE

    id = auto_field(dump_only=True)
    nombre_original = auto_field(required=True)
    nombre_servidor = auto_field(dump_only=True)
    tipo_mime = auto_field(required=True)
    tamano = auto_field(required=True) # Will be set from file properties, but good for serialization
    ruta_almacenamiento = auto_field(dump_only=True)
    usuario_id = auto_field(dump_only=True) # Will be set from JWT, dump_only for response
    clase_id = auto_field(required=True, allow_none=False) # Changed as per model
    fecha_subida = auto_field(dump_only=True)
    estado_procesamiento_texto = auto_field(dump_only=True)
    texto_extraido = auto_field(dump_only=True)
    fecha_procesamiento = auto_field(dump_only=True)
    mensaje_error = auto_field(dump_only=True)

# ArchivoCargadoCreateSchema is removed as the creation process for file uploads
# will primarily involve handling the file itself, and the ArchivoCargado record
# will be created directly in the route handler using metadata from the file and request.
# The ArchivoCargadoSchema will be used for serializing the response.
