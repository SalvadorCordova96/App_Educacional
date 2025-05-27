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
    tamano = auto_field(required=True)
    ruta_almacenamiento = auto_field(dump_only=True)
    usuario_id = auto_field(required=True)
    clase_id = auto_field(allow_none=True)
    fecha_subida = auto_field(dump_only=True)
    estado_procesamiento_texto = auto_field(dump_only=True)
    texto_extraido = auto_field(dump_only=True)
    fecha_procesamiento = auto_field(dump_only=True)
    mensaje_error = auto_field(dump_only=True)

class ArchivoCargadoCreateSchema(BaseSchema):
    nombre_original = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    tipo_mime = fields.Str(required=True, validate=validate.OneOf(["application/pdf", "text/plain"]))
    tamano = fields.Int(required=True, validate=validate.Range(min=1, max=10485760))  # 10MB max
    usuario_id = fields.Int(required=True)
    clase_id = fields.Int(allow_none=True)

    class Meta:
        unknown = EXCLUDE
