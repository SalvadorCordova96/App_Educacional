# app/schemas/clase_schemas.py
from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from datetime import datetime
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema
from ..models.clase import Clase
from .validators import validate_positive_number, validate_date_not_in_past


class ClaseSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de objetos Clase.
    """

    class Meta:
        model = Clase
        load_instance = True
        include_fk = True
        unknown = EXCLUDE

    id = auto_field(dump_only=True)
    nombre = auto_field(
        required=True,
        validate=validate.Length(
            min=3, max=255, error="El nombre debe tener entre 3 y 255 caracteres"
        ),
    )

    descripcion = auto_field(
        validate=validate.Length(
            max=1000, error="La descripción no puede exceder los 1000 caracteres"
        ),
        allow_none=True,
    )

    imagen_url = auto_field(
        allow_none=True, validate=validate.URL(error="La URL de la imagen no es válida")
    )

    activa = auto_field(dump_only=True)
    fecha_creacion = auto_field(dump_only=True)
    fecha_actualizacion = auto_field(dump_only=True)

    # Relaciones
    docente_id = auto_field(required=True)
    docente = fields.Nested(
        "UsuarioSchema",
        only=("id", "nombre_completo", "correo_electronico"),
        dump_only=True,
    )

    modulos = fields.Nested(
        "ModuloSchema", many=True, exclude=("clase",), dump_only=True
    )

    estudiantes = fields.Nested(
        "UsuarioSchema",
        many=True,
        only=("id", "nombre_completo", "correo_electronico"),
        dump_only=True,
    )

    # Validaciones personalizadas
    @validates("nombre")
    def validate_nombre(self, value):
        """Valida que el nombre no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El nombre no puede estar vacío")


class ClaseCreateSchema(BaseSchema):
    """
    Esquema para la creación de nuevas clases.
    """

    nombre = fields.Str(
        required=True,
        validate=validate.Length(
            min=3, max=255, error="El nombre debe tener entre 3 y 255 caracteres"
        ),
    )

    descripcion = fields.Str(
        validate=validate.Length(
            max=1000, error="La descripción no puede exceder los 1000 caracteres"
        ),
        allow_none=True,
    )

    imagen_url = fields.Url(
        allow_none=True, error_messages={"invalid": "La URL de la imagen no es válida"}
    )

    @validates("nombre")
    def validate_nombre(self, value):
        """Valida que el nombre no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El nombre no puede estar vacío")


class ClaseUpdateSchema(BaseSchema):
    """
    Esquema para la actualización de clases existentes.
    """

    nombre = fields.Str(
        validate=validate.Length(
            min=3, max=255, error="El nombre debe tener entre 3 y 255 caracteres"
        ),
        allow_none=True,
    )

    descripcion = fields.Str(
        validate=validate.Length(
            max=1000, error="La descripción no puede exceder los 1000 caracteres"
        ),
        allow_none=True,
    )

    imagen_url = fields.Url(
        allow_none=True, error_messages={"invalid": "La URL de la imagen no es válida"}
    )

    activa = fields.Bool(allow_none=True)

    @validates("nombre")
    def validate_nombre(self, value):
        """Valida que el nombre no esté vacío si se proporciona."""
        if value is not None and not value.strip():
            raise ValidationError("El nombre no puede estar vacío")


class ClaseConModulosSchema(ClaseSchema):
    """
    Esquema que incluye los módulos de la clase con sus lecciones.
    """

    modulos = fields.Nested(
        "ModuloConLeccionesSchema", many=True, exclude=("clase",), dump_only=True
    )


class ClaseEstadisticasSchema(ClaseSchema):
    """
    Esquema que incluye estadísticas de la clase.
    """

    total_estudiantes = fields.Int(
        dump_only=True,
        validate=validate.Range(
            min=0, error="El total de estudiantes no puede ser negativo"
        ),
    )

    total_modulos = fields.Int(
        dump_only=True,
        validate=validate.Range(
            min=0, error="El total de módulos no puede ser negativo"
        ),
    )

    total_lecciones = fields.Int(
        dump_only=True,
        validate=validate.Range(
            min=0, error="El total de lecciones no puede ser negativo"
        ),
    )

    total_evaluaciones = fields.Int(
        dump_only=True,
        validate=validate.Range(
            min=0, error="El total de evaluaciones no puede ser negativo"
        ),
    )

    promedio_calificaciones = fields.Float(
        dump_only=True,
        validate=validate.Range(
            min=0,
            max=100,
            error="El promedio de calificaciones debe estar entre 0 y 100",
        ),
    )

    # Sobrescribir los campos que no son relevantes para las estadísticas
    modulos = None
    estudiantes = None
    docente = None


class ClasePaginacionSchema(PaginacionSchema):
    """
    Esquema para la paginación de clases.
    """

    items = fields.Nested(ClaseSchema, many=True, dump_only=True)
    estudiantes_abandonados = fields.Int(required=True)
    calificacion_promedio = fields.Float(required=True, allow_none=True)

    # Distribución de calificaciones
    distribucion_calificaciones = fields.Dict(
        keys=fields.Str(), values=fields.Int(), required=True
    )
