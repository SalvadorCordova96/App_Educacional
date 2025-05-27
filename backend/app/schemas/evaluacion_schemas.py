# app/schemas/evaluacion_schemas.py
from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from datetime import datetime
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema
from ..models.evaluacion import Evaluacion
from .validators import (
    validate_positive_number,
    validate_date_not_in_past,
    validate_percentage,
)


class EvaluacionSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de objetos Evaluación.
    """

    class Meta:
        model = Evaluacion
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

    # instrucciones = fields.String()
    instrucciones = auto_field(allow_none=True)

    tiempo_limite_minutos = auto_field(
        validate=validate.Range(
            min=1, error="El tiempo límite debe ser un número positivo mayor que cero"
        )
    )

    intentos_permitidos = auto_field(
        validate=validate.Range(
            min=1, max=10, error="Los intentos permitidos deben estar entre 1 y 10"
        )
    )

    calificacion_aprobatoria = fields.Float(validate=validate_percentage)

    es_publica = auto_field()

    fecha_disponible_desde = auto_field(allow_none=True)
    fecha_disponible_hasta = auto_field(allow_none=True)
    fecha_creacion = auto_field(dump_only=True)
    fecha_actualizacion = auto_field(dump_only=True)

    # Relaciones
    # leccion_id is used to associate an Evaluacion with a Leccion upon creation/update.
    # The Evaluacion model itself does not have a leccion_id column.
    # The Leccion model has an evaluacion_id FK.
    leccion_id = fields.Integer(required=False, load_only=True, allow_none=True) # Changed from auto_field

    leccion = fields.Nested(
        "LeccionSchema", only=("id", "titulo", "modulo_id"), dump_only=True
    )

    preguntas = fields.Nested(
        "PreguntaSchema", many=True, exclude=("evaluacion",), dump_only=True
    )

    # Validaciones personalizadas
    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("fecha_disponible_hasta")
    def validate_fechas(self, value, **kwargs):
        """Valida que la fecha de disponibilidad hasta sea posterior a la fecha desde."""
        if "fecha_disponible_desde" in self.context and value:
            fecha_desde = self.context["fecha_disponible_desde"]
            if fecha_desde:
                if isinstance(fecha_desde, str):
                    fecha_desde = datetime.fromisoformat(
                        fecha_desde.replace("Z", "+00:00")
                    )
                if isinstance(value, str):
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))

                if value < fecha_desde:
                    raise ValidationError(
                        "La fecha de disponibilidad hasta debe ser posterior a la fecha desde"
                    )

    @validates("calificacion_aprobatoria")
    def validate_calificacion_aprobatoria(self, value):
        """Valida que la calificación aprobatoria sea un múltiplo de 0.5."""
        if value is not None and (value * 10) % 5 != 0:
            raise ValidationError(
                "La calificación aprobatoria debe ser un múltiplo de 0.5"
            )


class EvaluacionCreateSchema(BaseSchema):
    """
    Esquema para la creación de nuevas evaluaciones.
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

    instrucciones = fields.Str(
        validate=validate.Length(
            max=2000, error="Las instrucciones no pueden exceder los 2000 caracteres"
        ),
        allow_none=True,
    )

    tiempo_limite_minutos = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El tiempo límite debe ser un número positivo mayor que cero"
        ),
    )

    intentos_permitidos = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, max=10, error="Los intentos permitidos deben estar entre 1 y 10"
        ),
    )

    calificacion_aprobatoria = fields.Float(
        required=True,
        validate=[
            validate.Range(
                min=0,
                max=100,
                error="La calificación aprobatoria debe estar entre 0 y 100",
            ),
            validate_percentage,
        ],
    )

    es_publica = fields.Bool(
        load_default=True,
        error_messages={"invalid": "El campo es_publica debe ser un valor booleano"},
    )

    fecha_disponible_desde = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    fecha_disponible_hasta = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    leccion_id = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El ID de la lección debe ser un número positivo"
        ),
    )

    # Validaciones personalizadas
    @validates("titulo")
    def validate_titulo(self, value):
        """Valida que el título no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El título no puede estar vacío")

    @validates("fecha_disponible_hasta")
    def validate_fechas(self, value, **kwargs):
        """Valida que la fecha de disponibilidad hasta sea posterior a la fecha desde."""
        if "fecha_disponible_desde" in self.context and value:
            fecha_desde = self.context["fecha_disponible_desde"]
            if fecha_desde:
                if isinstance(fecha_desde, str):
                    fecha_desde = datetime.fromisoformat(
                        fecha_desde.replace("Z", "+00:00")
                    )
                if isinstance(value, str):
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))

                if value < fecha_desde:
                    raise ValidationError(
                        "La fecha de disponibilidad hasta debe ser posterior a la fecha desde"
                    )

    @validates("calificacion_aprobatoria")
    def validate_calificacion_aprobatoria(self, value):
        """Valida que la calificación aprobatoria sea un múltiplo de 0.5."""
        if value is not None and (value * 10) % 5 != 0:
            raise ValidationError(
                "La calificación aprobatoria debe ser un múltiplo de 0.5"
            )


class EvaluacionUpdateSchema(BaseSchema):
    """
    Esquema para la actualización de evaluaciones existentes.
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

    instrucciones = fields.Str(
        validate=validate.Length(
            max=2000, error="Las instrucciones no pueden exceder los 2000 caracteres"
        ),
        allow_none=True,
    )

    tiempo_limite_minutos = fields.Int(
        validate=validate.Range(
            min=1, error="El tiempo límite debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    intentos_permitidos = fields.Int(
        validate=validate.Range(
            min=1, max=10, error="Los intentos permitidos deben estar entre 1 y 10"
        ),
        allow_none=True,
    )

    calificacion_aprobatoria = fields.Float(
        validate=[
            validate.Range(
                min=0,
                max=100,
                error="La calificación aprobatoria debe estar entre 0 y 100",
            ),
            validate_percentage,
        ],
        allow_none=True,
    )

    es_publica = fields.Bool(allow_none=True)

    fecha_disponible_desde = fields.DateTime(
        allow_none=True,
        format="iso",
        error_messages={
            "invalid": "Formato de fecha inválido. Use el formato ISO 8601"
        },
    )

    fecha_disponible_hasta = fields.DateTime(
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

    @validates("fecha_disponible_hasta")
    def validate_fechas(self, value, **kwargs):
        """Valida que la fecha de disponibilidad hasta sea posterior a la fecha desde."""
        if "fecha_disponible_desde" in self.context and value:
            fecha_desde = self.context["fecha_disponible_desde"]
            if fecha_desde and value:
                if isinstance(fecha_desde, str):
                    fecha_desde = datetime.fromisoformat(
                        fecha_desde.replace("Z", "+00:00")
                    )
                if isinstance(value, str):
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))

                if value < fecha_desde:
                    raise ValidationError(
                        "La fecha de disponibilidad hasta debe ser posterior a la fecha desde"
                    )

    @validates("calificacion_aprobatoria")
    def validate_calificacion_aprobatoria(self, value):
        """Valida que la calificación aprobatoria sea un múltiplo de 0.5."""
        if value is not None and (value * 10) % 5 != 0:
            raise ValidationError(
                "La calificación aprobatoria debe ser un múltiplo de 0.5"
            )


class EvaluacionConPreguntasSchema(EvaluacionSchema):
    """
    Esquema que incluye las preguntas de la evaluación.
    """

    preguntas = fields.Nested(
        "PreguntaSchema", many=True, exclude=("evaluacion",), dump_only=True
    )


class EvaluacionPaginacionSchema(PaginacionSchema):
    """
    Esquema para la paginación de evaluaciones.
    """

    items = fields.Nested(EvaluacionSchema, many=True, dump_only=True)


class ResultadoEvaluacionSchema(BaseSchema):
    """
    Esquema para los resultados de una evaluación.
    """

    intento_actual = fields.Int(required=True)
    intentos_restantes = fields.Int(required=True)
    calificacion = fields.Float(required=True)
    aprobado = fields.Bool(required=True)
    respuestas_correctas = fields.Int(required=True)
    total_preguntas = fields.Int(required=True)
    fecha_completado = fields.DateTime(required=True)
    tiempo_tomado = fields.Int(required=True, description="Tiempo tomado en segundos")

    # Detalles por pregunta
    detalles_preguntas = fields.List(
        fields.Dict(), required=True, description="Detalles de cada pregunta respondida"
    )
