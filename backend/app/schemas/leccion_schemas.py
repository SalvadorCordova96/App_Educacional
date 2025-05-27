# app/schemas/leccion_schemas.py
from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from datetime import datetime
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema
from ..models.leccion import Leccion
from .validators import (
    validate_positive_number,
    validate_date_not_in_past,
    validate_html_content,
)


class LeccionSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de objetos Lección.
    """

    class Meta:
        model = Leccion
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

    # descripcion = auto_field(
    #     validate=validate.Length(
    #         max=1000, error="La descripción no puede exceder los 1000 caracteres"
    #     ),
    #     allow_none=True,
    # )

    contenido = auto_field(required=True, validate=validate_html_content)

    tipo = auto_field(
        required=True,
        validate=validate.OneOf(
            ["teoria", "ejercicio", "examen"],
            error="El tipo debe ser 'teoria', 'ejercicio' o 'examen'",
        ),
    )

    duracion_minutos = auto_field(
        validate=validate.Range(
            min=1, error="La duración debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    orden = auto_field(
        required=True,
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
    )

    # es_publica = auto_field(
    #     required=False,
    #     allow_none=True,
    #     error_messages={"invalid": "El campo es_publica debe ser un valor booleano"},
    # )

    # fecha_publicacion = auto_field(allow_none=True)
    fecha_creacion = auto_field(dump_only=True)
    fecha_actualizacion = auto_field(dump_only=True)

    # Relaciones
    modulo_id = auto_field(required=True, load_only=True)

    modulo = fields.Nested(
        "ModuloSchema", only=("id", "titulo", "clase_id"), dump_only=True
    )

    evaluacion = fields.Nested(
        "EvaluacionSchema", only=("id", "titulo", "puntaje_aprobacion"), dump_only=True
    )

    # Validaciones personalizadas
    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("contenido")
    def validate_contenido(self, value):
        """Valida que el contenido no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El contenido no puede estar vacío")

    # @validates("fecha_publicacion")
    # def validate_fecha_publicacion(self, value):
    #     """Valida que la fecha de publicación no sea en el pasado."""
    #     if value and isinstance(value, str):
    #         try:
    #             value = datetime.fromisoformat(value.replace("Z", "+00:00"))
    #         except (ValueError, AttributeError):
    #             raise ValidationError(
    #                 "Formato de fecha inválido. Use el formato ISO 8601"
    #             )
    #
    #     if value and value < datetime.utcnow():
    #         raise ValidationError("La fecha de publicación no puede ser en el pasado")


class LeccionCreateSchema(BaseSchema):
    """
    Esquema para la creación de nuevas lecciones.
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

    contenido = fields.Str(required=True, validate=validate_html_content)

    tipo = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["teoria", "ejercicio", "examen"],
            error="El tipo debe ser 'teoria', 'ejercicio' o 'examen'",
        ),
    )

    duracion_minutos = fields.Int(
        validate=validate.Range(
            min=1, error="La duración debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    orden = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
    )

    es_publica = fields.Bool(
        load_default=True,
        error_messages={"invalid": "El campo es_publica debe ser un valor booleano"},
    )

    modulo_id = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El ID del módulo debe ser un número positivo"
        ),
    )

    fecha_publicacion = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    # Validaciones personalizadas
    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("contenido")
    def validate_contenido(self, value):
        """Valida que el contenido no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El contenido no puede estar vacío")

    @validates("fecha_publicacion")
    def validate_fecha_publicacion(self, value):
        """Valida que la fecha de publicación no sea en el pasado."""
        if value and isinstance(value, str):
            try:
                value = datetime.fromisoformat(value.replace("Z", "+00:00"))
            except (ValueError, AttributeError):
                raise ValidationError(
                    "Formato de fecha inválido. Use el formato ISO 8601"
                )

        if value and value < datetime.utcnow():
            raise ValidationError("La fecha de publicación no puede ser en el pasado")


class LeccionUpdateSchema(BaseSchema):
    """
    Esquema para la actualización de lecciones existentes.
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

    contenido = fields.Str(validate=validate_html_content, allow_none=True)

    tipo = fields.Str(
        validate=validate.OneOf(
            ["teoria", "ejercicio", "examen"],
            error="El tipo debe ser 'teoria', 'ejercicio' o 'examen'",
        ),
        allow_none=True,
    )

    duracion_minutos = fields.Int(
        validate=validate.Range(
            min=1, error="La duración debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    orden = fields.Int(
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    es_publica = fields.Bool(allow_none=True)

    fecha_publicacion = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    # Validaciones personalizadas
    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío si se proporciona."""
        if value is not None and not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("contenido")
    def validate_contenido(self, value):
        """Valida que el contenido no esté vacío si se proporciona."""
        if value is not None and not value.strip():
            raise ValidationError("El contenido no puede estar vacío")

    @validates("fecha_publicacion")
    def validate_fecha_publicacion(self, value):
        """Valida que la fecha de publicación no sea en el pasado."""
        if value:
            if isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except (ValueError, AttributeError):
                    raise ValidationError(
                        "Formato de fecha inválido. Use el formato ISO 8601"
                    )

            if value < datetime.utcnow():
                raise ValidationError(
                    "La fecha de publicación no puede ser en el pasado"
                )


class LeccionConEvaluacionSchema(LeccionSchema):
    """
    Esquema que incluye la evaluación asociada a la lección.
    """

    evaluacion = fields.Nested("EvaluacionSchema", exclude=("leccion",), dump_only=True)


class LeccionPaginacionSchema(PaginacionSchema):
    """
    Esquema para la paginación de lecciones.
    """

    items = fields.Nested(LeccionSchema, many=True, dump_only=True)
