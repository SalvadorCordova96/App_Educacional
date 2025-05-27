# app/schemas/modulo_schemas.py
from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from datetime import datetime
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema
from ..models.modulo import Modulo
from .validators import validate_positive_number, validate_date_not_in_past


class ModuloSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de objetos Módulo.
    """

    class Meta:
        model = Modulo
        load_instance = True
        include_fk = True
        unknown = EXCLUDE

    id = auto_field(dump_only=True)

    titulo = auto_field(
        required=True,
        validate=validate.Length(
            min=3, max=255, error="El título debe tener entre 3 y 255 caracteres"
        ),
    )

    descripcion = auto_field(
        validate=validate.Length(
            max=1000, error="La descripción no puede exceder los 1000 caracteres"
        ),
        allow_none=True,
    )

    orden = auto_field(
        required=True,
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
    )

    fecha_creacion = auto_field(dump_only=True)
    fecha_actualizacion = auto_field(dump_only=True)
    # fecha_inicio = auto_field(allow_none=True, validate=validate_date_not_in_past)

    # fecha_fin = auto_field(allow_none=True, validate=validate_date_not_in_past)

    # Relaciones
    clase_id = auto_field(required=True, load_only=True)

    clase = fields.Nested(
        "ClaseSchema", only=("id", "titulo", "imagen_url"), dump_only=True
    )

    lecciones = fields.Nested(
        "LeccionSchema", many=True, exclude=("modulo",), dump_only=True
    )

    # Validaciones personalizadas
    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("fecha_fin")
    def validate_fechas(self, value, **kwargs):
        """Valida que la fecha de fin sea posterior a la fecha de inicio."""
        if "fecha_inicio" in self.context and value:
            fecha_inicio = self.context["fecha_inicio"]
            if isinstance(fecha_inicio, str):
                fecha_inicio = datetime.fromisoformat(
                    fecha_inicio.replace("Z", "+00:00")
                )
            if isinstance(value, str):
                value = datetime.fromisoformat(value.replace("Z", "+00:00"))

            if value < fecha_inicio:
                raise ValidationError(
                    "La fecha de fin debe ser posterior a la fecha de inicio"
                )


class ModuloCreateSchema(BaseSchema):
    """
    Esquema para la creación de nuevos módulos.
    """

    titulo = fields.Str(
        required=True,
        validate=validate.Length(
            min=3, max=255, error="El título debe tener entre 3 y 255 caracteres"
        ),
    )

    descripcion = fields.Str(
        validate=validate.Length(
            max=1000, error="La descripción no puede exceder los 1000 caracteres"
        ),
        allow_none=True,
    )

    orden = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
    )

    clase_id = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El ID de la clase debe ser un número positivo"
        ),
    )

    fecha_inicio = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    fecha_fin = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("fecha_fin")
    def validate_fechas(self, value, **kwargs):
        """Valida que la fecha de fin sea posterior a la fecha de inicio."""
        if "fecha_inicio" in self.context and value:
            fecha_inicio = self.context["fecha_inicio"]
            if isinstance(fecha_inicio, str):
                fecha_inicio = datetime.fromisoformat(
                    fecha_inicio.replace("Z", "+00:00")
                )
            if isinstance(value, str):
                value = datetime.fromisoformat(value.replace("Z", "+00:00"))

            if value < fecha_inicio:
                raise ValidationError(
                    "La fecha de fin debe ser posterior a la fecha de inicio"
                )


class ModuloUpdateSchema(BaseSchema):
    """
    Esquema para la actualización de módulos existentes.
    """

    titulo = fields.Str(
        validate=validate.Length(
            min=3, max=255, error="El título debe tener entre 3 y 255 caracteres"
        ),
        allow_none=True,
    )

    descripcion = fields.Str(
        validate=validate.Length(
            max=1000, error="La descripción no puede exceder los 1000 caracteres"
        ),
        allow_none=True,
    )

    orden = fields.Int(
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    fecha_inicio = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    fecha_fin = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío si se proporciona."""
        if value is not None and not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("fecha_fin")
    def validate_fechas(self, value, **kwargs):
        """Valida que la fecha de fin sea posterior a la fecha de inicio."""
        if "fecha_inicio" in self.context and value:
            fecha_inicio = self.context["fecha_inicio"]
            if fecha_inicio and value:
                if isinstance(fecha_inicio, str):
                    fecha_inicio = datetime.fromisoformat(
                        fecha_inicio.replace("Z", "+00:00")
                    )
                if isinstance(value, str):
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))

                if value < fecha_inicio:
                    raise ValidationError(
                        "La fecha de fin debe ser posterior a la fecha de inicio"
                    )


class ModuloConLeccionesSchema(ModuloSchema):
    """
    Esquema que incluye las lecciones del módulo.
    """

    lecciones = fields.Nested(
        "LeccionSchema", many=True, exclude=("modulo",), dump_only=True
    )


class ModuloPaginacionSchema(PaginacionSchema):
    """
    Esquema para la paginación de módulos.
    """

    items = fields.Nested(ModuloSchema, many=True, dump_only=True)
